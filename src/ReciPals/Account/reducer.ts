import { createSlice } from "@reduxjs/toolkit";

// accountReducer manages the account-related state

// initializes the state that will hold information related to the current user
const initialState = {
  currentUser: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  // registers reducer setCurrentUser() that update the state
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});
export const { setCurrentUser } = accountSlice.actions; // allows setCurrentUser to be dispatched from anywhere in app to update the redux state
export default accountSlice.reducer;
