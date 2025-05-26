import { ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineAddBox } from "react-icons/md";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import "./styles.css";

/* ReciPal Sidebar navigation with links to main sections (home, search, create, saved, profile) */
export default function ReciPalNavigation() {
  {
    /* gets the location object that represents the current URL path */
  }
  const { pathname } = useLocation();
  const links = [
    { label: "Home", path: "/ReciPals/Home", icon: GoHomeFill },
    { label: "Search", path: "/ReciPals/Search", icon: AiOutlineSearch },
    { label: "Create", path: "/ReciPals/Create", icon: MdOutlineAddBox },
    { label: "Saved", path: "/ReciPals/Saved", icon: MdOutlineBookmarkBorder },
    {
      label: "Profile",
      path: "/ReciPals/Account/Login",
      icon: MdAccountCircle,
    },
  ];
  return (
    <ListGroup
      variant="flush"
      className="recipals-navbar bottom-0 top-0"
    >
      <ListGroup.Item className="recipals-appname">ReciPals</ListGroup.Item>
      {links.map((link) => (
        <ListGroup.Item
          key={link.path}
          as={Link}
          to={link.path}
          className={`recipals-nav-link
                ${pathname.includes(link.label) ? "text-bold" : ""}`}
        >
          {link.icon({ size: "35", className: "fs-1 text-dark" })}
          {link.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
