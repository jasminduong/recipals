import { Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser} from "./reducer";
import * as client from "./client";

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

  // gets new user name, username, password
  const signupData = useSelector((state: any) => state.accountReducer.newUser);

  useEffect(() => {
    if (
      !signupData ||
      !signupData.name ||
      !signupData.username ||
      !signupData.password
    ) {
      console.log("Missing signup data:", signupData);
      navigate("/ReciPals/Account/Signup");
    }
  }, [signupData, navigate]);

  if (!signupData) {
    return <div>Loading...</div>;
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  // event handler to create new user after setting tags
  const handleSignup = async () => {
    const newUser = {
      name: signupData.name,
      username: signupData.username,
      password: signupData.password,
      bio: "",
      role: "USER",
      tags: selectedTags,
      profile: "/images/profile.png",
      posts: [],
      saved: [],
      followers: [],
      following: [],
    };

    const createdUser = await client.signup(newUser);

    dispatch(setCurrentUser(createdUser));

    navigate(`/ReciPals/Account/Profile/${createdUser._id}`);
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
