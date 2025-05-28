import { Link } from "react-router-dom";
//import * as db from "../Database";

export default function CreatePost() {
  //const { rid } = useParams();
  //const recipes = db.recipes;

  //const recipeToEdit = recipes.find((recipe) => recipe._id === rid);

  return (
    <div>
      <h1>Create Post</h1>
        <Link to="/ReciPals/Recipes/Editor/recipe_bot-R1">
          Edit Post UI
        </Link>
    </div>
  );
}
