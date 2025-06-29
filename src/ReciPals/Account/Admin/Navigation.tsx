import { ListGroup } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";

// represents the admin navigation between users and recipes
export default function AdminNavigation() {
  const location = useLocation();
  const isActive = (pathPrefix: string) =>
    location.pathname.startsWith(pathPrefix);

  const links = ["Users", "Recipes"];

  return (
    <ListGroup
      id="admin-navigation"
      style={{ width: 120 }}
      className="wd list-group fs-6 rounded-0 me-4"
    >
      {links.map((link) => (
        <ListGroup.Item
          key={link}
          to={`/ReciPals/Account/Admin/${link}`}
          as={Link}
          className={`list-group-item border-0 ${
            isActive(`/ReciPals/Account/Admin/${link}`)
              ? "admin-active-tab text-black"
              : "admin-inactive-tab"
          }`}
        >
          {link}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
