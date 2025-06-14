import { FaRegHeart } from "react-icons/fa";
import { GoComment } from "react-icons/go";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import * as db from "../Database";
import { Link, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserPosts() {
  const { uid, pid } = useParams();
  const navigate = useNavigate();
  const posts = useSelector((state: any) => state.postReducer.posts);
  const users = db.users;
  const currUser = users.find((user) => user._id === uid);
  const currPost = posts.find((post: any) => post.post_id === pid);
  const recipes = useSelector((state: any) => state.recipeReducer.recipes);

  // gets current recipe
  const currRecipe = currPost
    ? recipes.find((recipe: any) => currPost.post_id === recipe.post_id)
    : null;

  // gets post creator
  const postCreator = currPost
    ? users.find((user) => user._id === currPost.created_by)
    : null;

  // gets all posts by the post creator
  const userPosts = postCreator
    ? posts.filter((post: any) => post.created_by === postCreator._id)
    : [];

  // finds current post's position in the user's posts array
  const currentPostIndex = userPosts.findIndex((post: any) => post.post_id === pid);

  // checks if this is the first or last post
  const isFirstPost = currentPostIndex === 0;
  const isLastPost = currentPostIndex === userPosts.length - 1;
  const hasOnlyOnePost = userPosts.length === 1;

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "fixed",
        top: 20,
        left: 0,
        zIndex: 100,
        paddingLeft: "inherit",
        pointerEvents: "all", 
      }}
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
                    className="rounded-circle"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <span className="ms-3 text-dark">
                    {postCreator?.username}
                  </span>
                </div>
                {currUser && currPost.created_by === currUser._id && (
                  <Button
                    className="edit-button text-dark"
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
                to={`/ReciPals/Home/${currRecipe.recipe_id}`}
                className="text-decoration-none"
              >
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div className="post-image overflow-hidden">
                    <img
                      src={currPost.photo}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                </div>
              </Link>
              <div className="d-flex gap-4 mb-2">
                <div className="d-flex align-items-center gap-1 post-icons">
                  <FaRegHeart size={18} />
                  <span>{currPost.likes}</span>
                </div>
                <div className="d-flex align-items-center gap-1 post-icons">
                  <GoComment size={18} />
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
    </div>
  );
}
