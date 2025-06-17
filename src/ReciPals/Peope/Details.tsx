import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import * as client from "../Account/client";
import { Button, Form, Image } from "react-bootstrap";

export default function PeopleDetails() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>({});
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();

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
  };

  // saves the user
  const saveUser = async () => {
    const updatedUser = { ...user, role };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    navigate(-1);
  };

  return (
    <div className="position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button
        onClick={() => navigate(-1)}
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />{" "}
      </button>
      <div className="text-center mt-2">
        <Image
          src={user.profile}
          roundedCircle
          fluid
          alt={`${user.username} profile`}
          style={{ width: 50, objectFit: "cover" }}
        />
      </div>
      <hr />
      <div
        className="user-name text-bold pb-1"
        style={{ fontSize: "20px", color: "#cd9f08" }}
      >
        {user.name}
      </div>
      <div className="user-username pb-1">
        <b>Username: </b>
        {user.username}
      </div>
      <div className="user-bio pb-1" >
        <b>Bio: </b>
        {user.bio}
      </div>
      <div className="mb-3 d-flex align-items-center">
        <Form.Label className="mb-0 me-2">
          <b>Role: </b>
        </Form.Label>
        <Form.Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-control"
          style={{ width: "auto", fontSize: "14px" }}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </Form.Select>
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
