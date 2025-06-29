import { FaHeart, FaRegHeart } from "react-icons/fa";
import { GoComment } from "react-icons/go";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { likePost, setPosts, unlikePost } from "./postReducer";
import { setRecipes } from "../Recipes/recipeReducer";
import * as postClient from "./postClient";
import * as recipeClient from "../Recipes/recipeClient";
import * as client from "../Account/client";
import { setUsers } from "../Account/userReducer";
import LikesModal from "./LikesModal";

// represents a carousel of posts from the profile page 
export default function UserPosts() {
  const { uid, pid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLikesModal, setShowLikesModal] = useState(false);
  const posts = useSelector((state: any) => state.postReducer.posts);
  const users = useSelector((state: any) => state.userReducer.users);
  const recipes = useSelector((state: any) => state.recipeReducer.recipes);

  // get current logged in user
  const { currentUser: loggedInUser } = useSelector(
    (state: any) => state.accountReducer
  );

  // loads data only once when component mounts
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [allPosts, allRecipes, allUsers] = await Promise.all([
          postClient.getAllPosts(),
          recipeClient.getAllRecipes(),
          client.getAllUsers(),
        ]);

        dispatch(setPosts(allPosts));
        dispatch(setRecipes(allRecipes));
        dispatch(setUsers(allUsers));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadAllData();
  }, [pid, uid, dispatch]);

  // gets current user and post
  const currUser = users.find((user: any) => user._id === uid);
  const currPost = posts.find((post: any) => post.post_id === pid);

  console.log("Found data:", {
    currUser: currUser?._id,
    currPost: currPost?.post_id,
    totalPosts: posts.length,
    totalUsers: users.length,
  });

  // returns if post is not found
  if (!currPost) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center py-5">
          <p className="text-danger fs-4">Post not found.</p>
          <p>Looking for post ID: {pid}</p>
          <p>Available posts: {posts.map((p: any) => p.post_id).join(", ")}</p>
          <Button onClick={() => navigate(`/ReciPals/Account/Profile/${uid}`)}>
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  // get updated post from redux
  const updatedPost = posts.find((p: any) => p.post_id === pid) || currPost;

  // gets current recipe
  const currRecipe = currPost
    ? recipes.find((recipe: any) => recipe.recipe_id === currPost.recipe_id)
    : null;

  // gets post creator
  const postCreator = currPost
    ? users.find((user: any) => user._id === currPost.created_by)
    : null;

  // gets all posts by the post creator
  const userPosts = postCreator
    ? posts.filter((post: any) => post.created_by === postCreator._id).reverse()
    : [];

  // finds current post's position in the user's posts array
  const currentPostIndex = userPosts.findIndex(
    (post: any) => post.post_id === pid
  );

  // checks if this is the first or last post
  const isFirstPost = currentPostIndex === 0;
  const isLastPost = currentPostIndex === userPosts.length - 1;
  const hasOnlyOnePost = userPosts.length === 1;

  // checks if current user has liked this post
  const isLiked = updatedPost?.likes?.includes(loggedInUser?._id) || false;

  // event handler for liking and unliking a post
  const handleLikeToggle = async () => {
    if (!loggedInUser || !updatedPost) return;

    let updatedLikes;
    if (isLiked) {
      dispatch(
        unlikePost({ postId: updatedPost.post_id, userId: loggedInUser._id })
      );
      updatedLikes = updatedPost.likes.filter(
        (userId: string) => userId !== loggedInUser._id
      );
    } else {
      dispatch(
        likePost({ postId: updatedPost.post_id, userId: loggedInUser._id })
      );
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
    <div
      className="user-posts d-flex justify-content-center align-items-center"
      onClick={() => navigate(`/ReciPals/Account/Profile/${uid}`)}
    >
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ pointerEvents: "all" }}
        onClick={(e) => e.stopPropagation()}
      >
        {currPost && postCreator ? (
          <div className="d-flex justify-content-between align-items-center">
            <div className="recipe-post" style={{ position: "relative" }}>
              <BiChevronLeft
                size={48}
                className={`left-chevron ${
                  isFirstPost || hasOnlyOnePost ? "disabled" : ""
                }`}
                style={{
                  opacity: isFirstPost || hasOnlyOnePost ? 0.3 : 1,
                  cursor:
                    isFirstPost || hasOnlyOnePost ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (!isFirstPost && !hasOnlyOnePost) {
                    const prevPost = userPosts[currentPostIndex - 1];
                    navigate(
                      `/ReciPals/Account/Profile/${uid}/Posts/${prevPost.post_id}`
                    );
                  }
                }}
              />

              <BiChevronRight
                size={48}
                className={`right-chevron ${
                  isLastPost || hasOnlyOnePost ? "disabled" : ""
                }`}
                style={{
                  opacity: isLastPost || hasOnlyOnePost ? 0.3 : 1,
                  cursor:
                    isLastPost || hasOnlyOnePost ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (!isLastPost || !hasOnlyOnePost) {
                    const nextPost = userPosts[currentPostIndex + 1];
                    navigate(
                      `/ReciPals/Account/Profile/${uid}/Posts/${nextPost.post_id}`
                    );
                  }
                }}
              />
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <img
                    src={postCreator?.profile || currUser?.profile}
                    alt="Profile picture"
                    className="user-posts-profile-pic rounded-circle"
                  />
                  <span className="ms-3 text-dark">
                    {postCreator?.username}
                  </span>
                </div>
                {currUser && currPost.created_by === loggedInUser._id && (
                  <Button
                    className="edit-button text-dark"
                    style={{ marginRight: "0px" }}
                    size="sm"
                    onClick={() =>
                      navigate(`/ReciPals/Editor/${currRecipe.recipe_id}`)
                    }
                  >
                    Edit Recipe
                  </Button>
                )}
              </div>
              <Link
                to={`/ReciPals/Recipes/${currRecipe.recipe_id}`}
                className="text-decoration-none"
              >
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div className="post-image overflow-hidden">
                    <img
                      src={currPost.photo}
                      className="user-post-image"
                    />
                  </div>
                </div>
              </Link>
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
                      cursor:
                        updatedPost.likes.length > 0 ? "pointer" : "default",
                    }}
                  >
                    {updatedPost.likes.length}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1 post-icons">
                  <Link
                    to={`/ReciPals/Recipes/${updatedPost.recipe_id}`}
                    className="text-dark"
                  >
                    <GoComment size={18} />
                  </Link>
                  <span>{currPost.comments.length}</span>
                </div>
              </div>

              <div className="post-caption text-dark">
                <span className="fw-semibold">{postCreator?.username}</span>{" "}
                <span>{currPost.caption}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-danger fs-4">Post not found.</p>
          </div>
        )}
      </div>

      <LikesModal
        show={showLikesModal}
        handleClose={handleCloseLikesModal}
        post={updatedPost}
      />
    </div>
  );
}
