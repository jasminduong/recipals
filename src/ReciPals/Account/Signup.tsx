import { Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setNewUser } from "./reducer";
//import { setNewUser } from "./reducer";

export default function Signup() {
  // sets new user name, username, password
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    verifyPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // event handler to handle user input and navigate to next page if no errors
  const handleNext = () => {

    if (!formData.name || !formData.username || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.verifyPassword) {
      alert("Passwords don't match");
      return;
    }

    const userData = {
      name: formData.name,
      username: formData.username,
      password: formData.password,
    };

    dispatch(setNewUser(userData));
    navigate("/ReciPals/Account/SignupTags");
  };

  return (
    <div id="signup-screen">
      <Card>
        <h4 id="signup-title">Signup</h4>
        <Form.Control
          id="name"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mb-2 text-input-field"
        />
        <Form.Control
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="mb-2 text-input-field"
        />
        <Form.Control
          id="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="mb-2 text-input-field"
        />
        <Form.Control
          id="verify-password"
          placeholder="Verify password"
          type="password"
          value={formData.verifyPassword}
          onChange={(e) =>
            setFormData({ ...formData, verifyPassword: e.target.value })
          }
          className="mb-2 text-input-field"
        />
        <Button id="signup-btn" onClick={handleNext} className="btn w-100 mb-2">
          Next{" "}
        </Button>
        <Link
          id="signin-link"
          to="/ReciPals/Account/Login"
          className="btn w-100 mb-2"
        >
          Login
        </Link>
      </Card>
    </div>
  );
}
