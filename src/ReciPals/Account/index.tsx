import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Signup from "./Signup";
import SignupTags from "./SignupTags";
import { useSelector } from "react-redux";
import ProfileEditor from "./Profile/Editor";
import UserPosts from "../Recipes/UserPosts";

export default function Account() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={
              currentUser // if currentUser is not empty, clicking profile
                ? `/ReciPals/Account/Profile/${currentUser._id}` // navigate to profile
                : "/ReciPals/Account/Login" // otherwise, navigate to login
            }
          />
        }
      />
      <Route path="Login" element={<Login />} />
      <Route path="Profile/:uid" element={<Profile />} />
      <Route path="Profile/:uid/Edit" element={<ProfileEditor />} />
      <Route path="Profile/:uid/Posts/:pid" element={<UserPosts />} />
      <Route path="Signup" element={<Signup />} />
      <Route path="SignupTags" element={<SignupTags />} />
    </Routes>
  );
}
