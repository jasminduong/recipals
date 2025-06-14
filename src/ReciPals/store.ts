import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/reducer";
import recipeReducer from "./Recipes/recipeReducer";

const store = configureStore({
  reducer: {
    accountReducer, recipeReducer
  },
});
export default store;
