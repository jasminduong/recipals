import { FaRegHeart } from "react-icons/fa";
import { GoComment } from "react-icons/go";
import * as db from "../Database";
import { Link } from "react-router-dom";

interface Post {
  post_id: string;
  recipe_id: string;
  created_by: string;
  title: string;
  caption: string;
  photo: string;
  likes: number;
  comments?: any;
  created_at: string;
}

export default function RecipePost({ post }: { post: Post }) {
  const commentCount = post.comments.length;
  const user = db.users.find((u: any) => u._id === post.created_by);
  const profilePic = user ? user.profile : "/images/profile.png";

  return (
    <div key={post.post_id} id="recipe-post">
      <div className="d-flex align-items-center mb-3">
        <img
          src={profilePic}
          alt="Profile picture"
          className="rounded-circle"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
        <Link
          className="text-decoration-none"
          to={`/ReciPals/Profile/${user?._id}`}
        >
          <span className="ms-3 text-dark">{user?.username}</span>
        </Link>
      </div>

      <div className="d-flex justify-content-center align-items-center mb-3">
        <Link
          to={`/ReciPals/Home/${post.recipe_id}`}
          className="text-decoration-none"
        >
          <div className="post-image overflow-hidden">
            <img
              src={post.photo}
              alt={post.title}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        </Link>
      </div>

      <div className="d-flex gap-4 mb-2">
        <div className="d-flex align-items-center gap-1 post-icons">
          <FaRegHeart size={18} />
          <span>{post.likes}</span>
        </div>
        <div className="d-flex align-items-center gap-1 post-icons">
          <GoComment size={18} />
          <span>{commentCount}</span>
        </div>
      </div>

      <div className="post-caption text-dark">
        <span className="fw-semibold">{user?.username}</span>{" "}
        <span>{post.caption}</span>
      </div>
    </div>
  );
}
