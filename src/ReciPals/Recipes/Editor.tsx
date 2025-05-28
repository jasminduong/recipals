import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import * as db from "../Database";

export default function RecipeEditor() {
  const { rid } = useParams();
  const recipes = db.recipes;

  const recipeToEdit = recipes.find((recipe) => recipe._id === rid);

  return (
    <Container fluid className="mt-4" id="recipe-editor">
      {recipeToEdit ? (
        <Form>
          {/* Recipe Name */}
          <Form.Group className="mb-3">
            <Form.Label>Recipe Name</Form.Label>
            <Form.Control defaultValue={recipeToEdit.name} />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-4">
            <Form.Label>Description (Caption)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              defaultValue={recipeToEdit.description}
            />
          </Form.Group>

          {/* Ingredients Section */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Ingredients</Form.Label>
            </Col>
            <Col>
              <div className="border p-3 rounded">
                {recipeToEdit.ingredients_sec.map((section) => (
                  <div key={section._id} className="mb-3">
                    <strong className="d-block mb-2">{section.title}</strong>
                    {section["ingredients:"].map((ingredient, index) => (
                      <Form.Control
                        key={index}
                        className="mb-2"
                        defaultValue={ingredient}
                      />
                    ))}
                    <Button className="recipe-editor-btn" style={{color: "#225593"}}>+ Add another ingredient</Button>
                    <hr></hr>
                  </div>
                ))}
                <Button className="recipe-editor-btn" style={{color: "#CD9F08"}}>+ Add another section</Button>
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
                {recipeToEdit.instructions.map((step, idx) => (
                  <Form.Control
                    key={idx}
                    as="textarea"
                    rows={2}
                    className="mb-2"
                    defaultValue={step}
                  />
                ))}
              </div>
            </Col>
          </Row>

          {/* Total Time */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Total Time</Form.Label>
            </Col>
            <Col>
              <Form.Control defaultValue={recipeToEdit.total_time} />
            </Col>
          </Row>

          {/* Serves */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Serves</Form.Label>
            </Col>
            <Col>
              <Form.Control type="number" defaultValue={recipeToEdit.serves} />
            </Col>
          </Row>

          {/* Tags */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Tags</Form.Label>
            </Col>
            <Col>
              <Form.Control defaultValue={recipeToEdit.tags.join(", ")} />
            </Col>
          </Row>

          {/* Photo Upload */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Photo</Form.Label>
            </Col>
            <Col>
              <Form.Control type="file" accept="image/*" />
            </Col>
          </Row>

          {/* Buttons */}
          <div className="d-flex justify-content-end mt-4">
            <Link to="/recipes">
              <Button id="cancel-btn" size="sm" className="me-2">
                Cancel
              </Button>
            </Link>
            <Button id="save-btn" size="sm" type="submit">
              Save
            </Button>
          </div>
        </Form>
      ) : (
        <p className="text-danger">Recipe not found.</p>
      )}
    </Container>
  );
}
