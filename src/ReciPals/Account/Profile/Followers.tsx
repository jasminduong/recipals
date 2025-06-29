import { useEffect } from "react";
import { Col, Modal, Row, Image, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as client from "../client";
import { followUser, setUsers, unfollowUser } from "../userReducer";
import { setCurrentUser } from "../reducer";

// represents a modal that displays followers of the user
export default function Followers({
  show,
  handleClose,
  dialogTitle,
}: {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string;
}) {
  const { uid } = useParams<{ uid: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state: any) => state.userReducer.users);

  const { currentUser: loggedInUser } = useSelector(
    (state: any) => state.accountReducer
  );

  const user = users.find((u: any) => u._id === uid) ?? loggedInUser;

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

  // gets the followers
  const followers = users.filter(
    (u: any) => user.followers && user.followers.includes(u._id)
  );

  // checks if this is the current user's own profile
  const isOwnProfile = loggedInUser && user._id === loggedInUser._id;

  // handles removing a follower (from own profile)
  // profile = current user
  const handleRemoveFollower = async (follower: any) => {
    try {
      dispatch(
        unfollowUser({
          currentUserId: follower._id,
          targetUserId: user._id,
        })
      );

      const updatedUserFollowers = user.followers.filter(
        (userId: string) => userId !== follower._id
      );

      if (user._id === loggedInUser._id) {
        await client.updateUser({
          _id: user._id,
          followers: updatedUserFollowers,
        });
      }

      const allUsers = await client.getAllUsers();
      dispatch(setUsers(allUsers));

      const updatedCurrentUser = await client.profile();
      dispatch(setCurrentUser(updatedCurrentUser));
    } catch (error) {
      console.error("Error in remove follower operation:", error);
      const allUsers = await client.getAllUsers();
      dispatch(setUsers(allUsers));
    }
  };

  // checks if current user is following a specific follower
  // profile = NOT current user
  const isFollowing = (followerId: string) => {
    const currentUserProfile = users.find(
      (u: any) => u._id === loggedInUser?._id
    );
    return currentUserProfile?.following?.includes(followerId);
  };

  // handles follow/unfollow action (from other users' profiles)
  // profile = NOT current user
  const handleFollowToggle = async (follower: any) => {
    try {
      const isCurrentlyFollowing = isFollowing(follower._id);

      if (isCurrentlyFollowing) {
        dispatch(
          unfollowUser({
            currentUserId: loggedInUser._id,
            targetUserId: follower._id,
          })
        );

        await client.unfollowUser(follower._id);
      } else {
        dispatch(
          followUser({
            currentUserId: loggedInUser._id,
            targetUserId: follower._id,
          })
        );

        await client.followUser(follower._id);
      }

      const allUsers = await client.getAllUsers();
      dispatch(setUsers(allUsers));

      const updatedCurrentUser = await client.profile();
      dispatch(setCurrentUser(updatedCurrentUser));
    } catch (error) {
      console.error("Error in follow/unfollow operation:", error);
      const allUsers = await client.getAllUsers();
      dispatch(setUsers(allUsers));
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {followers.map((follower: any) => (
            <div key={follower._id}>
              <Row className="ms-1 g-0 mb-3 align-items-center">
                <Col xs={2}>
                  <Image
                    src={follower.profile}
                    roundedCircle
                    alt={`${follower.username} profile`}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      aspectRatio: "1 / 1",
                    }}
                    onClick={() => {
                      navigate(`/ReciPals/Account/Profile/${follower._id}`);
                      handleClose();
                    }}
                  />
                </Col>
                <Col xs={8} className="ps-2 pt-2">
                  <div
                    className="fw-bold"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/ReciPals/Account/Profile/${follower._id}`);
                      handleClose();
                    }}
                  >
                    {follower.username}
                  </div>
                  <div
                    className="text-muted"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/ReciPals/Account/Profile/${follower._id}`);
                      handleClose();
                    }}
                  >
                    {follower.name}
                  </div>
                </Col>
                <Col xs={1} className="ps-0">
                  {loggedInUser && follower._id !== loggedInUser._id && (
                    <Button
                      id={
                        isOwnProfile
                          ? "cancel-btn" // OWN profile = "remove" gray button
                          : // OTHER USER profile
                          (
                              follower._id === loggedInUser._id // is the follower in this list the CURRENT USER?
                                ? loggedInUser?.following?.includes(user._id) // TRUE (follower = current user) -> is the CURRENT USER following the PROFILE OWNER?
                                : isFollowing(follower._id)
                            )
                          ? // FALSE (follower = someone else) -> does the CURRENT USER follow this other follower?
                            "cancel-btn" // user following = "following" gray button
                          : "save-btn" // user not following = "follow" gold button
                      }
                      size="sm"
                      onClick={
                        () =>
                          isOwnProfile
                            ? handleRemoveFollower(follower) // remove as follower
                            : handleFollowToggle(follower) // toggle follow/unfollow
                      }
                    >
                      {
                        isOwnProfile
                          ? "Remove" // OWN profile = option to remove follower
                          : // OTHER USER profile
                          (
                              follower._id === loggedInUser._id // is the follower in this list the CURRENT USER?
                                ? loggedInUser?.following?.includes(user._id) // TRUE (follower = current user) -> is the CURRENT USER following the PROFILE OWNER?
                                : isFollowing(follower._id)
                            )
                          ? // FALSE (follower = someone else) -> does the CURRENT USER follow this other person?
                            "Following" // already following
                          : "Follow" // option to follow user
                      }
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}
