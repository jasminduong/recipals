import { Container, FormControl } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRecipes, searchRecipesByName } from "./reducer";
import { setUsers } from "../Account/userReducer";
import * as userClient from "../Account/client";
import type { RootState, AppDispatch } from "../store";

// represents the search page
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
  const [shuffledRecipes, setShuffledRecipes] = useState<any[]>([]);
  const [displayedRecipes, setDisplayedRecipes] = useState<any[]>([]);

  // helper method to shuffle an array
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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

  // loads shuffled recipes when recipes first load
  useEffect(() => {
    if (recipes.length > 0 && shuffledRecipes.length === 0) {
      const shuffled = shuffleArray(recipes);
      setShuffledRecipes(shuffled);
    }
  }, [recipes, shuffledRecipes.length]);

  // loads shuffled recipes if not search
  useEffect(() => {
    if (searchTerm.trim()) {
      // when searching, show filtered results as-is (not shuffled)
      setDisplayedRecipes(recipes);
    } else {
      // when not searching, show shuffled recipes
      setDisplayedRecipes(shuffledRecipes);
    }
  }, [recipes, searchTerm, shuffledRecipes]);

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
        const userSearchResults = await userClient.findUsersByPartialName(
          searchValue
        );
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
    <div className="container-fluid mt-4 px-2 px-md-4" id="search">
      {/* Search Bar */}
      <div className="position-relative d-flex align-items-center mb-4 w-100">
        <FormControl
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search recipes, ingredients, users..."
          className="ps-5 w-100"
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
                  className="user-card mb-3 p-3 border rounded"
                >
                  <div className="d-flex align-items-center w-100">
                    <div className="flex-shrink-0 me-3">
                      <img
                        src={user.profile}
                        className="rounded-circle search-user-profile-image"
                        alt={`${user.username} profile`}
                      />
                    </div>
                    <div className="flex-grow-1 text-truncate">
                      <div className="fw-bold fs-5 mb-1 text-truncate">
                        {user.username}
                      </div>
                      <div className="text-muted text-truncate">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <hr className="my-4" />
            </>
          ) : null}
        </div>
      )}

      {/* Recipe Results Section */}
      <div className="w-100">
        {searchTerm && <h5 className="mb-3">Recipes</h5>}
        {displayedRecipes.length === 0 && searchTerm && !loading ? (
          <div className="text-center mt-5">
            <p>No recipes found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="row">
            {displayedRecipes.map((recipe: any) => (
              <div key={recipe.recipe_id} className="col-12 mb-3">
                <div
                  onClick={() => handleRecipeClick(recipe.recipe_id)}
                  className="recipe-card h-100"
                >
                  <div className="row g-0 align-items-center py-3">
                    {/* Recipe Image */}
                    <div className="col-12 col-sm-4 col-md-3 mb-3 mb-sm-0">
                      <div className="d-flex justify-content-center justify-content-sm-start">
                        <img
                          src={recipe.photo}
                          className="img-fluid search-recipe-image"
                          alt={recipe.name}
                        />
                      </div>
                    </div>

                    {/* Recipe Content */}
                    <div className="col-12 col-sm-8 col-md-9">
                      <div className="ps-0 ps-sm-3">
                        <div className="recipe-body mb-2 text-muted text-truncate">
                          {getUsernameById(recipe.user_created)}
                        </div>

                        <div className="row align-items-start mb-2">
                          <div className="col-12 col-md-8">
                            <div className="recipe-title fw-bold fs-5 text-truncate">
                              {recipe.name}
                            </div>
                          </div>
                          <div className="col-12 col-md-4 text-md-end">
                            <div className="recipe-sub-title text-muted">
                              <b>Total Time:</b> {recipe.total_time || "1+ min"}
                            </div>
                          </div>
                        </div>

                        <div className="recipe-sub-title text-muted">
                          <div className="search-recipe-description">
                            {recipe.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="m-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
