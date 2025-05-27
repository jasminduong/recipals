import { Navigate, Route, Routes } from "react-router-dom";
import ReciPalNavigation from "./Navigation";
import Home from "./Home";
import Search from "./Search";
import CreatePost from "./Create";
import SavedRecipes from "./Saved";
import Account from "./Account";

export default function ReciPals() {
  return (
    <div id="wd-recipals">
      <ReciPalNavigation />
      <div className="wd-main-content-offset p-3">
        <Routes>
          <Route path="/" element={<Navigate to="/ReciPals/Home" />} />
          <Route path="Home" element={<Home />} />
          <Route path="Search" element={<Search />} />
          <Route path="Create" element={<CreatePost />} />
          <Route path="Saved" element={<SavedRecipes />} />
          <Route path="Account/*" element={<Account />} />
        </Routes>
      </div>
    </div>
  );
}
