import { Navigate, Route, Routes } from "react-router-dom";
import ReciPalNavigation from "./Navigation";
import Home from "./Home";
import Search from "./Search";
import CreatePost from "./Create";
import SavedRecipes from "./Saved";
import Login from "./Account/Login";
import Signup from "./Account/Signup";
import Profile from "./Account/Profile";
import SignupTags from "./Account/SignupTags";

export default function ReciPals() {
  return (
    <div id="wd-recipals">
      <ReciPalNavigation />
      <div className="wd-main-content-offset p-3">
        <Routes>
          <Route path="/" element={<Navigate to="/ReciPals/Home" />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Create" element={<CreatePost />} />
          <Route path="/Saved" element={<SavedRecipes />} />
          <Route path="/Account/Login" element={<Login />} />
          <Route path="/Account/Signup" element={<Signup />} />
          <Route path="/Account/SignupTags" element={<SignupTags />} />
          <Route path="/Account/Profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}
