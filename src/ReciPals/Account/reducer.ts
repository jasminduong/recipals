import { createSlice } from "@reduxjs/toolkit";

// accountReducer manages the account-related state

// initializes the state that will hold information related to the current user
const initialState = {
  currentUser: null,
  newUser: {
    name: "",
    username: "",
    password: "",
    tags: [],
  },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    // sets current user data
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    // sets new user data
    setNewUser: (state, action) => {
      state.newUser = { ...state.newUser, ...action.payload };
    },
    // clears sign up data
    clearSignupData: (state) => {
      state.newUser = {
        name: "",
        username: "",
        password: "",
        tags: [],
      };
    },
  },
});
export const { setCurrentUser, setNewUser, clearSignupData } =
  accountSlice.actions;
export default accountSlice.reducer;
