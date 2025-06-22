import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import * as client from "../Account/client";
import { Button, Form, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../Account/userReducer";

// represents the people details overlay for admin management
export default function PeopleDetails() {
  const { uid } = useParams();
  const users = useSelector((state: any) => state.userReducer.users);
  const [user, setUser] = useState<any>({});
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // gets users by id
  const fetchUser = async () => {
    if (!uid) return;
    const user = await client.findUserById(uid);
    setUser(user);
    setRole(user.role);
  };
  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);
  if (!uid) return null;

  // deletes a user
  const deleteUser = async (uid: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await client.deleteUser(uid);
      navigate(-1);
    }
    const updatedUsers = users.filter((u: any) => u._id !== uid);
    dispatch(setUsers(updatedUsers));
  };

  // saves the user
  const saveUser = async () => {
    try {
      const updatedUser = { ...user, role };
      await client.updateUser(updatedUser);
      setUser(updatedUser);

      const updatedUsers = users.map((u: any) =>
        u._id === updatedUser._id ? updatedUser : u
      );
      dispatch(setUsers(updatedUsers));

      navigate(-1);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button
        onClick={() => navigate(-1)}
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <Image
          src={user.profile}
          roundedCircle
          fluid
          alt={`${user.username} profile`}
          className="people-details-profile-image"
        />
      </div>
      <hr />
      <div className="user-name text-bold pb-1 people-details-user-name">
        {user.name}
      </div>
      <div className="user-username pb-1">
        <b>Username: </b>
        <span className="people-details-info-text">{user.username}</span>
      </div>
      <div className="user-bio pb-1">
        <b>Bio: </b>
        <span className="people-details-info-text">{user.bio}</span>
      </div>
      <div className="user-bio pb-1">
        <b>Tags: </b>
        <span className="people-details-info-text">
          {Array.isArray(user.tags) && user.tags.length > 0
            ? user.tags.join(", ")
            : "No tags"}
        </span>
      </div>
      <div className="mb-3 d-flex align-items-center">
        <Form.Label className="mb-0 me-2">
          <b>Role: </b>
        </Form.Label>
        <Form.Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-control people-details-role-select"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </Form.Select>
      </div>
      {/* User Posts Section */}
      <div className="mb-3">
        <div className="pb-1">
          <b>Posts ({user.posts?.length || 0}): </b>
        </div>
        <div className="people-details-posts-container">
          {user.posts && user.posts.length > 0 ? (
            user.posts.map((recipeId: string, _index: number) => (
              <div
                key={recipeId}
                className="d-flex justify-content-between align-items-center rounded p-2 mb-2 people-details-post-item"
              >
                <div>
                  <b>Recipe ID:</b> {recipeId}
                </div>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(recipeId);
                  }}
                >
                  Copy ID
                </Button>
              </div>
            ))
          ) : (
            <div className="people-details-no-posts">No posts yet</div>
          )}
        </div>
      </div>
      {/* buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button onClick={() => deleteUser(uid)} id="delete-btn" size="sm">
          Delete
        </Button>

        <div className="d-flex gap-2">
          <Button onClick={() => navigate(-1)} id="cancel-btn" size="sm">
            Cancel
          </Button>
          <Button onClick={saveUser} id="save-btn" size="sm">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
