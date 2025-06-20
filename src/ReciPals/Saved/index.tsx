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

export default function SavedRecipes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [unsavingRecipe, setUnsavingRecipe] = useState<string | null>(null);

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const recipes = useSelector((state: any) => state.recipeReducer.recipes);
  const users = useSelector((state: any) => state.userReducer.users);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/ReciPals/Account/Login");
    }
  }, [currentUser, navigate]);

  // Load recipes and users data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load recipes if not already loaded
        if (recipes.length === 0) {
          const allRecipes = await recipeClient.getAllRecipes();
          dispatch(setRecipes(allRecipes));
        }

        // Load users if not already loaded
        if (users.length === 0) {
          const allUsers = await userClient.getAllUsers();
          dispatch(setUsers(allUsers));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      loadData();
    }
  }, [currentUser, recipes.length, users.length, dispatch]);

  // Get current user's saved recipes
  const currentUserData = users.find(
    (user: any) => user._id === currentUser?._id
  );
  const savedRecipeIds = currentUserData?.saved_recipes || [];

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

      // Update current user in account reducer
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

  // Handle recipe card click - navigate directly to recipe details
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
              <p className="text-muted fs-5">No saved recipes yet</p>
              <p className="text-muted">
                Start exploring recipes and save your favorites!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                gap: "1rem",
              }}
            >
              {savedRecipes.map((recipe: any) => (
                <div key={recipe.recipe_id}>
                  <Card
                    className="h-100 saved-recipe-card"
                    style={{
                      cursor: "pointer",
                      minWidth: "290px",
                      width: "280px"
                    }}
                    onClick={() => handleRecipeClick(recipe.recipe_id)}
                  >
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={recipe.photo}
                        style={{
                          height: "150px",
                          objectFit: "cover",
                        }}
                        alt={recipe.name}
                      />
                      <div
                        className="position-absolute top-0 end-0 m-2"
                        onClick={(e) => handleUnsaveRecipe(recipe.recipe_id, e)}
                        style={{
                          cursor:
                            unsavingRecipe === recipe.recipe_id
                              ? "not-allowed"
                              : "pointer",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "50%",
                          padding: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        <BsBookmarkFill
                          className="bookmark-icon"
                          style={{
                            width: "14px",
                            height: "14px",
                            color: "#cd9f08",
                          }}
                        />
                      </div>
                    </div>
                    <Card.Body className="p-0">
                      <Card.Title
                        className="fw-bold mt-4 mb-0"
                        style={{
                          fontSize: "16px",
                          lineHeight: "1.3",
                          minHeight: "2.6rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          height: "1.3rem"
                        }}
                      >
                        {recipe.name}
                      </Card.Title>
                      <Card.Text
                        className="text-muted"
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.4",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          marginTop: "-12px" 
                        }}
                      >
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
