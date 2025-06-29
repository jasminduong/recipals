import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { BiBookmark } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setRecipes } from "./recipeReducer";
import * as recipeClient from "./recipeClient";
import * as postClient from "../Posts/postClient";
import { setPosts, addComment } from "../Posts/postReducer";
import { fetchRecipes } from "../Search/reducer";
import { saveRecipe, setUsers, unsaveRecipe } from "../Account/userReducer";
import * as userClient from "../Account/client";
import type { RootState, AppDispatch } from "../store";
import { setCurrentUser } from "../Account/reducer";
import { BsBookmarkFill } from "react-icons/bs";

// represents the recipe details page
export default function RecipeDetails() {
  const { rid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const recipes = useSelector((state: any) => state.recipeReducer.recipes);
  const posts = useSelector((state: any) => state.postReducer.posts);
  const currPost = posts.find((post: any) => post.recipe_id === rid);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { recipes: searchRecipes } = useSelector(
    (state: RootState) => state.searchReducer
  );
  const users = useSelector((state: any) => state.userReducer.users);
  const currRecipe =
    recipes.find((recipe: any) => recipe.recipe_id === rid) ||
    searchRecipes.find((recipe: any) => recipe.recipe_id === rid);

  const isRecipeSaved = currentUser?.saved_recipes?.includes(rid) || false;

  // find the recipe creator's username
  const recipeCreator = users.find(
    (user: any) => user._id === currRecipe?.user_created
  );

  // gets user by user_id for comments
  const getUserById = (userId: string) => {
    return users.find((user: any) => user._id === userId);
  };

  const creatorUsername = recipeCreator?.username || "Unknown User";

  // Handle save/unsave functionality
  const handleSaveToggle = async () => {
    if (!currentUser || !rid) return;

    setIsSaving(true);

    try {
      if (isRecipeSaved) {
        // Unsave recipe
        const updatedUser = await userClient.unsaveRecipe(currentUser._id, rid);
        dispatch(unsaveRecipe({ userId: currentUser._id, recipeId: rid }));
        dispatch(setCurrentUser(updatedUser));
      } else {
        // Save recipe
        const updatedUser = await userClient.saveRecipe(currentUser._id, rid);
        dispatch(saveRecipe({ userId: currentUser._id, recipeId: rid }));
        dispatch(setCurrentUser(updatedUser));
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const allRecipes = await recipeClient.getAllRecipes();
        dispatch(setRecipes(allRecipes));

        const allPosts = await postClient.getAllPosts();
        dispatch(setPosts(allPosts));

        if (searchRecipes.length === 0) {
          dispatch(fetchRecipes());
        }

        // load users
        if (users.length === 0) {
          const allUsers = await userClient.getAllUsers();
          dispatch(setUsers(allUsers));
        }
      } catch (error) {
        console.error("Error loading recipes:", error);
      }
    };

    loadRecipes();
  }, [recipes.length, posts.length, searchRecipes.length, dispatch]);

  // gets base url
  const getBaseUrl = () => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:4000";
    }
    return "https://recipals-node-server-app.onrender.com";
  };

  const BASE_URL = getBaseUrl();

  // event handler for adding comments
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim() || !currentUser || !currPost) {
      return;
    }

    setIsSubmittingComment(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/posts/${currPost.post_id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentUser._id || currentUser.username,
            text: commentText.trim(),
          }),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();

        const newComment =
          updatedPost.comments[updatedPost.comments.length - 1];
        dispatch(
          addComment({
            postId: currPost.post_id,
            comment: newComment,
          })
        );

        setCommentText("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };
  return (
    <Container fluid className="mt-4 px-2 px-md-4" id="recipe-details">
      {currRecipe ? (
        <div>
          <Row className="mb-4">
            {/* recipe photo */}
            <Col xs={12} md={5} lg={4} className="mb-3 mb-md-0">
              <img
                src={currRecipe.photo}
                className="img-fluid"
                style={{
                  width: "230px",
                  height: "230px",
                  objectFit: "cover",
                  aspectRatio: "1 / 1",
                }}
                alt={currRecipe.name}
              />
            </Col>
            {/* recipe title and bookmark */}
            <Col xs={12} md={7} lg={8}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="flex-grow-1 me-2">
                  <h2 className="mb-1">{currRecipe.name}</h2>
                  <div className="mb-2">
                    Created by:{" "}
                    <span
                      className="fw-semibold text-dark text-decoration-none"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        recipeCreator &&
                        navigate(
                          `/ReciPals/Account/Profile/${currRecipe.user_created}`
                        )
                      }
                    >
                      {creatorUsername}
                    </span>
                  </div>
                </div>
                {currentUser && (
                  <div
                    onClick={handleSaveToggle}
                    style={{ cursor: isSaving ? "not-allowed" : "pointer" }}
                    className="flex-shrink-0"
                  >
                    {isRecipeSaved ? (
                      <BsBookmarkFill className="bookmark-icon" />
                    ) : (
                      <BiBookmark className="bookmark-icon" />
                    )}
                  </div>
                )}
              </div>
              {/* recipe description */}
              <p className="text-muted fst-italic mb-3">
                {currRecipe.description}
              </p>

              {/* recipe stats */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-3">
                <div className="mb-2 mb-sm-0">
                  <div>
                    <strong>Total Time:</strong>{" "}
                    {currRecipe.total_time || "1+ min"}
                  </div>
                  <div>
                    <strong>Serves:</strong> {currRecipe.serves || "1+"}
                  </div>
                </div>
                {currRecipe?.user_created === currentUser?._id && (
                  <Button
                    className="edit-button text-dark mt-2 mt-sm-0"
                    size="sm"
                    onClick={() =>
                      navigate(`/ReciPals/Editor/${currRecipe.recipe_id}`)
                    }
                  >
                    Edit Recipe
                  </Button>
                )}
              </div>

              {/* recipe tags */}
              <div className="d-flex flex-wrap gap-2">
                {currRecipe.tags?.map((tag: string, index: number) => (
                  <span key={index} className="btn profile-tags">
                    {tag}
                  </span>
                ))}
              </div>
            </Col>
          </Row>

          {/* Ingredients and Instructions */}
          <Row className="border-top pt-4">
            <Col
              xs={12}
              lg={5}
              xl={4}
              className="mb-4 mb-lg-0 recipe-ingredients-col"
            >
              <div className="border-end-lg pe-lg-4 pe-xl-4">
                <h4 className="mb-3 mb-lg-4">Ingredients</h4>
                {currRecipe.ingredients_sec?.map((section: any) => (
                  <div key={section._id} className="mb-4 recipe-section">
                    <h6 className="fw-bold mb-2">For the {section.title}</h6>
                    <ul className="list-unstyled ps-3">
                      {section["ingredients"]?.map(
                        (ingredient: string, idx: number) => (
                          <li key={idx} className="mb-1 recipe-ingredient-item">
                            <span className="me-2">•</span>
                            {ingredient}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </Col>

            <Col xs={12} lg={7} xl={8} className="recipe-instructions-col">
              <h4 className="mb-3">Instructions</h4>
              <ol className="ps-3">
                {currRecipe.steps?.map((step: string, index: number) => (
                  <li key={index} className="mb-1 lh-lg recipe-step-item">
                    {step}
                  </li>
                ))}
              </ol>
            </Col>
          </Row>

          <hr className="my-4" />

          {/* Comments Section */}
          <div className="mb-4">
            <h5 className="mb-3">
              Comments ({currPost?.comments?.length || 0})
            </h5>

            {/* Comment input */}
            {currentUser ? (
              <Form onSubmit={handleAddComment} className="mb-4">
                <div className="d-flex gap-2">
                  <Form.Control
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={isSubmittingComment}
                  />
                  <Button
                    type="submit"
                    disabled={!commentText.trim() || isSubmittingComment}
                    className="comment-btn"
                  >
                    {isSubmittingComment ? "Posting..." : "Post"}
                  </Button>
                </div>
              </Form>
            ) : (
              <div className="mb-4 text-muted">
                Please log in to add comments.
              </div>
            )}

            {/* Comments list */}
            {currPost?.comments?.map((comment: any, index: any) => {
              const commenter = getUserById(comment.user_id);

              return (
                <div
                  key={comment.comment_id || index}
                  className="mb-3 pb-3 border-bottom"
                >
                  <Row className="g-2 g-sm-3">
                    <Col xs="auto">
                      <img
                        src={commenter?.profile || "/images/profile.png"}
                        alt="Profile picture"
                        className="rounded-circle comment-profile-pic"
                      />
                    </Col>
                    <Col>
                      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
                        <strong className="me-2 mb-1 mb-sm-0">
                          {commenter?.username || "Unknown User"}
                        </strong>
                      </div>
                      <div>
                        <small className="text-muted">
                          {comment.created_at}
                        </small>
                      </div>
                      <p className="mb-0 mt-1">{comment.text}</p>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <p className="text-dark fs-4">Loading...</p>
        </div>
      )}
    </Container>
  );
}
