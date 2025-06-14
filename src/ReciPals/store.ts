import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/reducer";
import recipeReducer from "./Recipes/recipeReducer";
import postReducer from "./Recipes/postReducer";
import userReducer from "./Account/userReducer";

const store = configureStore({
  reducer: {
    accountReducer, recipeReducer, postReducer, userReducer
  },
});
export default store;
