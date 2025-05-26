import { Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import * as db from "../Database";

export default function Profile() {
  const { cid } = useParams<{ cid: string }>();
  const { users } = db;

  // Find the user by id
  const user = users.find((u) => u._id === cid);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div id="profile-screen" className="p-4">
      <Row className="align-items-center profile-pic">
        <Col xs={3}>
          <Image
            src={user.profile}
            roundedCircle
            fluid
            alt={`${user.username} profile`}
            style={{ width: 250 }}
          />
        </Col>

        <Col xs={12} sm={8} md={9} className="text-sm-start text-center ps-5">
          <div className="profile-username">{user.username}</div>

          <div className="d-flex justify-content-sm-start justify-content-center profile-user-info">
            <div>
              <strong>{user.posts}</strong> posts
            </div>
            <div>
              <strong>{user.followers}</strong> followers
            </div>
            <div>
              <strong>{user.following}</strong> following
            </div>
          </div>

          <div className="profile-name">{user.name}</div>
        </Col>
      </Row>
      <div className="profile-bio">{user.bio}</div>
      <div
        className="d-flex flex-wrap gap-2 mt-3"
        style={{ paddingLeft: "100px" }}
      >
        {user.tags.map((tag, index) => (
          <div key={index} className="btn profile-tags">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}
