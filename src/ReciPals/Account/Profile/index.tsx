import { Image, Button } from "react-bootstrap";
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

  // loads posts, recipes, and users
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [allUsers, allPosts, allRecipes] = await Promise.all([
          client.getAllUsers(),
          postClient.getAllPosts(),
          recipeClient.getAllRecipes(),
        ]);

        dispatch(setUsers(allUsers));
        dispatch(setPosts(allPosts));
        dispatch(setRecipes(allRecipes));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadAllData();
  }, [uid, dispatch]);

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

  // Create invisible placeholder component
  const InvisiblePlaceholder = () => (
    <div className="my-recipes text-center">
      <div
        style={{
          width: "100%",
          aspectRatio: "1/1",
          opacity: 0,
          pointerEvents: "none",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );

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
    <div id="profile-screen" className="p-1" style={{ overflowX: "hidden" }}>
      <div
        style={{
          minWidth: "320px",
          maxWidth: "100%",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* profile picture */}
        <div
          className="align-items-center profile-pic"
          style={{
            paddingLeft: "clamp(20px, 4vw, 40px)",
            paddingTop: "0px",
            display: "flex",
            flexWrap: "wrap",
            gap: "60px",
          }}
        >
          <div style={{ flex: "0 0 auto" }}>
            <Image
              src={user.profile}
              roundedCircle
              fluid
              alt={`${user.username} profile`}
              style={{
                width: "clamp(120px, 15vw, 160px)",
                height: "clamp(120px, 15vw, 160px)",
                objectFit: "cover",
              }}
            />
          </div>

          {/* username, posts, followers, following, user's name */}
          <div
            className="text-sm-start text-center"
            style={{ flex: "1", minWidth: "20px" }}
          >
            <div
              style={{
                display: "flex",
                marginBottom: "10px",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <div
                className="align-items-center"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "40px",
                    minWidth: 0,
                  }}
                >
                  <div
                    className="profile-username"
                    style={{ wordWrap: "break-word" }}
                  >
                    {user.username}
                  </div>
                  {!isOwnProfile && loggedInUser && (
                    <Button
                      id={isFollowing ? "cancel-btn" : "save-btn"}
                      onClick={handleFollowToggle}
                      size="sm"
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {loggedInUser && user._id === loggedInUser._id && (
                    <Button
                      className="edit-button text-dark"
                      onClick={() =>
                        navigate(`/ReciPals/Account/Profile/${user._id}/Edit`)
                      }
                      size="sm"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div
              className="d-flex justify-content-sm-start justify-content-center profile-user-info"
              style={{ flexWrap: "wrap", gap: "15px" }}
            >
              <div>
                <strong>{userPosts.length}</strong> posts
              </div>
              <div>
                <strong>{user.followers.length}</strong>
                <Button
                  onClick={handleShowFollowers}
                  className="profile-follow"
                >
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
                <Button
                  onClick={handleShowFollowing}
                  className="profile-follow"
                >
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
          </div>
        </div>

        {/* bio and tags*/}
        <div
          className="profile-bio"
          style={{
            paddingLeft: "clamp(20px, 4vw, 55px)",
            paddingRight: "20px",
          }}
        >
          {user.bio}
        </div>
        <div
          className="d-flex flex-wrap gap-2 mt-3"
          style={{
            paddingLeft: "clamp(20px, 4vw, 55px)",
            paddingRight: "20px",
          }}
        >
          {user.tags.map((tag: string, index: number) => (
            <div key={index} className="btn profile-tags">
              {tag}
            </div>
          ))}
        </div>

        {/* tabs */}
        <div
          className="profile-recipes mt-4"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "60px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
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

        {/* posts */}
        <div
          className="mt-4"
          style={{
            paddingLeft: "clamp(20px, 4vw, 55px)",
            minHeight: "400px",
            paddingRight: "clamp(20px, 4vw, 50px)",
          }}
        >
          <div
            className="posts-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "15px",
              minHeight: "250px",
              width: "100%",
              maxWidth: "100%",
              minWidth: "300px",
            }}
          >
            {activeTab === "myRecipes" && (
              <>
                {userPosts.length > 0 ? (
                  userPosts.map((post: any) => (
                    <div key={post.post_id} className="my-recipes text-center">
                      <div
                        className="recipe-image-container"
                        onClick={() =>
                          navigate(
                            `/ReciPals/Account/Profile/${user._id}/Posts/${post.post_id}`
                          )
                        }
                        style={{
                          cursor: "pointer",
                          width: "100%",
                          aspectRatio: "1/1",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={post.photo}
                          className="recipe-image"
                          alt="Recipe"
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
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
                      width: "100%",
                    }}
                  >
                    <p className="text-muted">No recipes yet</p>
                  </div>
                )}
              </>
            )}

            {activeTab === "saved" && (
              <>
                {/* Add invisible placeholder if no saved recipes */}
                {savedRecipes.length === 0 && <InvisiblePlaceholder />}

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
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      width: "100%",
                      marginTop: "-200px",
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
    </div>
  );
}
