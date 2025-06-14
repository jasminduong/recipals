import { createSlice } from "@reduxjs/toolkit";
import { posts } from "../Database";

// create reducer's initial state with default posts copied from database
const initialState = {
  posts: posts,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // sets the posts
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    
    // creates a new post
    addPost: (state, { payload: post }) => {
      state.posts = [...state.posts, post];
    },
    
    // deletes the given post
    deletePost: (state, { payload: postId }) => {
      state.posts = state.posts.filter((p: any) => p.post_id !== postId);
    },
    
    // updates the given post
    updatePost: (state, { payload: post }) => {
      state.posts = state.posts.map((p: any) =>
        p.post_id === post.post_id ? post : p
      );
    },
  },
});

export const {
  setPosts,
  addPost,
  deletePost,
  updatePost,
} = postsSlice.actions;

export default postsSlice.reducer;