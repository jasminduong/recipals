import { Row, Col, Image, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import * as db from "../../Database";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

export default function Profile() {
  const { cid } = useParams<{ cid: string }>();
  const { users } = db;
  const navigate = useNavigate();

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // finds the user by id
  const user = users.find((u) => u._id === cid) ?? currentUser;
  if (!user) {
    return <div>User not found</div>;
  }

  // useEffect redirects user to login page if not signed in
  useEffect(() => {
    if (!currentUser) navigate("/ReciPals/Account/Login");
  }, [currentUser]);

  // initializes state variable activeTab to my recipes and mutator function setActiveTab
  const [activeTab, setActiveTab] = useState<"myRecipes" | "saved">(
    "myRecipes"
  );

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
          <Row className="align-items-center justify-content-between">
            <Col xs="auto">
              <div className="profile-username">{user.username}</div>
            </Col>
            <Col xs="auto">
              <Button
                className="edit-button text-dark"
                onClick={() => navigate(`/ReciPals/Profile/${user._id}/Edit`)}
              >
                Edit Profile
              </Button>
            </Col>
          </Row>
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
        {user.tags.map((tag: string, index: number) => (
          <div key={index} className="btn profile-tags">
            {tag}
          </div>
        ))}
      </div>

      <div className="profile-recipes d-flex justify-content-center mt-4">
        <button
          className={`tab-btn ${activeTab === "myRecipes" ? "active" : ""}`}
          onClick={() => setActiveTab("myRecipes")}
        >
          My Recipes
        </button>
        <button
          className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
      </div>
    </div>
  );
}
