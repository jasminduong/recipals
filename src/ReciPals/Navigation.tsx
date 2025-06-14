import { ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineAddBox } from "react-icons/md";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import "./styles.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

/* ReciPal Sidebar navigation with links to main sections (home, search, create, saved, profile) */
export default function ReciPalNavigation() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { pathname } = useLocation();

  // generates new id and navigates to assignment editor to add assignment
  const handleNewRecipe = () => {
    const newId = uuidv4();
    navigate(`/ReciPals/Editor/${newId}`);
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
    </ListGroup>
  );
}
