import { Col, Container, FormControl, Row } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import * as db from "../Database";

export default function Search() {
  const recipes = db.recipes;
// Filter down recipes, users, etc. based on user input (.contains()), then map those
    return (
      <Container fluid className="mt-4 px-2 px-md-4" id="search">
        <div className="position-relative me-3 d-flex align-items-center mb-4">
          <FormControl type="search" placeholder="Search recipes, ingredients, users..." className="ps-5" />
          <div className="position-absolute top-50 translate-middle-y ms-3 text-secondary">
            <BiSearch />
          </div>
        </div>
        <div>
          {recipes.map((recipe) => (
            <div>
              <Row className="mt-5 ms-1 mb-5">
                <Col xs={3} className="mb-3 mb-md-0">
                  <img
                    src={recipe.photo}
                    className="img-fluid"
                    style={{ 
                      width: "200px", 
                      height: "200px",
                      objectFit: "cover" 
                    }}
                  />
                </Col>
                <Col xs={9}>
                  <div className="recipe-body">
                    {recipe.user_created}
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="recipe-title">
                      {recipe.name}
                    </div>
                    <div className="recipe-sub-title">
                      <b>Total Time:</b> {recipe.total_time}
                    </div>
                  </div>
                  <div className="recipe-sub-title" >
                      {recipe.description}
                  </div>
                </Col>
              </Row>
              <hr/>
            </div>
          ))}
        </div>
      </Container>   
    )
}

// posts.filter((input) => input.contains(post.created_by) || input.contains(posts.title))