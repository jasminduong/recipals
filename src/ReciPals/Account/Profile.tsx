import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h4 id="wd-profile-title">Profile</h4>
      <Form.Control
        id="wd-username"
        placeholder="alice"
        className="mb-2 text-input-field"
      />

      <Form.Control
        id="wd-password"
        placeholder="123"
        className="mb-2 text-input-field"
      />

      <Form.Control
        id="wd-firstname"
        placeholder="Alice"
        className="mb-2 text-input-field"
      />

      <Form.Control
        id="wd-lastname"
        placeholder="Wonderland"
        className="mb-2 text-input-field"
      />

      <Form.Control type="date" defaultValue="MM/DD/YYYY" />

      <Form.Control
        id="wd-email"
        placeholder="alice@wonderland.com"
        className="mb-2 text-input-field"
      />

      <Form.Select id="wd-user-type" defaultValue="Student" className="mb-3">
        <option value="Student">Student</option>
        <option value="Instructor">Instructor</option>
      </Form.Select>

      <Link
        id="wd-signout-btn"
        to="/ReciPals/Account/Login"
        className="btn btn-danger w-100 mb-2"
      >
        Signout
      </Link>
    </div>
  );
}
