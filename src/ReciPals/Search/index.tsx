import { Col, Container, FormControl, Row } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRecipes, searchRecipesByName } from "./reducer";
import { setUsers } from "../Account/userReducer";
import * as userClient from "../Account/client";
import type { RootState, AppDispatch } from "../store";

export default function Search() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { recipes, loading, error } = useSelector(
    (state: RootState) => state.searchReducer
  );
  const users = useSelector((state: any) => state.userReducer.users);
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // gets username by user ID
  const getUsernameById = (userId: string) => {
    const user = users.find((user: any) => user._id === userId);
    return user?.username || "Unknown User";
  };

  // have recipes loaded in generic results
  const fetchAllRecipes = () => {
    dispatch(fetchRecipes());
  };

  // Load all users initially
  useEffect(() => {
    const loadUsers = async () => {
      try {
        if (users.length === 0) {
          const allUsers = await userClient.getAllUsers();
          dispatch(setUsers(allUsers));
        }
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    loadUsers();
  }, [users.length, dispatch]);

  // Search both recipes and users
  const handleSearch = async (searchValue: string) => {
    setSearchTerm(searchValue);
    
    // Search recipes
    if (searchValue.trim()) {
      dispatch(searchRecipesByName(searchValue));
    } else {
      fetchAllRecipes();
    }

    // Search users
    if (searchValue.trim()) {
      // Only show loading after a brief delay to prevent flickering
      let showLoading = false;
      const loadingTimer = setTimeout(() => {
        showLoading = true;
        setLoadingUsers(true);
      }, 300);

      try {
        const userSearchResults = await userClient.findUsersByPartialName(searchValue);
        clearTimeout(loadingTimer);
        if (showLoading) setLoadingUsers(false);
        setUserResults(userSearchResults);
      } catch (error) {
        console.error("Error searching users:", error);
        clearTimeout(loadingTimer);
        if (showLoading) setLoadingUsers(false);
        setUserResults([]);
      }
    } else {
      setUserResults([]);
      setLoadingUsers(false);
    }
  };

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/ReciPals/Recipes/${recipeId}`);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/ReciPals/Account/Profile/${userId}`);
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
    <Container fluid className="mt-4 px-2 px-md-4" id="search" style={{ minHeight: "100vh" }}>
      <div className="position-relative me-3 d-flex align-items-center mb-4">
        <FormControl
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search recipes, ingredients, users..."
          className="ps-5"
          value={searchTerm}
        />
        <div className="position-absolute top-50 translate-middle-y ms-3 text-secondary">
          <BiSearch />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* User Results Section */}
      {searchTerm && (
        <div className="mb-4">
          {loadingUsers ? (
            <div className="text-center">Loading users...</div>
          ) : userResults.length > 0 ? (
            <>
              <h5 className="mb-3">People</h5>
              {userResults.map((user: any) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  style={{ cursor: "pointer" }}
                  className="user-card mb-3 p-3 border rounded"
                >
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <img
                        src={user.profile}
                        className="rounded-circle"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                        alt={`${user.username} profile`}
                      />
                    </Col>
                    <Col>
                      <div className="fw-bold fs-5 mb-1">{user.username}</div>
                      <div className="text-muted">{user.name}</div>
                    </Col>
                  </Row>
                </div>
              ))}
              <hr className="my-4" />
            </>
          ) : null}
        </div>
      )}

      {/* Recipe Results Section */}
      <div>
        {searchTerm && <h5 className="mb-3">Recipes</h5>}
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