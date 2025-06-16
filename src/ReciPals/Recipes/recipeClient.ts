import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const RECIPES_API = `${REMOTE_SERVER}/api/recipes`;
const axiosWithCredentials = axios.create({ withCredentials: true });

// Recipe client.ts integrates with the recipes routes implemented in the server

// creates a new recipe
export const createRecipe = async (recipe: any) => {
  const response = await axiosWithCredentials.post(`${RECIPES_API}`, recipe);
  return response.data;
};

// gets all recipes
export const getAllRecipes = async () => {
  const response = await axiosWithCredentials.get(`${RECIPES_API}`);
  return response.data;
};

// gets a single recipe by recipe ID
export const getRecipeById = async (recipeId: string) => {
  const response = await axiosWithCredentials.get(`${RECIPES_API}/${recipeId}`);
  return response.data;
};

// updates a recipe
export const updateRecipe = async (recipe: any) => {
  const response = await axiosWithCredentials.put(
    `${RECIPES_API}/${recipe.recipe_id}`,
    recipe
  );
  return response.data;
};

// deletes a recipe
export const deleteRecipe = async (recipeId: string) => {
  const response = await axiosWithCredentials.delete(
    `${RECIPES_API}/${recipeId}`
  );
  return response.data;
};
