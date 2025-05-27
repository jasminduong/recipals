import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";

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

  return (
    <div id="signup-screen">
      <Card>
        <h4 id="signup-title">Who Are You :D</h4>
        <p id="signup-caption">Choose up to 3 tags to describe yourself!</p>
        {/* for each section in section array, displays section title */}
        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            <h6>{section.title}</h6>
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
        <Link
          id="signup-btn"
          to="/ReciPals/Account/Profile/123"
          className="btn w-100 mb-2"
        >
          Signup{" "}
        </Link>
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
