import { Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div id="signin-screen">
      <Card className="card">
        <h4 id="signin-title">Login</h4>
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
        <Link
          id="signin-btn"
          to="/ReciPals/Account/Profile"
          className="btn w-100 mb-2"
        >
          Login{" "}
        </Link>
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
