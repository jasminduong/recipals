import RecipePost from "../Recipes/Post";
import * as db from "../Database";

export default function Home() {
  const posts = db.posts;

  return (
    <div id="recipals-home">
      {posts.map((post) => (
        <RecipePost key={post.post_id} post={post} />
      ))}
    </div>
  );
}
