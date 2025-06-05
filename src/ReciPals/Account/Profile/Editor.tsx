import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import * as db from "../../Database";
import { useState, useEffect } from "react";

// defines each section of tags
const sections = [
  {
    title: "Skill Level / Role",
    tags: [
      "Home Cook",
      "Student Chef",
      "Baker",
      "Beginner",
      "Professional Chef",
      "Food Critic",
    ],
  },
  {
    title: "Cultural Cuisine Interest",
    tags: [
      "Asian Food Lover",
      "Italian Cuisine",
      "Latin Flavors",
      "Fusion Explorer",
      "Indian Spices",
      "Soul Food Fan",
      "Middle Eastern Eats",
    ],
  },
  {
    title: "Dietary Preferences / Cooking Values",
    tags: [
      "Vegetarian",
      "Vegan",
      "Gluten-Free",
      "Halal",
      "Kosher",
      "Dairy-Free",
      "Sustainable",
    ],
  },
];

export default function ProfileEditor() {
  const { uid } = useParams();
  const users = db.users;

  const userToEdit = users.find((user) => user._id === uid);

  // initializes a state variable selectedTags as an array of strings, to store the tags the user selects
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // when userToEdit is loaded or changes, initialize selectedTags with userToEdit.tags
  useEffect(() => {
    if (userToEdit && userToEdit.tags) {
      setSelectedTags(userToEdit.tags);
    }
  }, [userToEdit]);

  const toggleTag = (tag: string) => {
    // toggleTag(tag) is called when a tag is clicked
    if (selectedTags.includes(tag)) {
      // if the tag is already selected, remove it
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else if (selectedTags.length < 3) {
      // if the tag is not selected and fewer than 3 are selected, add it
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  return (
    <Container fluid className="mt-4" id="profile-editor">
      {userToEdit ? (
        <Form>
          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control defaultValue={userToEdit.name} />
          </Form.Group>

          {/* Username */}
          <Form.Group className="mb-4">
            <Form.Label>Username</Form.Label>
            <Form.Control defaultValue={userToEdit.username} />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control defaultValue={userToEdit.password} />
          </Form.Group>

          {/* Bio */}
          <Form.Group className="mb-4">
            <Form.Label>Username</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              defaultValue={userToEdit.bio}
            />
          </Form.Group>

          {/* Tags */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Tags</Form.Label>
            </Col>
            <Col>
              <div className="border p-3 rounded">
                {sections.map((section, index) => (
                  <div key={index} className="mb-4">
                    <h6 className="mb-3 mt-2">{section.title}</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {/* for each tag in each section, if selected, displays blue tag, otherwise displays white */}
                      {/* on click, calls toggleTag function */}
                      {section.tags.map((tag) => (
                        <Button
                          key={tag}
                          className={`profile-tag ${
                            selectedTags.includes(tag)
                              ? "selected"
                              : "not-selected"
                          }`}
                          size="sm"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
        <p className="text-danger">User not found.</p>
      )}
    </Container>
  );
}
