import { Button, Col, Container, Form, Row, Image } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  addRecipe,
  deleteRecipe,
  setRecipes,
  updateRecipe,
} from "./recipeReducer";
import {
  addPost,
  deletePost,
  setPosts,
  updatePost,
} from "../Posts/postReducer";
import { FaRegTrashCan } from "react-icons/fa6";
import * as recipeClient from "./recipeClient";
import * as postClient from "../Posts/postClient";
import { setCurrentUser } from "../Account/reducer";
import * as client from "../Account/client";
import imageCompression from "browser-image-compression";

// represents a recipe editor for users to edit their recipes
export default function RecipeEditor() {
  const { rid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recipes = useSelector((state: any) => state.recipeReducer.recipes);
  const posts = useSelector((state: any) => state.postReducer.posts);
  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );

  type Recipe = {
    recipe_id: string;
    post_id?: string;
    user_created: string;
    name: string;
    description: string;
    ingredients_sec: [];
    steps: [];
    total_time: string;
    serves: number;
    tags: [];
    photo: string;
  };

  const recipeToEdit = recipes.find(
    (recipe: Recipe) => recipe.recipe_id === rid
  );
  const isNew = !recipeToEdit;

  // load recipes
  useEffect(() => {
    const loadData = async () => {
      try {
        if (isNew && !currentUser) {
          alert("Please log in to create a recipe.");
          navigate("/ReciPals/Account/Signin");
          return;
        }

        const allRecipes = await recipeClient.getAllRecipes();
        dispatch(setRecipes(allRecipes));

        const allPosts = await postClient.getAllPosts();
        dispatch(setPosts(allPosts));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [isNew, currentUser]);

  // state variables for each recipe field
  const [name, setName] = useState(recipeToEdit?.name || "");
  const [description, setDescription] = useState(
    recipeToEdit?.description || ""
  );
  const [totalTime, setTotalTime] = useState(recipeToEdit?.total_time || "");
  const [serves, setServes] = useState(recipeToEdit?.serves || 1);
  const [tags, setTags] = useState(recipeToEdit?.tags?.join(",") || "");
  const [ingredientsSec, setIngredientsSec] = useState(
    recipeToEdit?.ingredients_sec || [
      {
        _id: uuidv4(),
        title: "",
        ingredients: [""],
      },
    ]
  );
  const [steps, setSteps] = useState(recipeToEdit?.steps || [""]);
  const [photo, setPhoto] = useState(
    recipeToEdit?.photo || "https://recipals.netlify.app/images/default.jpg"
  );

  // updates the recipe
  useEffect(() => {
    if (recipeToEdit) {
      setName(recipeToEdit.name || "");
      setDescription(recipeToEdit.description || "");
      setTotalTime(recipeToEdit.total_time || "");
      setServes(recipeToEdit.serves || 1);
      setTags(recipeToEdit.tags?.join(",") || "");
      setIngredientsSec(
        recipeToEdit.ingredients_sec || [
          {
            _id: uuidv4(),
            title: "",
            ingredients: [""],
          },
        ]
      );
      setSteps(recipeToEdit.steps || [""]);
      setPhoto(recipeToEdit.photo || "https://recipals.netlify.app/images/default.jpg");
      setPhotoChanged(false);
    }
  }, [recipeToEdit]);

  // variables for each post field
  const recipeId = isNew ? uuidv4() : rid;
  const existingPost = !isNew
    ? posts.find((p: any) => p.recipe_id === rid)
    : null;
  const postId = isNew ? uuidv4() : existingPost?.post_id;

  // track if photo was changed
  const [photoChanged, setPhotoChanged] = useState(false);

  // event handler to update recipe photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // set compression options
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };

        // compress the image file
        const compressedFile = await imageCompression(file, options);

        // convert compressed file to base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPhoto(base64String);
          setPhotoChanged(true);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Failed to process the image. Please try again.");
      }
    }
  };

  // event handler to update ingredients
  const handleUpdateIngredient = (
    sectionId: string,
    index: number,
    value: string
  ) => {
    setIngredientsSec(
      ingredientsSec.map((section: any) => {
        if (section._id === sectionId) {
          const updatedIngredients = [...section["ingredients"]];
          updatedIngredients[index] = value;
          return { ...section, ingredients: updatedIngredients };
        }
        return section;
      })
    );
  };

  // event handler to update section title
  const handleUpdateSectionTitle = (sectionId: string, title: string) => {
    setIngredientsSec(
      ingredientsSec.map((section: any) => {
        if (section._id === sectionId) {
          return { ...section, title };
        }
        return section;
      })
    );
  };

  // event handler to add an ingredient to a specific section
  const handleAddIngredient = (sectionId: string) => {
    setIngredientsSec(
      ingredientsSec.map((section: any) => {
        if (section._id === sectionId) {
          return {
            ...section,
            ingredients: [...section["ingredients"], ""],
          };
        }
        return section;
      })
    );
  };

  // event handler to add a new ingredient section
  const handleAddSection = () => {
    const newSection = {
      _id: uuidv4(),
      title: "",
      ingredients: [""],
    };
    setIngredientsSec([...ingredientsSec, newSection]);
  };

  // event handler to update steps
  const handleUpdateStep = (stepIndex: number, value: string) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex] = value;
    setSteps(updatedSteps);
  };

  // event handler to add a new step
  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  // event handler for limiting tags input
  const handleTagsChange = (value: string) => {
    const tagArray = value.split(",").map((tag) => tag.trim());

    if (tagArray.length <= 3) {
      setTags(value);
    } else {
      const limitedTags = tagArray.slice(0, 3).join(", ");
      setTags(limitedTags);
    }
  };

  // event handler to delete an ingredient from a section
  const handleDeleteIngredient = (
    sectionId: string,
    ingredientIndex: number
  ) => {
    setIngredientsSec(
      ingredientsSec.map((section: any) => {
        if (section._id === sectionId) {
          const updatedIngredients = [...section["ingredients"]];
          updatedIngredients.splice(ingredientIndex, 1);
          return { ...section, ingredients: updatedIngredients };
        }
        return section;
      })
    );
  };

  // event handler to delete an entire section
  const handleDeleteSection = (sectionId: string) => {
    setIngredientsSec(
      ingredientsSec.filter((section: any) => section._id !== sectionId)
    );
  };

  // event handler to delete a step
  const handleDeleteStep = (stepIndex: number) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(stepIndex, 1);
    setSteps(updatedSteps);
  };

  // event handler that saves recipe
  const handleSave = async () => {
    if (!currentUser || !currentUser._id) {
      if (isNew) {
        alert("You must be logged in to create a recipe. Please log in first.");
        navigate("/ReciPals/Account/Signin");
        return;
      } else {
        alert("Session expired. Please log in again.");
        navigate("/ReciPals/Account/Signin");
        return;
      }
    }

    // validation checks
    if (!name.trim()) {
      alert("Please enter a recipe name.");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a recipe description.");
      return;
    }

    // check if at least one ingredient exists and is not empty
    const hasValidIngredient = ingredientsSec.some((section: any) =>
      section["ingredients"].some((ingredient: string) => ingredient.trim())
    );
    if (!hasValidIngredient) {
      alert("Please add at least one ingredient.");
      return;
    }

    // check if at least one step exists and is not empty
    const hasValidStep = steps.some((step: string) => step.trim());
    if (!hasValidStep) {
      alert("Please add at least one instruction step.");
      return;
    }

    const recipePayload = {
      recipe_id: recipeId,
      post_id: postId,
      user_created: currentUser?._id || recipeToEdit?.user_created,
      name,
      description,
      total_time: totalTime,
      serves,
      tags: tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: any) => tag),
      ingredients_sec: ingredientsSec,
      steps,
      ...(isNew || photoChanged ? { photo } : {}),
    };

    const postPayload = {
      post_id: postId,
      recipe_id: recipeId,
      created_by: currentUser?._id || recipeToEdit?.user_created,
      title: name,
      caption: description,
      ...(isNew || photoChanged ? { photo } : {}),
      likes: isNew ? [] : existingPost?.likes || [],
      comments: isNew ? [] : existingPost?.comments || [],
      created_at: isNew
        ? new Date().toISOString().split("T")[0]
        : existingPost?.created_at || new Date().toISOString().split("T")[0],
    };

    if (isNew) {
      const newRecipe = await recipeClient.createRecipe(recipePayload);
      const newPost = await postClient.createPost(postPayload);

      const currentUserPosts = currentUser?.posts || [];
      const updatedUser = await client.updateUser({
        ...currentUser,
        posts: [...currentUserPosts, newPost.post_id],
      });

      dispatch(setCurrentUser(updatedUser));
      dispatch(addRecipe(newRecipe));
      dispatch(addPost(newPost));

      navigate(
        `/ReciPals/Account/Profile/${currentUser._id}/Posts/${newPost.post_id}`
      );
    } else {
      const updatedRecipe = await recipeClient.updateRecipe(recipePayload);
      const updatedPost = await postClient.updatePost(postPayload);

      dispatch(updateRecipe(updatedRecipe));
      dispatch(updatePost(updatedPost));

      recipeClient.getAllRecipes().then((allRecipes) => {
        dispatch(setRecipes(allRecipes));
      });

      postClient.getAllPosts().then((allPosts) => {
        dispatch(setPosts(allPosts));
      });
      navigate(`/ReciPals/Recipes/${rid}`);
    }
  };

  // event handler to delete recipe and associated post
  const handleDeleteRecipe = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      await recipeClient.deleteRecipe(rid!);
      dispatch(deleteRecipe(rid));

      const associatedPost = posts.find((p: any) => p.recipe_id === rid);
      if (associatedPost) {
        await postClient.deletePost(associatedPost.post_id);
        dispatch(deletePost(associatedPost.post_id));
      }

      navigate(`/ReciPals/Account/Profile/${currentUser._id}`);
    }
  };

  return (
    <Container fluid className="mt-4" id="recipe-editor">
      {recipeToEdit || isNew ? (
        <Form>
          {/* Recipe Name */}
          <Form.Group className="mb-3">
            <Form.Label>Recipe Name</Form.Label>
            <Form.Control
              value={name}
              placeholder="New Recipe"
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <Form.Text className="text-muted">
              {name.length}/50 characters
            </Form.Text>
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-4">
            <Form.Label>Description (Caption)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              placeholder="Recipe Caption"
              onChange={(e) => setDescription(e.target.value)}
              maxLength={150}
            />
            <Form.Text className="text-muted">
              {description.length}/150 characters
            </Form.Text>
          </Form.Group>

          {/* Ingredients Section */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Ingredients</Form.Label>
            </Col>
            <Col>
              <div className="border p-3 rounded">
                {ingredientsSec.map((section: any) => (
                  <div key={section._id} className="mb-3">
                    <Form.Group className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <Form.Label className="d-block mb-2 text-bold">
                          Section Title
                        </Form.Label>
                        {ingredientsSec.length > 1 && (
                          <Button
                            id="delete-btn"
                            size="sm"
                            onClick={() => handleDeleteSection(section._id)}
                          >
                            Delete Section
                          </Button>
                        )}
                      </div>
                      <Form.Control
                        value={section.title || "Main Ingredients"} 
                        placeholder="Section Title"
                        onChange={(e) =>
                          handleUpdateSectionTitle(section._id, e.target.value)
                        }
                      />
                    </Form.Group>
                    <strong className="d-block mb-2">Ingredients</strong>
                    {section["ingredients"].map(
                      (ingredient: string, index: number) => (
                        <div
                          key={index}
                          className="d-flex align-items-center gap-2 mb-2"
                        >
                          <Form.Control
                            value={ingredient}
                            placeholder="Ingredient"
                            onChange={(e) =>
                              handleUpdateIngredient(
                                section._id,
                                index,
                                e.target.value
                              )
                            }
                          />
                          {section["ingredients"].length > 1 && (
                            <FaRegTrashCan
                              className="delete-icon"
                              onClick={() =>
                                handleDeleteIngredient(section._id, index)
                              }
                            />
                          )}
                        </div>
                      )
                    )}
                    <Button
                      className="recipe-editor-btn"
                      style={{ color: "#225593" }}
                      onClick={() => handleAddIngredient(section._id)}
                    >
                      + Add another ingredient
                    </Button>
                    <hr></hr>
                  </div>
                ))}
                <Button
                  className="recipe-editor-btn"
                  style={{ color: "#CD9F08" }}
                  onClick={handleAddSection}
                >
                  + Add another section
                </Button>
              </div>
            </Col>
          </Row>

          {/* Instructions Section */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Instructions</Form.Label>
            </Col>
            <Col>
              <div className="border p-3 rounded">
                {steps.map((step: string, idx: number) => (
                  <div
                    key={idx}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <Form.Control
                      key={idx}
                      as="textarea"
                      rows={2}
                      className="mb-2"
                      value={step}
                      placeholder="New Step"
                      onChange={(e) => handleUpdateStep(idx, e.target.value)}
                    />
                    {steps.length > 1 && (
                      <FaRegTrashCan
                        className="delete-icon"
                        onClick={() => handleDeleteStep(idx)}
                      />
                    )}
                  </div>
                ))}

                <Button
                  className="recipe-editor-btn"
                  style={{ color: "#CD9F08" }}
                  onClick={handleAddStep}
                >
                  + Add step
                </Button>
              </div>
            </Col>
          </Row>

          {/* Total Time */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Total Time</Form.Label>
            </Col>
            <Col>
              <Form.Control
                value={totalTime}
                onChange={(e) => setTotalTime(e.target.value)}
              />
            </Col>
          </Row>

          {/* Serves */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Serves</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="number"
                value={serves}
                onChange={(e) => setServes(e.target.value)}
              />
            </Col>
          </Row>

          {/* Tags */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Tags</Form.Label>
            </Col>
            <Col>
              <Form.Control
                value={tags}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Enter up to 3 tags, separated by commas"
              />
            </Col>
          </Row>

          {/* Recipe Photo Section */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Recipe Photo</Form.Label>
            </Col>
            <Col>
              <div className="d-flex align-items-center gap-3">
                {/* Current Photo Preview */}
                <Image
                  src={photo || "/images/default.jpg"}
                  alt="Recipe"
                  width={80}
                  height={80}
                  style={{ objectFit: "cover" }}
                />
                <div>
                  {/* File Input for Upload */}
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    size="sm"
                  />
                </div>
              </div>
            </Col>
          </Row>

          {/* Buttons */}
          <div className="d-flex mt-4">
            {!isNew && (
              <Button id="delete-btn" size="sm" onClick={handleDeleteRecipe}>
                Delete Recipe
              </Button>
            )}
            <div className="ms-auto d-flex">
              <Link
                to={
                  isNew
                    ? `/ReciPals/Account/Profile/${currentUser._id}`
                    : `/ReciPals/Recipes/${rid}`
                }
              >
                <Button id="cancel-btn" size="sm" className="me-2">
                  Cancel
                </Button>
              </Link>
              <Button id="save-btn" size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </Form>
      ) : (
        <p className="text-danger">Recipe not found.</p>
      )}
    </Container>
  );
}
