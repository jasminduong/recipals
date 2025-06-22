import { Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import * as client from "./client";

// represents the login component
export default function Login() {
  // initializes state variable credentials with mutator function setCredentials
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // signin function that searches for a user with the credentials
  // if there's a user that matches, store it in the reducer by dispatching it to the Account reducer using the setCurrentUser reducer function
  // ignore the sign in attempt if there's no match
  // after signing in, navigate to the Home
  const signin = async () => {
    try {
      const user = await client.signin(credentials); // fetches signin credentials from client
      if (!user) {
        alert("Invalid username or password. Please try again.");
        return;
      }
      dispatch(setCurrentUser(user));
      navigate("/ReciPals/Home");
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert("Invalid username or password. Please try again.");
      } else if (err.response?.status === 404) {
        alert("User not found. Please check your username.");
      } else {
        alert("Login failed. Please try again later.");
      }
    }
  };

  // event handler for handling key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      signin();
    }
  };

  return (
    <div id="signin-screen">
      <Card className="card">
        <h4 id="signin-title">Login</h4>
        <Form.Control
          id="username"
          placeholder="Username"
          defaultValue={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          onKeyPress={handleKeyPress}
          className="mb-2 text-input-field"
        />
        <Form.Control
          id="password"
          placeholder="Password"
          type="password"
          defaultValue={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          onKeyPress={handleKeyPress}
          className="mb-2 text-input-field"
        />
        <Button
          id="signin-btn"
          onClick={signin}
          className="btn w-100 mb-2"
        >
          Login{" "}
        </Button>
        <Link
          id="wd-signup-link"
          to="/ReciPals/Account/Signup"
          className="btn w-100 mb-2"
        >
          Sign up
        </Link>
      </Card>
    </div>
  );
}
