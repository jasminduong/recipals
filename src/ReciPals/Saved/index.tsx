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
  const currentUserData = users.find((user: any) => user._id === currentUser?._id);
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
        saved_recipes: currentUser.saved_recipes?.filter((id: string) => id !== recipeId) || []
      };
      dispatch(setCurrentUser(updatedUser));
      
    } catch (error) {
      console.error('Error unsaving recipe:', error);
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
    <Container className="mt-4" id="saved-recipes">
      <Row>
        <Col>
          <h2 className="mb-4">Saved Recipes</h2>
          
          {savedRecipes.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted fs-5">No saved recipes yet</p>
              <p className="text-muted">
                Start exploring recipes and save your favorites!
              </p>
            </div>
          ) : (
            <Row className="g-4">
              {savedRecipes.map((recipe: any) => (
                <Col key={recipe.recipe_id} xs={12} sm={6} md={6} xl={6}>
                  <Card 
                    className="h-100 saved-recipe-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRecipeClick(recipe.recipe_id)}
                  >
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={recipe.photo}
                        style={{
                          height: '250px',
                          objectFit: 'cover'
                        }}
                        alt={recipe.name}
                      />
                      <div 
                        className="position-absolute top-0 end-0 m-2"
                        onClick={(e) => handleUnsaveRecipe(recipe.recipe_id, e)}
                        style={{ 
                          cursor: unsavingRecipe === recipe.recipe_id ? 'not-allowed' : 'pointer',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '50%',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <BsBookmarkFill
                          style={{
                            width: '18px',
                            height: '18px',
                            color: '#000000'
                          }}
                        />
                      </div>
                    </div>
                    <Card.Body className="p-3">
                      <Card.Title 
                        className="fw-bold mb-2" 
                        style={{ 
                          fontSize: '1.1rem',
                          lineHeight: '1.3',
                          minHeight: '2.6rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {recipe.name}
                      </Card.Title>
                      <Card.Text 
                        className="text-muted" 
                        style={{ 
                          fontSize: '0.9rem',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {recipe.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}