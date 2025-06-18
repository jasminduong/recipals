import { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as recipeClient from "../../Recipes/recipeClient";
import * as postClient from "../../Posts/postClient";
import * as userClient from "../../Account/client";
import { FormControl } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setRecipes } from "../../Recipes/recipeReducer";
import { setPosts } from "../../Posts/postReducer";
import RecipesTable from "../../Recipes/Admin/Table";
import RecipeDetails from "../../Recipes/Admin/Details";

export default function AllRecipes() {
  const { rid } = useParams();
  const [localRecipes, setLocalRecipes] = useState<any[]>([]);
  const [localPosts, setLocalPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [allRecipes, setAllRecipes] = useState<any[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const dispatch = useDispatch();

  // filters recipes
  const filterRecipes = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setLocalRecipes(allRecipes);
      return;
    }

    const filtered = allRecipes.filter((recipe) => {
      const term = searchTerm.toLowerCase();

      // gets creator username
      const creator = users.find((u) => u._id === recipe.user_created);
      const creatorUsername = creator?.username?.toLowerCase() || "";

      // checks recipe name, recipe id, username,
      return (
        recipe.name.toLowerCase().includes(term) ||
        recipe.recipe_id.toLowerCase().includes(term) ||
        creatorUsername.includes(term)
      );
    });

    setLocalRecipes(filtered);
  };

  // load recipes and posts
  const fetchRecipes = async () => {
    try {
      const allRecipes = await recipeClient.getAllRecipes();
      const allPosts = await postClient.getAllPosts();
      const allUsers = await userClient.getAllUsers();

      setAllRecipes(allRecipes);
      setLocalRecipes(allRecipes);
      setLocalPosts(allPosts);
      setUsers(allUsers);

      dispatch(setRecipes(allRecipes));
      dispatch(setPosts(allPosts));
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [rid]);

  return (
    <div className="position-relative">
      <div>
        <h5>All Recipes</h5>
        <FormControl
          onChange={(e) => filterRecipes(e.target.value)}
          placeholder="Search recipes by name, id, creator..."
          className="float-start me-2 admin-filter-recipe"
        />
        <div className="clearfix mb-3"></div>
        <RecipesTable recipes={localRecipes} posts={localPosts} />
      </div>

      {rid && isDataLoaded && (
        <RecipeDetails 
          recipes={allRecipes} 
          posts={localPosts} 
          users={users} 
        />
      )}
    </div>
  );
}
