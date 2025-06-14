import { createSlice } from "@reduxjs/toolkit";
import { recipes } from "../Database";

// create reducer's initial state with default recipes copied from database
const initialState = {
  recipes: recipes,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    // sets the recipes
    setRecipes: (state, action) => {
      state.recipes = action.payload;
    },

    // creates a new recipe
    addRecipe: (state, { payload: recipe }) => {
      state.recipes = [...state.recipes, recipe];
    },

    // deletes the given recipe
    deleteRecipe: (state, { payload: recipeId }) => {
      state.recipes = state.recipes.filter((r: any) => r._id !== recipeId);
    },

    // updates the given recipe
    updateRecipe: (state, { payload: recipe }) => {
      state.recipes = state.recipes.map((r: any) =>
        r._id === recipe._id ? recipe : r
      );
    },
  },
});

export const {
  setRecipes,
  addRecipe,
  deleteRecipe,
  updateRecipe,
} = recipesSlice.actions;

export default recipesSlice.reducer;
