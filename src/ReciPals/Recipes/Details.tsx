import { Button, Col, Container, Form, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import * as db from "../Database";
import { BiBookmark } from "react-icons/bi";

export default function RecipeDetails() {
  const { rid } = useParams();
  const recipes = db.recipes;
  const currRecipe = recipes.find((recipe) => recipe._id === rid);

  return (
    <Container fluid className="mt-4" id="recipe-editor">
    {currRecipe ? (
      <div>
        <div className="d-flex">
          <div>
            <img
              src={currRecipe.photo}
              style={{ width: "311px", height: "311px", objectFit: "cover" }}
              className="me-5"
            />
          </div>
          <div>
            <div id="recipe-title" className="justify-content-between d-flex ">
              {currRecipe.name}
              <BiBookmark style={{ width: "35px", height: "35px" }}/>
            </div>
            <p id="recipe-sub-title" className="mt-1">
              <i>
                {currRecipe.description}
              </i>
            </p>
            <div id="recipe-sub-title"className="justify-content-between d-flex align-items-start">
              <div>
                <b>Total Time: </b> {currRecipe.total_time}
                <br/>
                <b>Serves: </b> {currRecipe.serves}
              </div>
              <Button id="cancel-btn" className="pt-1">Edit Recipe</Button>
            </div>
            <div
            className="d-flex flex-wrap gap-2 mt-3"
            >
            {currRecipe.tags.map((tag: string, index: number) => (
              <div key={index} className="btn profile-tags">
                {tag}
              </div>
            ))}
            </div>
          </div>
        </div>
        <Row id="ingredients-instructions-sec">
          <Col className="col-4">
          <div id="recipe-sub-title" className="mt-5 mb-3">
            <b>Ingredients</b>
          </div>
          {currRecipe.ingredients_sec.map((section) => (
            <div key={section._id} className="mb-3">
              <b id="recipe-sub-title" className=" mb-2">For the {section.title}</b>
              <ul>
              {section["ingredients:"].map((ingredient) => (
                <li id="recipe-body" className="m-2">
                  {ingredient}
                </li>
              ))}
              </ul>
            </div>
          ))}
          </Col>
          <Col className="col-8">
            <div id="recipe-sub-title" className="mt-5 mb-3">
              <b>Instructions</b>
            </div>
            <ol>
            {currRecipe.instructions.map((instruction) => (
              <div  className="mb-3">
                <li id="recipe-body" className="">
                  {instruction}
                </li>
              </div>
            ))}
            </ol>
          </Col>
        </Row>
        <hr/>
      </div>
      ) : (
        <p className="text-danger">Recipe not found.</p>
      )}
    </Container>
  );
}
