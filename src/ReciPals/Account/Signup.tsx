import { Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div id="signup-screen">
      <Card>
        <h4 id="signup-title">Signup</h4> 
        <Form.Control
          id="name"
          placeholder="Name"
          className="mb-2 text-input-field"
        />
        <Form.Control
          id="username"
          placeholder="Username"
          className="mb-2 text-input-field"
        />
        <Form.Control
          id="password"
          placeholder="Password"
          type="password"
          className="mb-2 text-input-field"
        />
        <Form.Control
          id="verify-password"
          placeholder="Verify password"
          type="password"
          className="mb-2 text-input-field"
        />
        <Link
          id="signup-btn"
          to="/ReciPals/Account/SignupTags"
          className="btn w-100 mb-2"
        >
          Next{" "}
        </Link>
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
