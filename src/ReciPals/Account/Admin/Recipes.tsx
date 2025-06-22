import { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as recipeClient from "../../Recipes/recipeClient";
import * as postClient from "../../Posts/postClient";
import * as userClient from "../../Account/client";
import { FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setRecipes } from "../../Recipes/recipeReducer";
import { setPosts } from "../../Posts/postReducer";
import RecipesTable from "../../Recipes/Admin/Table";
import RecipeDetails from "../../Recipes/Admin/Details";

// represents the admin recipes filtering
export default function AllRecipes() {
  const { rid } = useParams();
  const reduxRecipes = useSelector((state: any) => state.recipeReducer.recipes);
  const reduxPosts = useSelector((state: any) => state.postReducer.posts);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (reduxRecipes.length >= 0) {
      filterRecipes(searchTerm);
    }
  }, [reduxRecipes, searchTerm, users]);

  useEffect(() => {
    if (!rid && reduxRecipes.length > 0) {
      filterRecipes(searchTerm);
    }
  }, [rid]);

  // filters recipes
  const filterRecipes = (searchTerm: string) => {
    setSearchTerm(searchTerm);

    if (!searchTerm.trim()) {
      setFilteredRecipes([...reduxRecipes]); 
      return;
    }

    const filtered = reduxRecipes.filter((recipe: any) => {
      const term = searchTerm.toLowerCase();

      const creator = users.find((u) => u._id === recipe.user_created);
      const creatorUsername = creator?.username?.toLowerCase() || "";

      return (
        recipe.name.toLowerCase().includes(term) ||
        recipe.recipe_id.toLowerCase().includes(term) ||
        creatorUsername.includes(term)
      );
    });

    setFilteredRecipes(filtered);
  };

  // load recipes and posts
  const fetchRecipes = async () => {
    try {
      const allRecipes = await recipeClient.getAllRecipes();
      const allPosts = await postClient.getAllPosts();
      const allUsers = await userClient.getAllUsers();

      setUsers(allUsers);

      dispatch(setRecipes(allRecipes));
      dispatch(setPosts(allPosts));

      setFilteredRecipes([...allRecipes]);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="position-relative">
      <div>
        <h5>All Recipes</h5>
        <FormControl
          onChange={(e) => filterRecipes(e.target.value)}
          placeholder="Search recipes by name, id, creator..."
          className="float-start me-2 admin-filter-recipe"
          value={searchTerm}
        />
        <div className="clearfix mb-3"></div>
        <RecipesTable recipes={filteredRecipes} posts={reduxPosts} />
      </div>

      {rid && isDataLoaded && (
        <RecipeDetails
          recipes={reduxRecipes}
          posts={reduxPosts}
          users={users}
        />
      )}
    </div>
  );
}
