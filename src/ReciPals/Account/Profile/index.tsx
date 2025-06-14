import { Row, Col, Image, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { followUser, unfollowUser } from "../userReducer";

export default function Profile() {
  const { uid } = useParams<{ uid: string }>();
  const dispatch = useDispatch();
  const { users } = useSelector((state: any) => state.userReducer);
  const posts = useSelector((state: any) => state.postReducer.posts);
  const navigate = useNavigate();

  const { currentUser: loggedInUser } = useSelector((state: any) => state.accountReducer);
  const user = users.find((u: any) => u._id === uid) ?? loggedInUser;

  // useEffect redirects user to login page if not signed in
  useEffect(() => {
    if (!loggedInUser) navigate("/ReciPals/Account/Login");
  }, [loggedInUser]);

  // initializes state variable activeTab to my recipes and mutator function setActiveTab
  const [activeTab, setActiveTab] = useState<"myRecipes" | "saved">(
    "myRecipes"
  );

  // gets all of the user's posts
  const userPosts = posts.filter((post: any) => post.created_by === user._id);

  // check if current user is following this profile user
  const currentUserProfile = users.find((u: any) => u._id === loggedInUser?._id);
  const isFollowing = currentUserProfile?.following?.includes(user?._id);

  // check if this is the current user's own profile
  const isOwnProfile = loggedInUser && user._id === loggedInUser._id;

  // handle follow/unfollow action
  const handleFollowToggle = () => {
    if (isFollowing) {
      dispatch(
        unfollowUser({
          currentUserId: loggedInUser._id,
          targetUserId: user._id,
        })
      );
    } else {
      dispatch(
        followUser({
          currentUserId: loggedInUser._id,
          targetUserId: user._id,
        })
      );
    }
  };

  return (
    <div id="profile-screen" className="p-1">
      {/* profile picture */}
      <Row className="align-items-center profile-pic">
        <Col xs={3}>
          <Image
            src={user.profile}
            roundedCircle
            fluid
            alt={`${user.username} profile`}
            style={{ width: 160, objectFit: "cover" }}
          />
        </Col>

        {/* username, posts, followers, following, user's name */}
        <Col xs={12} sm={8} md={9} className="text-sm-start text-center ps-5">
          <Row className="align-items-center justify-content-between">
            <Col xs="auto">
              <div className="profile-username">{user.username}</div>
            </Col>
            <Col xs="auto">
              {!isOwnProfile && loggedInUser && (
                <Button
                  id={isFollowing ? "cancel-btn" : "save-btn"}
                  onClick={handleFollowToggle}
                  className="mb-4"
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </Col>
            <Col xs="auto">
              {loggedInUser && user._id === loggedInUser._id && (
                <Button
                  className="edit-button text-dark"
                  onClick={() =>
                    navigate(`/ReciPals/Account/Profile/${user._id}/Edit`)
                  }
                >
                  Edit Profile
                </Button>
              )}
            </Col>
          </Row>

          <div className="d-flex justify-content-sm-start justify-content-center profile-user-info">
            <div>
              <strong>{userPosts.length}</strong> posts
            </div>
            <div>
              <strong>{user.followers.length}</strong> followers
            </div>
            <div>
              <strong>{user.following.length}</strong> following
            </div>
          </div>
          <div className="profile-name">{user.name}</div>
        </Col>
      </Row>

      {/* bio and tags*/}
      <div className="profile-bio">{user.bio}</div>
      <div
        className="d-flex flex-wrap gap-2 mt-3"
        style={{ paddingLeft: "95px" }}
      >
        {user.tags.map((tag: string, index: number) => (
          <div key={index} className="btn profile-tags">
            {tag}
          </div>
        ))}
      </div>

      {/* tabs */}
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

      {/* posts */}
      <div className="mt-4">
        {activeTab === "myRecipes" && (
          <Row className="gx-1 gy-1" style={{ marginLeft: "95px" }}>
            {userPosts.map((post: any) => (
              <Col key={post.post_id} xs={12} sm={6} md={4} className="p-1">
                <div className="my-recipes text-center">
                  <Image
                    className="profile-post"
                    src={post.photo}
                    fluid
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate(
                        `/ReciPals/Account/Profile/${user._id}/Posts/${post.post_id}`
                      )
                    }
                  />
                </div>
              </Col>
            ))}
          </Row>
        )}
        {activeTab === "saved" && (
          <Row className="gx-1 gy-1" style={{ marginLeft: "95px" }}>
            {user.saved?.length > 0 ? (
              user.saved.map((savedPostId: string) => {
                const savedPost = posts.find(
                  (post: any) => post.post_id === savedPostId
                );
                return savedPost ? (
                  <Col
                    key={savedPost.post_id}
                    xs={12}
                    sm={6}
                    md={4}
                    className="p-1"
                  >
                    <div className="my-recipes text-center">
                      <Image
                        className="profile-post"
                        src={savedPost.photo}
                        fluid
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate(
                            `/ReciPals/Account/Profile/${user._id}/Posts/${savedPost.post_id}`
                          )
                        }
                      />
                    </div>
                  </Col>
                ) : null;
              })
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">No saved recipes yet</p>
              </div>
            )}
          </Row>
        )}
      </div>
    </div>
  );
}
