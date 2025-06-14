import { FaRegHeart } from "react-icons/fa";
import { GoComment } from "react-icons/go";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import * as db from "../Database";
import { Link, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function UserPosts() {
  const { id } = useParams();
  const { pid } = useParams();
  const posts = db.posts;
  const users = db.users;
  const currUser = users.find((user) => user._id === id);
  const currPost = posts.find((post) => post.post_id === pid);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        paddingLeft: "inherit",
      }}
    >
      {currUser && currPost ? (
        <div className="d-flex justify-content-between align-items-center">
          <Link
            to={`/ReciPals/Profile/${id}/${pid}/${currPost.recipe_id}`}
            className="text-decoration-none"
          >
            <div className="recipe-post" style={{ position: "relative" }}>
              <BiChevronLeft size={48} className="left-chevron" />

              <BiChevronRight size={48} className="right-chevron" />
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <img
                    src={currUser.profile}
                    alt="Profile picture"
                    className="rounded-circle"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <span className="ms-3 text-dark">{currPost.created_by}</span>
                </div>
                <Button id="cancel-btn" size="sm">
                  Edit Post
                </Button>
              </div>

              <div className="d-flex justify-content-center align-items-center mb-3">
                <div className="post-image overflow-hidden">
                  <img
                    src={currPost.photo}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              </div>

              <div className="d-flex gap-4 mb-2">
                <div className="d-flex align-items-center gap-1 post-icons">
                  <FaRegHeart size={18} />
                  <span>{currPost.likes}</span>
                </div>
                <div className="d-flex align-items-center gap-1 post-icons">
                  <GoComment size={18} />
                  <span>{currPost.comments.length}</span>
                </div>
              </div>

              <div className="post-caption text-dark">
                <span className="fw-semibold">recipe_bot</span>{" "}
                <span>{currPost.caption}</span>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="text-center py-5">
          <p className="text-danger fs-4">Post not found.</p>
        </div>
      )}
    </div>
  );
}
