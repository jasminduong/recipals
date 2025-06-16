import { createSlice } from "@reduxjs/toolkit";

// userReducer manages all users and user interactions

interface User {
  _id: string;
  following: string[];
  followers: string[];
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
  },
});

export const { setUsers, followUser, unfollowUser } = userSlice.actions;
export default userSlice.reducer;