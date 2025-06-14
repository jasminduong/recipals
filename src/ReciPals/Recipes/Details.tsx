import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import * as db from "../Database";
import { BiBookmark } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function RecipeDetails() {
  const { rid } = useParams();
  const navigate = useNavigate();
  const recipes = db.recipes;
  const currRecipe = recipes.find((recipe) => recipe._id === rid);
  const posts = db.posts;
  const currPost = posts.find(
    (post) => post.created_by === currRecipe?.user_created
  );

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
                  width: "260px",
                  height: "260px",
                  objectFit: "cover",
                }}
                alt={currRecipe.name}
              />
            </Col>
            {/* recipe title and bookmark */}
            <Col xs={12} md={7} lg={8}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h2
                  className="mb-0 me-2 flex-grow-1"
                  style={{
                    lineHeight: "1.2",
                  }}
                >
                  {currRecipe.name}
                </h2>
                <BiBookmark
                  style={{
                    width: "40px",
                    height: "40px",
                    minWidth: "30px",
                    minHeight: "30px",
                  }}
                  className="flex-shrink-0"
                />
              </div>
              {/* recipe description */}
              <p className="text-muted fst-italic mb-3">
                {currRecipe.description}
              </p>

              {/* recipe stats */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-3">
                <div className="mb-2 mb-sm-0">
                  <div>
                    <strong>Total Time:</strong> {currRecipe.total_time}
                  </div>
                  <div>
                    <strong>Serves:</strong> {currRecipe.serves}
                  </div>
                </div>
                <Button
                  className="edit-button text-dark"
                  size="sm"
                  onClick={() =>
                    navigate(`/ReciPals/Editor/${currRecipe._id}`)
                  }
                >
                  Edit Recipe
                </Button>
              </div>

              {/* recipe tags */}
              <div className="d-flex flex-wrap gap-2">
                {currRecipe.tags.map((tag: string, index: number) => (
                  <span key={index} className="btn profile-tags">
                    {tag}
                  </span>
                ))}
              </div>
            </Col>
          </Row>

          {/* Ingredients and Instructions */}
          <Row className="border-top pt-4">
            <Col xs={12} lg={4} className="mb-4 mb-lg-0">
              <div className="border-end-lg pe-lg-4">
                <h4 className="mb-4">Ingredients</h4>
                {currRecipe.ingredients_sec.map((section) => (
                  <div key={section._id} className="mb-4">
                    <h6 className="fw-bold mb-2">For the {section.title}</h6>
                    <ul className="list-unstyled ps-3">
                      {section["ingredients:"].map((ingredient, idx) => (
                        <li key={idx} className="mb-1">
                          <span className="me-2">•</span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Col>

            <Col xs={12} lg={8}>
              <h4 className="mb-3">Instructions</h4>
              <ol className="ps-3">
                {currRecipe.steps.map((steps, index) => (
                  <li key={index} className="mb-1 lh-lg">
                    {steps}
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
            <Form className="mb-4">
              <Form.Control placeholder="Add a comment..." />
            </Form>

            {/* Comments list */}
            {currPost?.comments.map((comment, index) => (
              <div key={index} className="mb-3 pb-3 border-bottom">
                <Row className="g-3">
                  <Col xs="auto">
                    <img
                      src="/images/profile.png"
                      alt="Profile picture"
                      className="rounded-circle"
                      style={{
                        width: "45px",
                        height: "45px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col>
                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
                      <strong className="me-2">{comment.user_id}</strong>
                    </div>
                    <div>
                      <small className="text-muted">{comment.created_at}</small>
                    </div>
                    <p className="mb-0">{comment.text}</p>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <p className="text-danger fs-4">Recipe not found.</p>
        </div>
      )}
    </Container>
  );
}
