import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { BsBookmarkFill } from "react-icons/bs";
import { setRecipes } from "../Recipes/recipeReducer";
import { setUsers, unsaveRecipe } from "../Account/userReducer";
import { setCurrentUser } from "../Account/reducer";
import * as recipeClient from "../Recipes/recipeClient";
import * as userClient from "../Account/client";

// represents the saved recipes page
export default function SavedRecipes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [unsavingRecipe, setUnsavingRecipe] = useState<string | null>(null);

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const recipes = useSelector((state: any) => state.recipeReducer.recipes);
  const users = useSelector((state: any) => state.userReducer.users);

  // redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/ReciPals/Account/Login");
    }
  }, [currentUser, navigate]);

  // load recipes and users data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [allUsers, allRecipes] = await Promise.all([
          userClient.getAllUsers(),
          recipeClient.getAllRecipes(),
        ]);

        dispatch(setUsers(allUsers));
        dispatch(setRecipes(allRecipes));

        const freshCurrentUser = allUsers.find(
          (u: any) => u._id === currentUser._id
        );
        if (freshCurrentUser) {
          dispatch(setCurrentUser(freshCurrentUser));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?._id) {
      loadData();
    }
  }, [currentUser?._id, dispatch]);

  // Get current user's saved recipes
  const currentUserFromUsers = users.find(
    (user: any) => user._id === currentUser?._id
  );
  const savedRecipeIds = currentUserFromUsers?.saved_recipes || [];

  // Get the actual recipe objects
  const savedRecipes = recipes.filter((recipe: any) =>
    savedRecipeIds.includes(recipe.recipe_id)
  );

  // Handle unsaving a recipe
  const handleUnsaveRecipe = async (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking bookmark

    if (!currentUser || unsavingRecipe === recipeId) return;

    setUnsavingRecipe(recipeId);

    try {
      await userClient.unsaveRecipe(currentUser._id, recipeId);
      dispatch(unsaveRecipe({ userId: currentUser._id, recipeId }));

      // ypdate current user in account reducer
      const updatedUser = {
        ...currentUser,
        saved_recipes:
          currentUser.saved_recipes?.filter((id: string) => id !== recipeId) ||
          [],
      };
      dispatch(setCurrentUser(updatedUser));
    } catch (error) {
      console.error("Error unsaving recipe:", error);
    } finally {
      setUnsavingRecipe(null);
    }
  };

  // handle recipe card click - navigate directly to recipe details
  const handleRecipeClick = (recipeId: string) => {
    navigate(`/ReciPals/Recipes/${recipeId}`);
  };

  if (!currentUser) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <p>Loading saved recipes...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <h3 className="mb-4">Saved Recipes</h3>

          {savedRecipes.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted fs-5 fst-italic">No saved recipes yet</p>
              <p className="text-muted">
                Start exploring recipes and save your favorites!
              </p>
            </div>
          ) : (
            <div
              className="saved-recipes-grid"
            >
              {savedRecipes.map((recipe: any) => (
                <div key={recipe.recipe_id}>
                  <Card
                    className="h-100 saved-recipe-card"
                    onClick={() => handleRecipeClick(recipe.recipe_id)}
                  >
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={recipe.photo}
                        className="saved-recipe-image"
                        alt={recipe.name}
                      />
                      <div
                        className="position-absolute top-0 end-0 m-2 saved-recipe-bookmark"
                        onClick={(e) => handleUnsaveRecipe(recipe.recipe_id, e)}
                        style={{
                          cursor:
                            unsavingRecipe === recipe.recipe_id
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        <BsBookmarkFill className="save-bookmark-icon" />
                      </div>
                    </div>
                    <Card.Body className="p-0">
                      <Card.Title className="fw-bold mt-4 mb-0 saved-recipe-title">
                        {recipe.name}
                      </Card.Title>
                      <Card.Text className="text-muted saved-recipe-description">
                        {recipe.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
