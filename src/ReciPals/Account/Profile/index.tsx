import { Row, Col, Image, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { followUser, setUsers, unfollowUser } from "../userReducer";
import { setPosts } from "../../Posts/postReducer";
import { setRecipes } from "../../Recipes/recipeReducer";
import * as client from "../client";
import * as postClient from "../../Posts/postClient";
import * as recipeClient from "../../Recipes/recipeClient";
import Followers from "./Followers";
import Following from "./Following";

export default function Profile() {
  const { uid } = useParams<{ uid: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state: any) => state.userReducer.users);
  const posts = useSelector((state: any) => state.postReducer.posts);
  const recipes = useSelector((state: any) => state.recipeReducer.recipes);

  // loads users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await client.getAllUsers();
        dispatch(setUsers(allUsers));
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    loadUsers();
  }, [users.length, dispatch]);

  // loads posts
  useEffect(() => {
    if (posts.length === 0) {
      const loadPosts = async () => {
        try {
          console.log("Loading posts...");
          const allPosts = await postClient.getAllPosts();
          dispatch(setPosts(allPosts));
        } catch (error) {
          console.error("Error loading posts:", error);
        }
      };
      loadPosts();
    }
  }, [dispatch, uid, posts.length]);

  // loads recipes
  useEffect(() => {
    if (recipes.length === 0) {
      const loadRecipes = async () => {
        try {
          const allRecipes = await recipeClient.getAllRecipes();
          dispatch(setRecipes(allRecipes));
        } catch (error) {
          console.error("Error loading recipes:", error);
        }
      };
      loadRecipes();
    }
  }, [dispatch, recipes.length]);

  // finds current logged in user
  const { currentUser: loggedInUser } = useSelector(
    (state: any) => state.accountReducer
  );
  const user =
    users.length > 0
      ? users.find((u: any) => u._id === uid) ?? loggedInUser
      : loggedInUser;

  // useEffect redirects user to login page if not signed in
  useEffect(() => {
    if (!loggedInUser) navigate("/ReciPals/Account/Login");
  }, [loggedInUser]);

  // initializes state variable activeTab to my recipes and mutator function setActiveTab
  const [activeTab, setActiveTab] = useState<"myRecipes" | "saved">(
    "myRecipes"
  );

  // gets all of the user's posts
  const userPosts = posts
    .filter((post: any) => post.created_by === user._id)
    .reverse();

  // get user's saved recipes for the saved tab
  const savedRecipeIds = user?.saved_recipes || [];
  const savedRecipes = recipes.filter((recipe: any) => 
    savedRecipeIds.includes(recipe.recipe_id)
  );

  // check if current user is following this profile user
  const currentUserProfile = users.find(
    (u: any) => u._id === loggedInUser?._id
  );
  const isFollowing = currentUserProfile?.following?.includes(user?._id);

  // check if this is the current user's own profile
  const isOwnProfile = loggedInUser && user._id === loggedInUser._id;

  // handles follow/unfollow action
  const handleFollowToggle = async () => {
    if (isFollowing) {
      dispatch(
        unfollowUser({
          currentUserId: loggedInUser._id,
          targetUserId: user._id,
        })
      );

      const updatedTargetUserFollowers = user.followers.filter(
        (userId: string) => userId !== loggedInUser._id
      );
      const updatedCurrentUserFollowing = loggedInUser.following.filter(
        (userId: string) => userId !== user._id
      );

      await client.updateUser({
        ...user,
        followers: updatedTargetUserFollowers,
      });
      await client.updateUser({
        ...loggedInUser,
        following: updatedCurrentUserFollowing,
      });
    } else {
      dispatch(
        followUser({
          currentUserId: loggedInUser._id,
          targetUserId: user._id,
        })
      );

      const updatedTargetUserFollowers = [...user.followers, loggedInUser._id];
      const updatedCurrentUserFollowing = [...loggedInUser.following, user._id];

      await client.updateUser({
        ...user,
        followers: updatedTargetUserFollowers,
      });
      await client.updateUser({
        ...loggedInUser,
        following: updatedCurrentUserFollowing,
      });
    }
  };

  // handlers for showing followers
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const handleCloseFollowers = () => setShowFollowers(false);
  const handleShowFollowers = () => setShowFollowers(true);
  const handleCloseFollowing = () => setShowFollowing(false);
  const handleShowFollowing = () => setShowFollowing(true);

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
              <strong>{user.followers.length}</strong>
              <Button onClick={handleShowFollowers} className="profile-follow">
                followers
              </Button>
              <Followers
                show={showFollowers}
                handleClose={handleCloseFollowers}
                dialogTitle="Followers"
              />
            </div>
            <div>
              <strong>{user.following.length}</strong>
              <Button onClick={handleShowFollowing} className="profile-follow">
                following
              </Button>
              <Following
                show={showFollowing}
                handleClose={handleCloseFollowing}
                dialogTitle="Following"
              />
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
      <div
        className="mt-4"
        style={{
          marginLeft: "95px",
          minHeight: "400px",
          width: "calc(100% - 95px)", // Fixed width to prevent layout shifts
        }}
      >
        <div
          className="posts-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px",
            minHeight: "250px",
          }}
        >
          {activeTab === "myRecipes" && (
            <>
              {userPosts.length > 0 ? (
                userPosts.map((post: any) => (
                  <div key={post.post_id} className="my-recipes text-center">
                    <Image
                      className="profile-post"
                      src={post.photo}
                      fluid
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        aspectRatio: "1/1",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate(
                          `/ReciPals/Account/Profile/${user._id}/Posts/${post.post_id}`
                        )
                      }
                    />
                  </div>
                ))
              ) : (
                <div
                  className="text-center"
                  style={{
                    gridColumn: "1 / -1",
                    height: "250px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p className="text-muted">No recipes yet</p>
                </div>
              )}
            </>
          )}

          {activeTab === "saved" && (
            <>
              {savedRecipes.length > 0 ? (
                savedRecipes.map((recipe: any) => {
                  // Find the corresponding post for this recipe
                  const correspondingPost = posts.find(
                    (post: any) => post.recipe_id === recipe.recipe_id
                  );
                  
                  return (
                    <div
                      key={recipe.recipe_id}
                      className="my-recipes text-center"
                    >
                      <Image
                        className="profile-post"
                        src={recipe.photo}
                        fluid
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          aspectRatio: "1/1",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          // If there's a corresponding post, go to post page first
                          if (correspondingPost) {
                            navigate(
                              `/ReciPals/Account/Profile/${user._id}/Posts/${correspondingPost.post_id}`
                            );
                          } else {
                            // If no post, go directly to recipe details
                            navigate(`/ReciPals/Recipes/${recipe.recipe_id}`);
                          }
                        }}
                      />
                    </div>
                  );
                })
              ) : (
                <div
                  className="text-center"
                  style={{
                    gridColumn: "1 / -1",
                    height: "250px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p className="text-muted">No saved recipes yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}