import { useEffect } from "react";
import { Col, Modal, Row, Image, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as client from "../Account/client";
import { followUser, setUsers, unfollowUser } from "../Account/userReducer";

export default function LikesModal({
  show,
  handleClose,
  post,
}: {
  show: boolean;
  handleClose: () => void;
  post: {
    post_id: string;
    likes: string[];
  };
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state: any) => state.userReducer.users);
  const { currentUser: loggedInUser } = useSelector(
    (state: any) => state.accountReducer
  );

  // load users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await client.getAllUsers();
        dispatch(setUsers(allUsers));
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    if (users.length === 0) {
      loadUsers();
    }
  }, [users.length, dispatch]);

  // get users who liked this post
  const usersWhoLiked = users.filter((user: any) =>
    post.likes.includes(user._id)
  );

  // check if current user is following a specific user
  const isFollowing = (userId: string) => {
    return loggedInUser?.following?.includes(userId);
  };

  // event handler for follow/unfollow action
  const handleFollowToggle = async (targetUser: any) => {
    if (!loggedInUser) return;

    const isCurrentlyFollowing = isFollowing(targetUser._id);
    const currentUserProfile = users.find(
      (u: any) => u._id === loggedInUser._id
    );

    if (isCurrentlyFollowing) {
      dispatch(
        unfollowUser({
          currentUserId: loggedInUser._id,
          targetUserId: targetUser._id,
        })
      );

      const updatedTargetUserFollowers = targetUser.followers.filter(
        (userId: string) => userId !== loggedInUser._id
      );
      const updatedCurrentUserFollowing = currentUserProfile.following.filter(
        (userId: string) => userId !== targetUser._id
      );

      const updatedTargetUser = await client.updateUser({
        ...targetUser,
        followers: updatedTargetUserFollowers,
      });
      const updatedCurrentUser = await client.updateUser({
        ...currentUserProfile,
        following: updatedCurrentUserFollowing,
      });

      const updatedUsers = users.map((user: any) => {
        if (user._id === targetUser._id) {
          return updatedTargetUser;
        }
        if (user._id === loggedInUser._id) {
          return updatedCurrentUser;
        }
        return user;
      });
      dispatch(setUsers(updatedUsers));

    } else {
      dispatch(
        followUser({
          currentUserId: loggedInUser._id,
          targetUserId: targetUser._id,
        })
      );

      const updatedTargetUserFollowers = [
        ...targetUser.followers,
        loggedInUser._id,
      ];
      const updatedCurrentUserFollowing = [
        ...currentUserProfile.following,
        targetUser._id,
      ];

      const updatedTargetUser = await client.updateUser({
        ...targetUser,
        followers: updatedTargetUserFollowers,
      });
      const updatedCurrentUser = await client.updateUser({
        ...currentUserProfile,
        following: updatedCurrentUserFollowing,
      });

      const updatedUsers = users.map((user: any) => {
        if (user._id === targetUser._id) {
          return updatedTargetUser;
        }
        if (user._id === loggedInUser._id) {
          return updatedCurrentUser;
        }
        return user;
      });
      dispatch(setUsers(updatedUsers));
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/ReciPals/Account/Profile/${userId}`);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>Likes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {usersWhoLiked.length === 0 ? (
            <div className="text-center text-muted py-4">No likes yet</div>
          ) : (
            usersWhoLiked.map((user: any) => (
              <div key={user._id}>
                <Row className="ms-1 g-0 mb-3 align-items-center">
                  <Col xs={2}>
                    <Image
                      src={user.profile}
                      roundedCircle
                      fluid
                      alt={`${user.username} profile`}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => handleUserClick(user._id)}
                    />
                  </Col>
                  <Col xs={8} className="ps-2 pt-2">
                    <div
                      className="fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleUserClick(user._id)}
                    >
                      {user.username}
                    </div>
                    <div
                      className="text-muted"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleUserClick(user._id)}
                    >
                      {user.name}
                    </div>
                  </Col>
                  <Col xs={1} className="ps-0">
                    {loggedInUser && user._id !== loggedInUser._id && (
                      <Button
                        id={isFollowing(user._id) ? "cancel-btn" : "save-btn"}
                        size="sm"
                        onClick={() => handleFollowToggle(user)}
                      >
                        {isFollowing(user._id) ? "Following" : "Follow"}
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
            ))
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
