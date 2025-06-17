import { useEffect } from "react";
import { useParams } from "react-router";
import * as client from "../client";
import { Button, FormControl } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import PeopleTable from "../../Peope/Table";
import PeopleDetails from "../../Peope/Details"; 
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../userReducer";

export default function AllUsers() {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.userReducer.users);

  // gets all users
  const fetchUsers = async () => {
    try {
      const users = await client.getAllUsers();
      dispatch(setUsers(users));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); 

  // filters user by name
  const filterUsersByName = async (name: string) => {
    if (name) {
      const users = await client.findUsersByPartialName(name);
      dispatch(setUsers(users));
    } else {
      fetchUsers();
    }
  };

  // event handler sends a new user object to be inserted in the database
  const createUser = async () => {
    try {
      const user = await client.createUser({
        name: `User${users.length + 1}`,
        username: `user${users.length + 1}`,
        password: "password123",
        role: "USER",
        profile: "/images/profile.png"
      });
      dispatch(setUsers([...users, user]));
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="position-relative">
      <div>
        <Button
          onClick={createUser}
          className="float-end"
          style={{ fontSize: "12px" }}
          id="save-btn"
          size="sm"
        >
          <FaPlus className="me-2" />
          User
        </Button>
        <FormControl
          onChange={(e) => filterUsersByName(e.target.value)}
          placeholder="Search users"
          className="float-start me-2 admin-filter-by-name"
        />
        <div className="clearfix mb-3"></div>
        <PeopleTable users={users} />
      </div>

      {uid && <PeopleDetails />}
    </div>
  );
}
