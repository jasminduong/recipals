import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/reducer";
import recipeReducer from "./Recipes/recipeReducer";
import postReducer from "./Posts/postReducer";
import userReducer from "./Account/userReducer";
import searchReducer from "./Search/reducer"; // Add search reducer

const store = configureStore({
  reducer: {
    accountReducer,
    recipeReducer,
    postReducer,
    userReducer,
    searchReducer, // Add this for search functionality
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;