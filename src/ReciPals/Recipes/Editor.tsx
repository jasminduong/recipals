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
import { addPost, deletePost, updatePost } from "./postReducer";
import { FaRegTrashCan } from "react-icons/fa6";
import * as recipeClient from "./recipeClient";
import * as postClient from "./postClient";
import axios from "axios";
import { setCurrentUser } from "../Account/reducer";
const axiosWithCredentials = axios.create({ 
  withCredentials: true 
});

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

  // gets user
  const fetchProfile = async () => {
    const response = await axiosWithCredentials.post("/api/users/profile");
    return response.data;
  };
  useEffect(() => {
    const loadProfile = async () => {
      const user = await fetchProfile();
      if (user) {
        dispatch(setCurrentUser(user));
      }
    };

    loadProfile();
  }, []);

  // gets all recipes
  const fetchRecipes = async () => {
    const recipes = await recipeClient.getAllRecipes();
    return recipes;
  };

  useEffect(() => {
    const loadData = async () => {
      // load user profile
      const user = await fetchProfile();
      if (user) {
        dispatch(setCurrentUser(user));
      }
      // load recipes
      const recipes = await fetchRecipes();
      if (recipes) {
        dispatch(setRecipes(recipes));
      }
    };

    loadData();
  }, [dispatch, navigate]);

  const recipeToEdit = recipes.find(
    (recipe: Recipe) => recipe.recipe_id === rid
  );

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
        "ingredients:": [""],
      },
    ]
  );
  const [steps, setSteps] = useState(recipeToEdit?.steps || [""]);
  const [photo, setPhoto] = useState(
    recipeToEdit?.photo || "/images/default.jpg"
  );
  const isNew = !recipeToEdit;

  // variables for each post field
  const recipeId = isNew ? uuidv4() : rid;
  const postId = isNew ? uuidv4() : recipeToEdit?.post_id;
  const existingPost = !isNew
    ? posts.find((p: any) => p.recipe_id === rid)
    : null;

  // event handler to update profile photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhoto(base64String);
      };
      reader.readAsDataURL(file);
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
          const updatedIngredients = [...section["ingredients:"]];
          updatedIngredients[index] = value;
          return { ...section, "ingredients:": updatedIngredients };
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
            "ingredients:": [...section["ingredients:"], ""],
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
      "ingredients:": [""],
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
          const updatedIngredients = [...section["ingredients:"]];
          updatedIngredients.splice(ingredientIndex, 1);
          return { ...section, "ingredients:": updatedIngredients };
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
      section["ingredients:"].some((ingredient: string) => ingredient.trim())
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
      photo,
    };

    const postPayload = {
      post_id: postId,
      recipe_id: recipeId,
      created_by: currentUser?._id || recipeToEdit?.user_created,
      title: name,
      caption: description,
      photo: photo,
      likes: isNew ? [] : existingPost?.likes || [],
      comments: isNew ? [] : existingPost?.comments || [],
      created_at: isNew
        ? new Date().toISOString().split("T")[0]
        : existingPost?.created_at || new Date().toISOString().split("T")[0],
    };

    if (isNew) {
      const newRecipe = await recipeClient.createRecipe(recipePayload);
      const newPost = await postClient.createPost(postPayload);

      dispatch(addRecipe(newRecipe));
      dispatch(addPost(newPost));
      navigate(`/ReciPals/Home/${recipeId}`);
    } else {
      const updatedRecipe = await recipeClient.updateRecipe(recipePayload);
      const updatedPost = await postClient.updatePost(postPayload);

      dispatch(updateRecipe(updatedRecipe));
      dispatch(updatePost(updatedPost));
      navigate(`/ReciPals/Home/${rid}`);
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

      navigate("/ReciPals/Profile");
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
            />
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
            />
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
                        value={section.title}
                        placeholder="Section Title"
                        onChange={(e) =>
                          handleUpdateSectionTitle(section._id, e.target.value)
                        }
                      />
                    </Form.Group>
                    <strong className="d-block mb-2">Ingredients</strong>
                    {section["ingredients:"].map(
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
                          {section["ingredients:"].length > 1 && (
                            <FaRegTrashCan
                              style={{
                                cursor: "pointer",
                                minWidth: "16px",
                                fontSize: "16px",
                                color: "#e13626",
                              }}
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
                        style={{
                          cursor: "pointer",
                          minWidth: "16px",
                          fontSize: "16px",
                          color: "#e13626",
                        }}
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
          <div className="d-flex justify-content-between mt-4">
            {!isNew && (
              <Button id="delete-btn" size="sm" onClick={handleDeleteRecipe}>
                Delete Recipe
              </Button>
            )}
            <div className="d-flex justify-content-end">
              <Link to={isNew ? "/ReciPals/Profile" : `/ReciPals/Home/${rid}`}>
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
