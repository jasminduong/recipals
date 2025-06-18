import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/reducer";
import recipeReducer from "./Recipes/recipeReducer";
import postReducer from "./Posts/postReducer";
import userReducer from "./Account/userReducer";

const store = configureStore({
  reducer: {
    accountReducer,
    recipeReducer,
    postReducer,
    userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
