import { Table, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function RecipesTable({
  recipes = [],
  posts = [],
}: {
  recipes?: any[];
  posts?: any[];
}) {
  return (
    <div id="recipes-table">
      <Table striped style={{ fontSize: "12px" }}>
        <thead>
          <tr>
            <th style={{ width: "25%" }}>Name</th>
            <th>Creator Id</th>
            <th>Recipe Id</th>
            <th>Post Id</th>
            <th>Likes</th>
            <th>Comments</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe: any, _index: number) => {
            const matchingPost = posts.find(
              (post: any) => post.recipe_id === recipe.recipe_id
            );

            return (
              <tr key={recipe._id || recipe.recipe_id}>
                <td className="text-nowrap">
                  <Link
                    to={`/ReciPals/Account/Admin/Recipes/${recipe.recipe_id}`}
                    className="text-decoration-none text-dark"
                  >
                    <Image
                      src={recipe.photo}
                      fluid
                      alt={recipe.name}
                      style={{
                        width: 30,
                        height: 30,
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    <span>{recipe.name}</span>
                  </Link>
                </td>
                <td className="recipe-info align-middle ">
                  {recipe.user_created || matchingPost?.created_by || "N/A"}
                </td>
                <td className="recipe-info align-middle">{recipe.recipe_id}</td>
                <td className="recipe-info align-middle">
                  {matchingPost?.post_id || "N/A"}
                </td>
                <td className="recipe-info align-middle">
                  {matchingPost?.likes?.length || 0}
                </td>
                <td className="recipe-info align-middle">
                  {matchingPost?.comments?.length || 0}
                </td>
                <td className="recipe-info align-middle">
                  {matchingPost?.created_at || recipe.created_at || "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
