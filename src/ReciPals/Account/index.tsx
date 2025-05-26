import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Signup from "./Signup";
import SignupTags from "./SignupTags";

export default function Account() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="ReciPals/Account/Login" />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Profile/:cid" element={<Profile />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/SignupTags" element={<SignupTags />} />
    </Routes>
  );
}
