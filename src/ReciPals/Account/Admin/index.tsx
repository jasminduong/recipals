import { Navigate, Route, Routes } from "react-router-dom";
import AdminNavigation from "./Navigation";
import AllUsers from "./Users";
import AllRecipes from "./Recipes";

export default function Admin() {
  return (
    <div className="d-flex">
      <AdminNavigation />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="Users" />} />
          <Route path="Users" element={<AllUsers />} />
          <Route path="Users/:uid" element={<AllUsers />} />
          <Route path="Recipes" element={<AllRecipes />} />
        </Routes>
      </div>
    </div>
  );
}
