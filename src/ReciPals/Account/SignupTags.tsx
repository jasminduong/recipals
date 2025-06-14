import { Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { setCurrentUser, clearSignupData } from "./reducer";
import * as db from "../Database";
import { v4 as uuidv4 } from "uuid";
import { setUsers } from "./userReducer";

// defines each section of tags
const sections = [
  {
    title: "Skill Level / Role",
    tags: [
      "Home Cook",
      "Student Chef",
      "Baker",
      "Beginner",
      "Professional Chef",
      "Food Critic",
    ],
  },
  {
    title: "Cultural Cuisine Interest",
    tags: [
      "Asian Food Lover",
      "Italian Cuisine",
      "Latin Flavors",
      "Fusion Explorer",
      "Indian Spices",
      "Soul Food Fan",
      "Middle Eastern Eats",
    ],
  },
  {
    title: "Dietary Preferences / Cooking Values",
    tags: [
      "Vegetarian",
      "Vegan",
      "Gluten-Free",
      "Halal",
      "Kosher",
      "Dairy-Free",
      "Sustainable",
    ],
  },
];

export default function SignupTags() {
  // initializes a state variable selectedTags as an array of strings, to store the tags the user selects
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users } = useSelector((state: any) => state.userReducer);
  
  useEffect(() => {
    if (users.length === 0) {
      dispatch(setUsers(db.users));
    }
  }, [dispatch, users.length]);

  // gets new user name, username, password
  //const signupData = useSelector((state: any) => state.account?.newUser);

  // get data from localStorage temporary use
  const signupData = JSON.parse(localStorage.getItem('signupData') || 'null');

  useEffect(() => {
    if (!signupData) {
      navigate("/ReciPals/Account/Signup");
    }
  }, [signupData, navigate]);

  if (!signupData) {
    return <div>Loading...</div>;
  }

  const toggleTag = (tag: string) => {
    // toggleTag(tag) is called when a tag is clicked
    if (selectedTags.includes(tag)) {
      // if the tag is already selected, remove it
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else if (selectedTags.length < 3) {
      // if the tag is not selected and fewer than 3 are selected, add it
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  // event handler to create new user after setting tags
  const handleSignup = () => {
    if (!signupData || !signupData.name) {
      console.error("No signup data available");
      alert("Signup data is missing. Please go back and fill out the form again.");
      navigate("/ReciPals/Account/Signup");
      return;
    }
    const newUser = {
      _id: uuidv4(),
      name: signupData.name,
      username: signupData.username,
      password: signupData.password,
      bio: "",
      tags: selectedTags,
      profile: "/images/profile.png",
      posts: [],
      saved: [],
      followers: [],
      following: [],
    };

    dispatch(setUsers([...users, newUser]));

    dispatch(setCurrentUser(newUser));

    dispatch(clearSignupData());

    navigate(`/ReciPals/Account/Profile/${newUser._id}`);
  };

  return (
    <div id="signup-screen">
      <Card>
        <h4 id="signup-title">Who Are You :D</h4>
        <p id="signup-caption">Choose up to 3 tags to describe yourself!</p>
        {/* for each section in section array, displays section title */}
        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            <h6 className="mb-3 mt-2">{section.title}</h6>
            <div className="d-flex flex-wrap gap-2">
              {/* for each tag in each section, if selected, displays blue tag, otherwise displays white */}
              {/* on click, calls toggleTag function */}
              {section.tags.map((tag) => (
                <Button
                  key={tag}
                  className={`profile-tag ${
                    selectedTags.includes(tag) ? "selected" : "not-selected"
                  }`}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        ))}
        <Button
          id="signup-btn"
          onClick={handleSignup}
          className="btn w-100 mb-2"
        >
          Signup{" "}
        </Button>
        <Link
          id="signin-link"
          to="/ReciPals/Account/Login"
          className="btn w-100 mb-2"
        >
          Login
        </Link>
      </Card>
    </div>
  );
}
