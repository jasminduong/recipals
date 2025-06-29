import { Button, Col, Container, Form, Row, Image } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../reducer";
import { setUsers } from "../userReducer";
import * as client from "../client";
import imageCompression from "browser-image-compression";

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

// represents a profile editor 
export default function ProfileEditor() {
  const { uid } = useParams();
  const { users } = useSelector((state: any) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // loads users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await client.getAllUsers();
        dispatch(setUsers(allUsers));
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    if (users.length === 0) {
      loadUsers();
    }
  }, [users.length, dispatch]);

  // initializes a state variable userToEdit and mutator method to update user
  const [userToEdit, setUserToEdit] = useState<any>(null);

  // initializes a state variable selectedTags as an array of strings, to store the tags the user selects
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // handles tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags((prev) => [...prev, tag]);
    } else {
      alert("You can only select up to 3 tags. Please deselect a tag before selecting a new one.");
    }
  };

  // gets the current user
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // loads users
  useEffect(() => {
    if (users.length > 0) {
      const targetUser = users.find((user: any) => user._id === uid);

      if (!targetUser) {
        alert("User not found. Redirecting to login page.");
        navigate("/ReciPals/Account/Login");
        return;
      }
    }
  }, [users, uid, currentUser, navigate]);

  // when userToEdit is loaded or changes, initialize selectedTags with userToEdit.tags
  useEffect(() => {
    if (users.length > 0) {
      const originalUser = users.find((user: any) => user._id === uid);
      if (originalUser) {
        setUserToEdit({ ...originalUser });
        setSelectedTags(originalUser.tags || []);
        setPhotoChanged(false);
      }
    }
  }, [uid, users]);

  // tracks whether the photo was changed
  const [photoChanged, setPhotoChanged] = useState(false);

  // event handler to update profile photo
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
          setUserToEdit({ ...userToEdit, profile: base64String });
          setPhotoChanged(true);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Failed to process the image. Please try again.");
      }
    }
  };

  // sets admin password
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // event handler for role change
  const handleRoleChange = (selectedRole: string) => {
    if (selectedRole === "ADMIN") {
      setShowAdminPassword(true);
    } else {
      setUserToEdit({ ...userToEdit, role: selectedRole });
      setShowAdminPassword(false);
      setAdminPassword("");
    }
  };

  // event handler for admin password verification
  const handleAdminPasswordSubmit = () => {
    const ADMIN_PASSWORD = "Admin4me!";

    if (adminPassword === ADMIN_PASSWORD) {
      setUserToEdit({ ...userToEdit, role: "ADMIN" });
      setShowAdminPassword(false);
      setAdminPassword("");
      alert("Admin access granted!");
    } else {
      alert("Incorrect admin password");
      setAdminPassword("");
      setUserToEdit({ ...userToEdit, role: "USER" });
    }
  };

  // event handler to save changes
  const handleSave = async () => {
    if (!userToEdit) return;

    const updatedUserPayload = {
      ...userToEdit,
      tags: selectedTags,
    };

    // if photo wasn't changed, remove from payload
    if (!photoChanged) {
      delete updatedUserPayload.profile;
    }

    try {
      const updatedUser = await client.updateUser(updatedUserPayload);

      // update local redux state
      const updatedUsers = users.map((user: any) =>
        user._id === uid ? { ...user, ...updatedUserPayload } : user
      );
      dispatch(setUsers(updatedUsers));

      // update current user if editing own profile
      if (currentUser && currentUser._id === uid) {
        dispatch(setCurrentUser(updatedUser));
      }

      navigate(`/ReciPals/Account/Profile/${uid}`);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // signout event handler clears the current user from the redux store and then redirects user to signin page
  const signout = async () => {
    await client.signout();
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

          <Form.Group>
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={userToEdit.role || "USER"}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="form-control mb-2"
              id="wd-role"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </Form.Select>

            {showAdminPassword && (
              <div className="mb-3">
                <Form.Label>Admin Password Required</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAdminPasswordSubmit()
                    }
                  />
                  <Button
                    id="save-btn"
                    style={{
                      fontSize: "14px",
                    }}
                    onClick={handleAdminPasswordSubmit}
                  >
                    Verify
                  </Button>
                  <Button
                    id="cancel-btn"
                    style={{
                      fontSize: "14px",
                    }}
                    onClick={() => {
                      setShowAdminPassword(false);
                      setUserToEdit({ ...userToEdit, role: "USER" });
                      setAdminPassword("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
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
                  src={
                    userToEdit.profile ||
                    "https://recipals.netlify.app/images/profile.png"
                  }
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
              <Button id="save-btn" size="sm" onClick={handleSave}>
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
