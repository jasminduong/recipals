import { createSlice } from "@reduxjs/toolkit";

// userReducer manages all users and user interactions

interface User {
  _id: string;
  following: string[];
  followers: string[];
  saved_recipes?: string[];
}

interface UserState {
  users: User[];
}

// create reducer's initial state with default posts copied from database
const initialState: UserState = {
  users: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // sets all users data
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    // follows user
    followUser: (state, action) => {
      const { currentUserId, targetUserId } = action.payload;

      const currentUser = state.users.find(
        (user) => user._id === currentUserId
      );
      if (currentUser && !currentUser.following.includes(targetUserId)) {
        currentUser.following.push(targetUserId);
      }

      const targetUser = state.users.find((user) => (user._id === targetUserId));
      if (targetUser && !targetUser.followers.includes(currentUserId)) {
        targetUser.followers.push(currentUserId);
      }
    },

    // unfollows user
    unfollowUser: (state, action) => {
      const { currentUserId, targetUserId } = action.payload;

      const currentUser = state.users.find(
        (user) => user._id === currentUserId
      );
      if (currentUser) {
        currentUser.following = currentUser.following.filter(
          (id) => id !== targetUserId
        );
      }

      const targetUser = state.users.find((user) => user._id === targetUserId);
      if (targetUser) {
        targetUser.followers = targetUser.followers.filter(
          (id) => id !== currentUserId
        );
      }
    },

    // saves the given recipe to this user
    saveRecipe: (state, action) => {
      const { userId, recipeId } = action.payload;
      const user = state.users.find((user) => user._id === userId);
      if (user) {
        if (!user.saved_recipes) {
          user.saved_recipes = [];
        }
        if (!user.saved_recipes.includes(recipeId)) {
          user.saved_recipes.push(recipeId);
        }
      }
    },

    // unsaves the given recipe to this user
    unsaveRecipe: (state, action) => {
      const { userId, recipeId } = action.payload;
      const user = state.users.find((user) => user._id === userId);
      if (user && user.saved_recipes) {
        user.saved_recipes = user.saved_recipes.filter(id => id !== recipeId);
      }
    },
  },
  
});

export const { setUsers, followUser, unfollowUser, saveRecipe, unsaveRecipe } = userSlice.actions;
export default userSlice.reducer;