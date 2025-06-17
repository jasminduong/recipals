import { useEffect } from "react";
import { Col, Modal, Row, Image, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as client from "../client";
import { followUser, setUsers, unfollowUser } from "../userReducer";

export default function Following({
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

  // gets following
  const following = users.filter(
    (u: any) => user.following && user.following.includes(u._id)
  );

  // checks if this is the current user's own profile
  const isOwnProfile = loggedInUser && user._id === loggedInUser._id;

  // handles unfollowing a user (from own profile)
  // profile = current user
  const handleUnfollow = async (followedUser: any) => {
    const updatedUserFollowing = user.following.filter(
      (userId: string) => userId !== followedUser._id
    );

    const updatedFollowedUserFollowers = followedUser.followers.filter(
      (userId: string) => userId !== user._id
    );

    // unfollow current user 
    dispatch(
      unfollowUser({
        currentUserId: user._id,
        targetUserId: followedUser._id,
      })
    );

    await client.updateUser({
      ...user,
      following: updatedUserFollowing,
    });
    await client.updateUser({
      ...followedUser,
      followers: updatedFollowedUserFollowers,
    });
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
    const isCurrentlyFollowing = isFollowing(follower._id);

    const currentUserProfile = users.find(
      (u: any) => u._id === loggedInUser?._id
    );

    if (isCurrentlyFollowing) {
      // unfollow user
      dispatch(
        unfollowUser({
          currentUserId: loggedInUser._id,
          targetUserId: follower._id,
        })
      );

      const updatedTargetUserFollowers = follower.followers.filter(
        (userId: string) => userId !== loggedInUser._id
      );
      const updatedCurrentUserFollowing = currentUserProfile.following.filter(
        (userId: string) => userId !== follower._id
      );

      await client.updateUser({
        ...follower,
        followers: updatedTargetUserFollowers,
      });
      await client.updateUser({
        ...currentUserProfile,
        following: updatedCurrentUserFollowing,
      });
    } else {
      // follow user
      dispatch(
        followUser({
          currentUserId: loggedInUser._id,
          targetUserId: follower._id,
        })
      );

      const updatedTargetUserFollowers = [
        ...follower.followers,
        loggedInUser._id,
      ];
      const updatedCurrentUserFollowing = [
        ...currentUserProfile.following,
        follower._id,
      ];

      await client.updateUser({
        ...follower,
        followers: updatedTargetUserFollowers,
      });
      await client.updateUser({
        ...currentUserProfile,
        following: updatedCurrentUserFollowing,
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {following.map((followedUser: any) => (
            <div key={followedUser._id}>
              <Row className="ms-1 g-0 mb-3 align-items-center">
                <Col xs={2}>
                  <Image
                    src={followedUser.profile}
                    roundedCircle
                    fluid
                    alt={`${followedUser.username} profile`}
                    style={{ width: 60, objectFit: "cover", cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/ReciPals/Account/Profile/${followedUser._id}`);
                      handleClose();
                    }}
                  />
                </Col>
                <Col xs={8} className="ps-2 pt-2">
                  <div
                    className="fw-bold"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/ReciPals/Account/Profile/${followedUser._id}`);
                      handleClose();
                    }}
                  >
                    {followedUser.username}
                  </div>
                  <div
                    className="text-muted"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/ReciPals/Account/Profile/${followedUser._id}`);
                      handleClose();
                    }}
                  >
                    {followedUser.name}
                  </div>
                </Col>
                <Col xs={1} className="ps-0">
                  {loggedInUser && (
                    <Button
                      id={
                        isOwnProfile
                          ? "cancel-btn" // OWN profile = "remove" gray button
                          : // OTHER USER profile
                          (
                              followedUser._id === loggedInUser._id // is the follower in this list the CURRENT USER?
                                ? loggedInUser?.following?.includes(user._id) // TRUE (follower = current user) -> is the CURRENT USER following the PROFILE OWNER?
                                : isFollowing(followedUser._id)
                            )
                          ? // FALSE (follower = someone else) -> does the CURRENT USER follow this other follower?
                            "cancel-btn" // user following = "following" gray button
                          : "save-btn" // user not following = "follow" gold button
                      }
                      size="sm"
                      onClick={
                        () =>
                          isOwnProfile
                            ? handleUnfollow(followedUser) // remove as follower
                            : handleFollowToggle(followedUser) // toggle follow/unfollow
                      }
                    >
                      {
                        isOwnProfile
                          ? "Unfollow" // OWN profile = option to remove follower
                          : // OTHER USER profile
                          (
                              followedUser._id === loggedInUser._id // is the follower in this list the CURRENT USER?
                                ? loggedInUser?.following?.includes(user._id) // TRUE (follower = current user) -> is the CURRENT USER following the PROFILE OWNER?
                                : isFollowing(followedUser._id)
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
