import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const POSTS_API = `${REMOTE_SERVER}/api/posts`;
const axiosWithCredentials = axios.create({ withCredentials: true });

// Post client.ts integrates with the user routes implemented in the server

// creates a new recipe post
export const createPost = async (post: any) => {
  const response = await axiosWithCredentials.post(`${POSTS_API}`, post);
  return response.data;
};

// gets all posts
export const getAllPosts = async () => {
  const response = await axiosWithCredentials.get(`${POSTS_API}`);
  return response.data;
};

// gets a single post by post ID
export const getPostById = async (postId: string) => {
  const response = await axiosWithCredentials.get(`${POSTS_API}/${postId}`);
  return response.data;
};

// updates a post
export const updatePost = async (post: any) => {
  const response = await axiosWithCredentials.put(
    `${POSTS_API}/${post.post_id}`,
    post
  );
  return response.data;
};

// deletes a post
export const deletePost = async (postId: string) => {
  const response = await axiosWithCredentials.delete(
    `${POSTS_API}/${postId}`
  );
  return response.data;
};