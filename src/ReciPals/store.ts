import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/reducer";
import recipeReducer from "./Recipes/recipeReducer";
import postReducer from "./Recipes/postReducer";

const store = configureStore({
  reducer: {
    accountReducer, recipeReducer, postReducer
  },
});
export default store;
