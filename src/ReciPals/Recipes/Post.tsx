import { FaRegHeart } from "react-icons/fa";
import { GoComment } from "react-icons/go";
import * as db from "../Database";
import { Link } from "react-router-dom";

interface Post {
  post_id: string;
  recipe_id: string
  created_by: string;
  title: string;
  description: string;
  photo: string;
  likes: number;
  comments?: any;
}

export default function RecipePost({ post }: { post: Post }) {
  // returns number of comments in this post
  const commentCount = post.comments.length;

  // finds the username matching the post created by user and finds the profile picture
  const user = db.users.find((u: any) => u.username === post.created_by);
  const profilePic = user ? user.profile : "/images/profile.png";

  return (
    <Link to={`/ReciPals/Home/${post.recipe_id}`} className="text-decoration-none" >
      <div key={post.post_id} id="recipe-post">
        <div className="d-flex align-items-center mb-3">
          <img
            src={profilePic}
            alt="Profile picture"
            className="rounded-circle"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
          <span className="ms-3 text-dark">{post.created_by}</span>
        </div>

        <div className="d-flex justify-content-center align-items-center mb-3">
          <div className="post-image overflow-hidden">
            <img
              src={post.photo}
              alt={post.title}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        </div>

        <div className="d-flex gap-4 mb-2">
          <div className="d-flex align-items-center gap-1">
            <FaRegHeart size={18} />
            <span>{post.likes}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <GoComment size={18} />
            <span>{commentCount}</span>
          </div>
        </div>

        <div className="post-caption text-dark">
          <span className="fw-semibold">recipe_bot</span>{" "}
          <span>{post.description}</span>
        </div>
      </div>
    </Link>
  );
}
