import { Col, Container, FormControl, Row } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRecipes, searchRecipesByName } from "./reducer";
import type { RootState, AppDispatch } from "../store";

export default function Search() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { recipes, loading, error } = useSelector(
    (state: RootState) => state.searchReducer
  );
  const users = useSelector((state: any) => state.userReducer.users);
  const [searchTerm, setSearchTerm] = useState("");

  // gets username by user ID
  const getUsernameById = (userId: string) => {
    const user = users.find((user: any) => user._id === userId);
    return user?.username || "Unknown User";
  };

  // have recipes loaded in generic results
  const fetchAllRecipes = () => {
    dispatch(fetchRecipes());
  };

  // filter by user input
  const filterRecipesByName = (name: string) => {
    setSearchTerm(name);
    if (name.trim()) {
      dispatch(searchRecipesByName(name));
    } else {
      fetchAllRecipes();
    }
  };

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/ReciPals/Recipes/${recipeId}`);
  };

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  if (loading && recipes.length === 0) {
    return (
      <Container fluid className="mt-4 px-2 px-md-4">
        <div className="text-center mt-5">Loading recipes...</div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4 px-2 px-md-4" id="search">
      <div className="position-relative me-3 d-flex align-items-center mb-4">
        <FormControl
          onChange={(e) => filterRecipesByName(e.target.value)}
          placeholder="Search recipes, ingredients, users..."
          className="ps-5"
          value={searchTerm}
        />
        <div className="position-absolute top-50 translate-middle-y ms-3 text-secondary">
          <BiSearch />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div>
        {recipes.length === 0 && searchTerm && !loading ? (
          <div className="text-center mt-5">
            <p>No recipes found matching "{searchTerm}"</p>
          </div>
        ) : (
          recipes.map((recipe: any) => (
            <div
              key={recipe.recipe_id}
              onClick={() => handleRecipeClick(recipe.recipe_id)}
              style={{ cursor: "pointer" }}
              className="recipe-card"
            >
              <Row className="pt-2 pb-2">
                <Col xs={3} className="mb-3 mb-md-0">
                  <img
                    src={recipe.photo}
                    className="img-fluid"
                    style={{
                      width: "180px",
                      height: "180px",
                      objectFit: "cover",
                    }}
                    alt={recipe.name}
                  />
                </Col>
                <Col xs={9}>
                  <div className="recipe-body mt-2 mb-1">
                    {getUsernameById(recipe.user_created)}
                  </div>
                  <div className="d-flex justify-content-between align-items-end">                     
                    <div className="recipe-title">{recipe.name}</div>                     
                    <div className="recipe-sub-title">                       
                      <b>Total Time:</b> {recipe.total_time || "0+ min"}                    
                    </div>                   
                  </div> 
                  <div className="recipe-sub-title mt-3">
                    {recipe.description}
                  </div>
                </Col>
              </Row>
              <hr />
            </div>
          ))
        )}
      </div>
    </Container>
  );
}
