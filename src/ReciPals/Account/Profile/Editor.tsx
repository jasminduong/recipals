import { Button, Col, Container, Form, Row, Image } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../reducer";
import { setUsers } from "../userReducer";

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
  const { users } = useSelector((state: any) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // initializes a state variable userToEdit and mutator method to update user
  const [userToEdit, setUserToEdit] = useState<any>(null);

  // initializes a state variable selectedTags as an array of strings, to store the tags the user selects
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // when userToEdit is loaded or changes, initialize selectedTags with userToEdit.tags
  useEffect(() => {
    const originalUser = users.find((user: any) => user._id === uid);
    if (originalUser) {
      setUserToEdit({ ...originalUser }); // Create a copy
      setSelectedTags(originalUser.tags || []);
    }
  }, [uid]);

  // event handler to update profile photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUserToEdit({ ...userToEdit, profile: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  // event handler to save changes
  const handleSave = () => {
    if (!userToEdit) return;

    const updatedUserPayload = {
      ...userToEdit,
      tags: selectedTags,
    };

    // find and update the original user in database
    const userIndex = users.findIndex((user: any) => user._id === uid);
    if (userIndex !== -1) {
      const updatedUsers = users.map((user: any) =>
        user._id === uid ? updatedUserPayload : user
      );
      dispatch(setUsers(updatedUsers));

      if (currentUser && currentUser._id === uid) {
        dispatch(setCurrentUser(updatedUserPayload));
      }
    }

    navigate(`/ReciPals/Account/Profile/${uid}`);
  };

  // signout event handler clears the current user from the redux store and then redirects user to signin page
  const signout = () => {
    dispatch(setCurrentUser(null));
    navigate("/ReciPals/Account/Login");
  };

  return (
    <Container fluid className="mt-4" id="profile-editor">
      {userToEdit ? (
        <Form>
          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              defaultValue={userToEdit.name}
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, name: e.target.value })
              }
            />
          </Form.Group>

          {/* Username */}
          <Form.Group className="mb-4">
            <Form.Label>Username</Form.Label>
            <Form.Control
              defaultValue={userToEdit.username}
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, username: e.target.value })
              }
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              defaultValue={userToEdit.password}
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, password: e.target.value })
              }
            />
          </Form.Group>

          {/* Bio */}
          <Form.Group className="mb-4">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              defaultValue={userToEdit.bio}
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, bio: e.target.value })
              }
            />
          </Form.Group>

          {/* Profile Photo Section */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Label>Profile Photo</Form.Label>
            </Col>
            <Col>
              <div className="d-flex align-items-center gap-3">
                {/* Current Photo Preview */}
                <Image
                  src={userToEdit.profile || "/images/profile.png"}
                  alt="Profile"
                  roundedCircle
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
          <div className="d-flex justify-content-between mt-4">
            <Button id="signout-btn" size="sm" onClick={signout}>
              Signout
            </Button>
            <div className="d-flex justify-content-end">
              <Link to={`/ReciPals/Account/Profile/${uid}`}>
                <Button id="cancel-btn" size="sm" className="me-2">
                  Cancel
                </Button>
              </Link>
              <Button
                id="save-btn"
                size="sm"
                type="submit"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </Form>
      ) : (
        <p className="text-danger">User not found.</p>
      )}
    </Container>
  );
}
