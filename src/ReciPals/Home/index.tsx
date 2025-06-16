import RecipePost from "../Recipes/Post";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setPosts } from "../Recipes/postReducer";
import * as client from "../Account/client";
import * as postClient from "../Recipes/postClient";
import { setUsers } from "../Account/userReducer";

export default function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state: any) => state.postReducer.posts);
  const users = useSelector((state: any) => state.userReducer.users);

  // loads users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await client.getAllUsers();
        dispatch(setUsers(allUsers));
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    if (users.length === 0) {
      loadUsers();
    }
  }, [users.length, dispatch]);

  // loads posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts = await postClient.getAllPosts();
        dispatch(setPosts(allPosts));
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    if (posts.length === 0) {
      loadPosts();
    }
  }, [posts.length, dispatch]);

  return (
    <div id="recipals-home">
      {posts.map((post: any) => (
        <RecipePost key={post.post_id} post={post} />
      ))}
    </div>
  );
}
