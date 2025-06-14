import { Navigate, Route, Routes } from "react-router-dom";
import ReciPalNavigation from "./Navigation";
import Home from "./Home";
import Search from "./Search";
import SavedRecipes from "./Saved";
import Account from "./Account";
import RecipeEditor from "./Recipes/Editor";
import Details from "./Recipes/Details";

export default function ReciPals() {
  return (
    <div id="wd-recipals">R
      <ReciPalNavigation />
      <div className="wd-main-content-offset p-3">
        <Routes>
          <Route path="/" element={<Navigate to="/ReciPals/Home" />} />
          <Route path="Home" element={<Home />} />
          <Route path="Search" element={<Search />} />
          <Route path="Home/:rid" element={<Details />} />
          <Route path="Editor/:rid" element={<RecipeEditor />} />
          <Route path="Saved" element={<SavedRecipes />} />
          <Route path="Account/*" element={<Account />} />
        </Routes>
      </div>
    </div>
  );
}
