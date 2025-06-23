import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import { Button, Form, Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as recipeClient from "../recipeClient";
import * as postClient from "../../Posts/postClient";
import { setRecipes } from "../recipeReducer";
import { setPosts } from "../../Posts/postReducer";
import { FaPencil } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

// represents the recipe details page in admin management
export default function RecipeDetails({
  recipes = [],
  posts = [],
  users = [],
}: {
  recipes?: any[];
  posts?: any[];
  users?: any[];
}) {
  const { rid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<"recipe" | "post">("recipe");

  // edit states for different fields
  const [editingIngredients, setEditingIngredients] = useState(false);
  const [editingInstructions, setEditingInstructions] = useState(false);

  // values for editing
  const [editedIngredients, setEditedIngredients] = useState("");
  const [editedInstructions, setEditedInstructions] = useState("");

  // finds recipe, corresponding post, creator
  const recipe = recipes?.find((r: any) => r.recipe_id === rid);
  const post = posts?.find((p: any) => p.recipe_id === rid);
  const creator = users?.find((u: any) => u._id === recipe?.user_created);

  if (!recipe) {
    return (
      <div className="position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
        <button
          onClick={() => navigate(-1)}
          className="btn position-fixed end-0 top-0 wd-close-details"
        >
          <IoCloseSharp className="fs-1" />
        </button>
      </div>
    );
  }

  // converts ingredients sections to simple text for editing
  const formatIngredientsForEdit = (ingredientsSec: any[]) => {
    return (
      ingredientsSec
        ?.map((section) => {
          const title = section.title;
          const ingredients = section["ingredients"]?.join("\n") || "";
          return `${title}:\n${ingredients}`;
        })
        .join("\n\n") || ""
    );
  };

  // converts simple text back to ingredients sections structure
  const parseIngredientsFromText = (text: string) => {
    const sections = text.split("\n\n").filter((section) => section.trim());
    return sections.map((section, index) => {
      const lines = section.split("\n");
      const title = lines[0].replace(":", "").trim();
      const ingredients = lines.slice(1).filter((line) => line.trim());

      return {
        _id: `edited-${index}`,
        title: title,
        "ingredients": ingredients,
      };
    });
  };

  // save ingredients of a recipe post
  const saveIngredients = async () => {
    try {
      const newIngredientsSections =
        parseIngredientsFromText(editedIngredients);
      const updatedRecipe = {
        ...recipe,
        ingredients_sec: newIngredientsSections,
      };

      await recipeClient.updateRecipe(updatedRecipe);

      const updatedRecipes = recipes.map((r: any) =>
        r.recipe_id === recipe.recipe_id ? updatedRecipe : r
      );

      dispatch(setRecipes(updatedRecipes));
      setEditingIngredients(false);
    } catch (error) {
      console.error("Error saving ingredients", error);
    }
  };

  // save instructions
  const saveInstructions = async () => {
    try {
      const steps = editedInstructions
        .split("\n")
        .filter((step: string) => step.trim())
        .map((step: string) => step.trim());

      const updatedRecipe = { ...recipe, steps: steps };

      await recipeClient.updateRecipe(updatedRecipe);

      const updatedRecipes = recipes.map((r: any) =>
        r.recipe_id === recipe.recipe_id ? updatedRecipe : r
      );
      dispatch(setRecipes(updatedRecipes));
      setEditingInstructions(false);
    } catch (error) {
      console.error("Error saving instructions:", error);
    }
  };

  // deletes recipe
  const deleteRecipe = async () => {
    if (!recipe) {
      console.error("No recipe found to delete");
      alert("Error: Recipe not found");
      return;
    }

    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const recipeId = recipe._id || recipe.id || recipe.recipe_id;

        if (!recipeId) {
          throw new Error("No valid recipe ID found");
        }

        await recipeClient.deleteRecipe(recipeId);

        if (post && post.post_id) {
          try {
            await postClient.deletePost(post.post_id);
          } catch (postError) {
            console.warn("Post deletion failed, but continuing:", postError);
          }
        }

        const updatedRecipes = recipes.filter((r: any) => {
            r.recipe_id !== recipe.recipe_id && r.recipe_id !== rid;
        });

        const updatedPosts = posts.filter((p: any) => {
          return p.recipe_id !== recipe.recipe_id && p.recipe_id !== rid;
        });

        dispatch(setRecipes(updatedRecipes));
        dispatch(setPosts(updatedPosts));

        navigate(-1);
      } catch (error) {
        console.error("Error deleting recipe:", error);
        alert(
          `Failed to delete recipe: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  };

  // deletes a comment
  const deleteComment = async (commentId: string) => {
    if (!post) return;

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const updatedComments = post.comments.filter(
          (c: any) => c.comment_id !== commentId
        );
        const updatedPost = { ...post, comments: updatedComments };

        await postClient.updatePost(updatedPost);

        const updatedPosts = posts.map((p: any) =>
          p.post_id === post.post_id ? updatedPost : p
        );
        dispatch(setPosts(updatedPosts));
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  return (
    <div
      className="position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25"
      style={{ overflowY: "auto" }}
    >
      <button
        onClick={() => navigate(-1)}
        className="btn position-fixed end-0 top-0 wd-close-details"
        style={{ zIndex: 10 }}
      >
        <IoCloseSharp className="fs-1" />{" "}
      </button>
      <div className="text-center mt-2">
        <Image
          src={recipe.photo}
          fluid
          alt={recipe.name}
          style={{ width: 70, objectFit: "cover" }}
        />
      </div>
      {/* tabs */}
      <div className="admin-recipe-tab d-flex justify-content-center mt-2">
        <button
          className={`tab-btn ${activeTab === "recipe" ? "active" : ""}`}
          onClick={() => setActiveTab("recipe")}
        >
          Recipe
        </button>
        <button
          className={`tab-btn ${activeTab === "post" ? "active" : ""}`}
          onClick={() => setActiveTab("post")}
        >
          Post
        </button>
      </div>
      {/* recipe tab content */}
      {activeTab === "recipe" && (
        <div className="recipe-details">
          <div className="recipe-name pb-1">
            <b>Name: </b>
            <span style={{ fontSize: "14px" }}>{recipe.name}</span>
          </div>
          <div className="user-creator pb-1">
            <b>Creator: </b>
            <span style={{ fontSize: "14px" }}>
              {creator?.username || recipe.user_created}
            </span>
          </div>
          {/* Ingredients */}
          <div className="mb-3">
            <b>Ingredients: </b>
            <div
              className="mt-2"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {/* pencil if not in editing state */}
              {!editingIngredients && (
                <FaPencil
                  onClick={() => {
                    setEditingIngredients(true);
                    setEditedIngredients(
                      formatIngredientsForEdit(recipe.ingredients_sec)
                    );
                  }}
                  className="float-end fs-6 mt-1"
                  style={{ cursor: "pointer", color: "#cd9f08" }}
                />
              )}

              {/* check mark if in editing state */}
              {editingIngredients && (
                <FaCheck
                  onClick={saveIngredients}
                  className="float-end fs-6 mt-1 me-2 text-success"
                  style={{ cursor: "pointer" }}
                />
              )}

              {/* not editing ingredients display*/}
              {!editingIngredients && (
                <div
                  className="mt-2"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {recipe.ingredients_sec?.map(
                    (section: any, index: number) => (
                      <div key={section._id || index} className="mb-3">
                        <div
                          className="fw-bold"
                          style={{ fontSize: "14px", color: "#cd9f08" }}
                        >
                          {section.title}:
                        </div>
                        <ul
                          className="list-unstyled ps-3"
                          style={{ fontSize: "14px" }}
                        >
                          {section["ingredients"]?.map(
                            (ingredient: string, idx: number) => (
                              <li key={idx} className="mb-1">
                                <span className="me-2">•</span>
                                {ingredient}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              )}
              {/* editing ingredients text area */}
              {editingIngredients && (
                <div className="mt-2">
                  <Form.Control
                    as="textarea"
                    rows={8}
                    value={editedIngredients}
                    onChange={(e) => setEditedIngredients(e.target.value)}
                    placeholder="Format:&#10;Section Name:&#10;Ingredient 1&#10;Ingredient 2&#10;&#10;Another Section:&#10;Ingredient 3"
                    style={{ fontSize: "14px" }}
                    autoFocus
                  />
                  <div className="text-muted mt-1" style={{ fontSize: "11px" }}>
                    Separate sections with blank lines. Put section name
                    followed by colon, then ingredients on separate lines.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-3">
            <strong>Instructions:</strong>
            {/* pencil if not in editing state */}
            {!editingInstructions && (
              <FaPencil
                onClick={() => {
                  setEditingInstructions(true);
                  setEditedInstructions(recipe.steps?.join("\n") || "");
                }}
                className="float-end fs-6 mt-1"
                style={{ cursor: "pointer", color: "#cd9f08" }}
              />
            )}

            {/* check mark if in editing state */}
            {editingInstructions && (
              <FaCheck
                onClick={saveInstructions}
                className="float-end fs-6 mt-1 me-2 text-success"
                style={{ cursor: "pointer" }}
                title="Save instructions"
              />
            )}

            {/* not editing instructions display */}
            {!editingInstructions && (
              <div
                style={{ maxHeight: "200px", overflowY: "auto" }}
                className="mt-2"
              >
                <ol>
                  {recipe.steps?.map((step: string, index: number) => (
                    <li
                      key={index}
                      className="mb-2"
                      style={{ fontSize: "14px" }}
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* editing instructions text area */}
            {editingInstructions && (
              <div className="mt-2">
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={editedInstructions}
                  onChange={(e) => setEditedInstructions(e.target.value)}
                  style={{ fontSize: "13px" }}
                  autoFocus
                />
                <div className="text-muted mt-1" style={{ fontSize: "11px" }}>
                  Each line will become a numbered step in the recipe.
                </div>
              </div>
            )}
          </div>
          {/* Tags */}
          <div className="recipe-tags pb-1">
            <b>Tags: </b>
            <span style={{ fontSize: "14px" }}>
              {Array.isArray(recipe.tags) && recipe.tags.length > 0
                ? recipe.tags.join(", ")
                : "No tags"}{" "}
            </span>
          </div>
        </div>
      )}
      {/* post tab content */}
      {activeTab === "post" && post && (
        <div className="post-details">
          <div className="mb-3">
            <strong>Caption:</strong>
            <p style={{ fontSize: "14px" }}>{post.caption}</p>
          </div>
          <div className="mb-3">
            <strong>Comments ({post.comments?.length || 0}):</strong>
            <div className="mb-4">
              {post.comments &&
                post.comments.length > 0 &&
                post.comments.map((comment: any, _index: number) => (
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div>
                        <strong style={{ fontSize: "13px" }}>
                          {comment.user_id}
                        </strong>
                        <span
                          className="text-muted ms-2"
                          style={{ fontSize: "12px" }}
                        >
                          {comment.created_at}
                        </span>
                      </div>
                      <div className="mt-1" style={{ fontSize: "13px" }}>
                        {comment.text}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteComment(comment.comment_id)}
                      style={{ fontSize: "11px" }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button onClick={deleteRecipe} id="delete-btn" size="sm">
          Delete
        </Button>
        <div className="d-flex gap-2">
          <Button onClick={() => navigate(-1)} id="cancel-btn" size="sm">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
