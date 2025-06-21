import RecipePost from "../Posts/Post";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setPosts } from "../Posts/postReducer";
import * as client from "../Account/client";
import * as postClient from "../Posts/postClient";
import { setUsers } from "../Account/userReducer";
import { setRecipes } from "../Recipes/recipeReducer";
import * as recipeClient from "../Recipes/recipeClient";

export default function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state: any) => state.postReducer.posts);
  const users = useSelector((state: any) => state.userReducer.users);
  const recipes = useSelector((state: any) => state.recipeReducer.recipes);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [sortedPosts, setSortedPosts] = useState<any[]>([]);

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

  // loads recipes
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const allRecipes = await recipeClient.getAllRecipes();
        dispatch(setRecipes(allRecipes));
      } catch (error) {
        console.error("Error loading recipes:", error);
      }
    };

    if (recipes.length === 0) {
      loadRecipes();
    }
  }, [recipes.length, dispatch]);

  // helper method to shuffle an array
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // sorts post
  useEffect(() => {
    if (posts.length > 0 && sortedPosts.length === 0) {
      if (
        !currentUser ||
        !currentUser.following ||
        currentUser.following.length === 0
      ) {
        setSortedPosts(shuffleArray(posts));
        return;
      }

      // if user is logged in, prioritize followed users
      const followedUserIds = new Set(
        currentUser.following.map((f: any) => f._id || f)
      );

      const followedPosts = posts.filter((post: any) =>
        followedUserIds.has(post.created_by)
      );
      const otherPosts = posts.filter(
        (post: any) => !followedUserIds.has(post.created_by)
      );

      setSortedPosts([...followedPosts, ...shuffleArray(otherPosts).reverse()]);
    }
  }, [posts, currentUser, sortedPosts.length]);

  return (
    <div 
      id="recipals-home"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        padding: "10px",
        boxSizing: "border-box",
        overflowX: "hidden",
        minWidth: "500px" // Enforce minimum width to prevent clipping
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          minWidth: "500px", // Increased from 300px to prevent clipping
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        {sortedPosts.map((post: any) => (
          <div
            key={post.post_id}
            style={{
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              wordWrap: "break-word",
              wordBreak: "break-word"
            }}
          >
            <RecipePost post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}