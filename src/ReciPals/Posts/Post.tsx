import { FaHeart, FaRegHeart } from "react-icons/fa";
import { GoComment } from "react-icons/go";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likePost, unlikePost } from "../Posts/postReducer";
import * as postClient from "./postClient";
import { useState } from "react";
import LikesModal from "./LikesModal";

interface Post {
  post_id: string;
  recipe_id: string;
  created_by: string;
  title: string;
  caption: string;
  photo: string;
  likes: string[];
  comments?: any;
  created_at: string;
}

export default function RecipePost({ post }: { post: Post }) {
  const dispatch = useDispatch();
  const [showLikesModal, setShowLikesModal] = useState(false);
  const { currentUser: loggedInUser } = useSelector(
    (state: any) => state.accountReducer
  );
  const { users } = useSelector((state: any) => state.userReducer);

  const posts = useSelector((state: any) => state.postReducer.posts);
  // gets updated post from redux
  const updatedPost =
    posts.find((p: any) => p.post_id === post.post_id) || post;

  const user = users.find((u: any) => u._id === updatedPost.created_by);
  const profilePic = user ? user.profile : "/images/profile.png";

  // checks if current user has liked this post
  const isLiked = updatedPost.likes?.includes(loggedInUser?._id) || false;

  // event handler for liking and unliking a post
  const handleLikeToggle = async () => {
    if (!loggedInUser) return;

    let updatedLikes;
    if (isLiked) {
      dispatch(unlikePost({ postId: post.post_id, userId: loggedInUser._id }));
      updatedLikes = updatedPost.likes.filter(
        (userId: string) => userId !== loggedInUser._id
      );
    } else {
      dispatch(likePost({ postId: post.post_id, userId: loggedInUser._id }));
      updatedLikes = [...updatedPost.likes, loggedInUser._id];
    }

    await postClient.updatePost({
      ...updatedPost,
      likes: updatedLikes,
    });
  };

  // handle opening likes modal
  const handleLikesClick = () => {
    if (updatedPost.likes.length > 0) {
      setShowLikesModal(true);
    }
  };

  // handle closing likes modal
  const handleCloseLikesModal = () => {
    setShowLikesModal(false);
  };

  return (
    <div key={post.post_id} id="recipe-post">
      <div className="d-flex align-items-center mb-3">
        <Link
          className="text-decoration-none"
          to={`/ReciPals/Account/Profile/${user?._id}`}
        >
          <img
            src={profilePic}
            alt="Profile picture"
            className="rounded-circle"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
          <span className="ms-3 text-dark">{user?.username}</span>
        </Link>
      </div>

      <div className="d-flex justify-content-center align-items-center mb-3">
        <Link
          to={`/ReciPals/Recipes/${post.recipe_id}`}
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
        <div
          className="d-flex align-items-center gap-1 post-icons"
          style={{ cursor: loggedInUser ? "pointer" : "default" }}
        >
          <div onClick={handleLikeToggle}>
            {isLiked ? (
              <FaHeart size={18} style={{ color: "#e91e63" }} />
            ) : (
              <FaRegHeart size={18} />
            )}
          </div>
          <span
            onClick={handleLikesClick}
            style={{
              cursor: updatedPost.likes.length > 0 ? "pointer" : "default",
            }}
          >
            {updatedPost.likes.length}
          </span>
        </div>
        <div className="d-flex align-items-center gap-1 post-icons">
          <Link
            to={`/ReciPals/Recipes/${post.recipe_id}`}
            className="text-dark"
          >
            <GoComment size={18} />
          </Link>
          <span>{updatedPost.comments.length}</span>
        </div>
      </div>

      <div className="post-caption text-dark">
        <span className="fw-semibold">{user?.username}</span>{" "}
        <span>{post.caption}</span>
      </div>

      <LikesModal
        show={showLikesModal}
        handleClose={handleCloseLikesModal}
        post={updatedPost}
      />
    </div>
  );
}
