import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Signup from "./Signup";

export default function Account() {
  <Routes>
    <Route path="/" element={<Navigate to="/ReciPals/Account/Login" />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/Profile" element={<Profile />} />
    <Route path="/Signup" element={<Signup />} />
  </Routes>;
}
