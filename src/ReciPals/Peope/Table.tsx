import { Table, Image } from "react-bootstrap";
import PeopleDetails from "./Details";
import { Link } from "react-router-dom";

export default function PeopleTable({ users = [] }: { users?: any[] }) {
  return (
    <div id="users-table">
      <PeopleDetails />
      <Table striped style={{ fontSize: "12px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>User Id</th>
            <th>Username</th>
            <th>Role</th>
            <th>Posts</th>
            <th>Followers</th>
            <th>Following</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id}>
              <td className="text-nowrap">
                <Link
                  to={`/ReciPals/Account/Admin/Users/${user._id}`}
                  className="text-decoration-none text-dark"
                >
                  <Image
                    src={user.profile}
                    roundedCircle
                    fluid
                    alt={`${user.username} profile`}
                    style={{ width: 30, objectFit: "cover", marginRight: "10px" }}
                  />
                  <span>{user.name}</span>{" "}
                </Link>
              </td>
              <td className="user-info align-middle">{user._id}</td>
              <td className="user-info align-middle">{user.username}</td>
              <td className="user-info align-middle">{user.role}</td>
              <td className="user-info align-middle">{user.posts.length}</td>
              <td className="user-info align-middle">
                {user.followers.length}
              </td>
              <td className="user-info align-middle">
                {user.following.length}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
