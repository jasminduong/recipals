import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProjectInfo() {
  return (
    <Container>
      <h5>
        <b>Creators:</b>
      </h5>{" "}
      Jasmin Duong<br /> Daniel Jacob
      <br />
      <br></br>
      <h5>
        <b>Github Repo Links:</b>
      </h5>
      <Link
        to="https://github.com/jasminduong/recipals"
        className="link-primary text-decoration-none"
        target="_blank"
        rel="noopener noreferrer"
      >
        React Web App
      </Link>
      <br />
      <Link
        to="https://github.com/jasminduong/recipals-node-server-app"
        className="link-primary text-decoration-none"
        target="_blank"
        rel="noopener noreferrer"
      >
        Node.js Server
      </Link>
      <br />
      <br></br>
      <h5>
        <b>Overview:</b>
      </h5>
      ReciPals is a social recipe-sharing web application where users can share,
      discover, and save recipes. The application is pre-loaded with 300+
      recipes fetched from TheMealDB API (
      <a
        href="https://www.themealdb.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://www.themealdb.com/
      </a>
      ) attributed to "recipe_bot" to provide immediate content for users to
      explore.
      <br />
      <br />
      <h5>
        <b>Core Features:</b>
      </h5>
      <ul>
        <li>
          <b>Home</b>
          <ul>
            <li>Loads recipe post feed (login not required)</li>
            <li>Loads followers’ posts first</li>
          </ul>
        </li>
        <li>
          <b>Login and Signup</b>
          <ul>
            <li>Login with username and password</li>
            <li>
              Signup required information include name, username, password, and
              tags
            </li>
          </ul>
        </li>
        <li>
          <b>Profile</b>
          <ul>
            <li>Display and edit profile information</li>
            <li>Display user posts and saved recipes</li>
            <li>Follow and unfollow users</li>
          </ul>
        </li>
        <li>
          <b>Search</b>
          <ul>
            <li>
              Search recipes by name, ingredient, tags
            </li>
            <li>Search users by name and username</li>
          </ul>
        </li>
        <li>
          <b>Recipe and Post</b>
          <ul>
            <li>Create and edit recipes</li>
            <li>
              View complete recipe details, including name, photo, ingredients,
              instructions, total time, and serving
            </li>
            <li>Interact with posts: like and comment</li>
            <li>Save recipes</li>
          </ul>
        </li>
        <li>
          <b>Admin Management</b>
          <ul>
            <li>Admin user type required</li>
            <li>Update user role types and delete users</li>
            <li>Edit and delete recipes and posts</li>
          </ul>
        </li>
      </ul>
    </Container>
  );
}
