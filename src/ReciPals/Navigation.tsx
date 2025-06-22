import { ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineAddBox } from "react-icons/md";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setCurrentUser } from "./Account/reducer";
import axios from "axios";
import { BsInfoCircle } from "react-icons/bs";
const axiosWithCredentials = axios.create({
  withCredentials: true,
});

// represents the sidebar navigation with links to main sections (home, search, create, saved, profile) 
export default function ReciPalNavigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { pathname } = useLocation();

  // gets current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosWithCredentials.post("/api/users/profile");
        if (response.data) {
          dispatch(setCurrentUser(response.data));
        }
      } catch (error) {
        console.error("User not logged in or session expired");
      }
    };

    if (!currentUser) {
      fetchCurrentUser();
    }
  }, [currentUser, dispatch]);

  // generates new id and navigates to recipe editor to add recipe
  const handleNewRecipe = () => {
    if (currentUser) {
      const newId = uuidv4();
      navigate(`/ReciPals/Editor/${newId}`);
    } else {
      navigate("/ReciPals/Account/Login");
    }
  };

  return (
    <ListGroup
      variant="flush"
      className="recipals-navbar bottom-0 top-0 position-fixed d-none d-md-block"
    >
      <ListGroup.Item className="recipals-appname">ReciPals</ListGroup.Item>

      {/* Home link */}
      <ListGroup.Item
        key="Home"
        as={Link}
        to="/ReciPals/Home"
        className={`recipals-nav-link ${
          pathname.includes("Home") ? "text-bold" : ""
        }`}
      >
        <GoHomeFill size="35" className="fs-1 text-dark" />
        Home
      </ListGroup.Item>

      {/* Search link */}
      <ListGroup.Item
        key="Search"
        as={Link}
        to="/ReciPals/Search"
        className={`recipals-nav-link ${
          pathname.includes("Search") ? "text-bold" : ""
        }`}
      >
        <AiOutlineSearch size="35" className="fs-1 text-dark" />
        Search
      </ListGroup.Item>

      {/* Create button - positioned after Search */}
      <ListGroup.Item
        key="Create"
        as="div"
        onClick={handleNewRecipe}
        className={`recipals-nav-link ${
          pathname.includes("Create") ? "text-bold" : ""
        }`}
        style={{ cursor: "pointer" }}
      >
        <MdOutlineAddBox size="35" className="fs-1 text-dark" />
        Create
      </ListGroup.Item>

      {/* Saved link */}
      <ListGroup.Item
        key="Saved"
        as={Link}
        to="/ReciPals/Saved"
        className={`recipals-nav-link ${
          pathname.includes("Saved") ? "text-bold" : ""
        }`}
      >
        <MdOutlineBookmarkBorder size="35" className="fs-1 text-dark" />
        Saved
      </ListGroup.Item>

      {/* Profile link */}
      <ListGroup.Item
        key="Profile"
        as={Link}
        to={
          currentUser
            ? `/ReciPals/Account/Profile/${currentUser._id}`
            : "/ReciPals/Account/Login"
        }
        className={`recipals-nav-link ${
          pathname.includes("Profile") ? "text-bold" : ""
        }`}
      >
        <MdAccountCircle size="35" className="fs-1 text-dark" />
        Profile
      </ListGroup.Item>

      {/* Admin link */}
      {currentUser?.role === "ADMIN" && (
        <ListGroup.Item
          key="Admin"
          as={Link}
          to="/ReciPals/Account/Admin"
          className={`recipals-nav-link ${
            pathname.includes("Admin") ? "text-bold" : ""
          }`}
        >
          <MdAdminPanelSettings size="35" className="fs-1 text-dark" />
          Admin
        </ListGroup.Item>
      )}

      {/* Info link */}
      <ListGroup.Item
        key="ProjectInfo"
        as={Link}
        to="/ReciPals/Info"
        className={`recipals-nav-link ${
          pathname.includes("Info") ? "text-bold" : ""
        }`}
      >
        <BsInfoCircle size="35" className="fs-1 text-dark" />
        Info
      </ListGroup.Item>
    </ListGroup>
  );
}
