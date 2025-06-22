import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProjectInfo() {
  return (
    <Container>
        <h5><b>Creators:</b></h5> Jasmin Duong <br/> Daniel Jacob
        <br/><br/>
        <h5><b>Github Repo Links:</b></h5> 
        <Link to="https://github.com/jasminduong/recipals" 
              className="link-primary text-decoration-none"
              target="_blank"
              rel="noopener noreferrer">
            React Web App
        </Link>
        <br/>
        <Link to="https://github.com/jasminduong/recipals-node-server-app" 
              className="link-primary text-decoration-none"
              target="_blank"
              rel="noopener noreferrer">
            Node.js Server
        </Link>
    </Container>
  );
}