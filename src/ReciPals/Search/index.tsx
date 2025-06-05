import { Container, FormControl } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import * as db from "../Database";

export default function Search() {
  const posts = db.posts;

    return (
        <Container fluid className="mt-4 px-2 px-md-4" id="search">
            <div className="position-relative me-3 d-flex align-items-center mb-4">
                <FormControl type="search" placeholder="Search recipes, ingredients, users..." className="ps-5" />
                <div className="position-absolute top-50 translate-middle-y ms-3 text-secondary">
                    <BiSearch />
                </div>
             </div>
             <div>
{/* {posts.map((section) => (
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
                ))} */}
             </div>
        </Container>
        
    )
}