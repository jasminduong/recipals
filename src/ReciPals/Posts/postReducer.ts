import { createSlice } from "@reduxjs/toolkit";

interface Comment {
  comment_id: string;
  user_id: string;
  text: string;
  created_at: string;
}

interface Post {
  post_id: string;
  recipe_id: string;
  created_by: string;
  title: string;
  caption: string;
  photo: string;
  likes: string[]; 
  comments: Comment[];
  created_at: string;
}

interface PostsState {
  posts: Post[];
}

// create reducer's initial state with default posts copied from database
const initialState: PostsState = {
  posts: [],
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

    // adds a new comment
    addComment: (state, { payload: { postId, comment } }) => {
      const post = state.posts.find((p: any) => p.post_id === postId);
      if (post) {
        post.comments = [...(post.comments || []), comment];
      }
    },

    // likes a post
    likePost: (state, { payload: { postId, userId } }) => {
      const post = state.posts.find((p: any) => p.post_id === postId);
      if (post) {
        if (!post.likes.includes(userId)) {
          post.likes = [...post.likes, userId];
        }
      }
    },

    // unlikes a post
    unlikePost: (state, { payload: { postId, userId } }) => {
      const post = state.posts.find((p: any) => p.post_id === postId);
      if (post) {
        post.likes = post.likes.filter((id: any) => id !== userId);
      }
    },
  },
});

export const { setPosts, addPost, deletePost, updatePost, likePost, unlikePost, addComment } = postsSlice.actions;
export default postsSlice.reducer;
