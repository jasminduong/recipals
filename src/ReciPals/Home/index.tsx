import RecipePost from "../Recipes/Post";
import * as db from "../Database";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setPosts } from "../Recipes/postReducer";

export default function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state: any) => state.postReducer.posts);

  // initialize posts from database 
  useEffect(() => {
    if (posts.length === 0) {
      dispatch(setPosts(db.posts));
    }
  }, [dispatch, posts.length]);

  return (
    <div id="recipals-home">
      {posts.map((post: any) => (
        <RecipePost key={post.post_id} post={post} />
      ))}
    </div>
  );
}
