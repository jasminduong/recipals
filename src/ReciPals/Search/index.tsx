import { Col, Container, FormControl, Row } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRecipes, searchRecipesByName } from './reducer';
import type { RootState, AppDispatch } from '../store';

export default function Search() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { recipes, loading, error } = useSelector((state: RootState) => state.searchReducer);
  const [searchTerm, setSearchTerm] = useState("");

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

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

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
              style={{ cursor: 'pointer' }}
              className="recipe-card"
            >
              <Row className="mt-5 ms-1 mb-5">
                <Col xs={3} className="mb-3 mb-md-0">
                  <img
                    src={recipe.photo}
                    className="img-fluid"
                    style={{ 
                      width: "200px", 
                      height: "200px",
                      objectFit: "cover" 
                    }}
                    alt={recipe.name}
                  />
                </Col>
                <Col xs={9}>
                  <div className="recipe-body">
                    {recipe.user_created}
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="recipe-title">
                      {recipe.name}
                    </div>
                    <div className="recipe-sub-title">
                      <b>Total Time:</b> {recipe.total_time}
                    </div>
                  </div>
                  <div className="recipe-sub-title">
                    {recipe.description}
                  </div>
                </Col>
              </Row>
              <hr/>
            </div>
          ))
        )}
      </div>
    </Container>   
  );
}