OVERVIEW: ReciPals is a social recipe-sharing web application where users can share, discover, and save recipes. The application is pre-loaded with 300+ recipes fetched from TheMealDB API (https://www.themealdb.com/) attributed to "recipeBot" to provide immediate content for users to explore.

CORE FEATURES:
- Home
  - Loads recipe post feed (login not required)
  - Loads followers’ posts first (login required) 
- Login and Signup
  - Login with username and password
  - Signup required information include name, username, password, and tags 
-  Profile
  - Display and edit profile information
  - Display user posts and saved recipes 
  - Follow and unfollow users (login required) 
- Search 
  - Search recipes by name, ingredient, tags (login not required)
  - Search users by name and username (login not required)
- Recipe and Post 
  - Create and edit recipes (login required) 
  - View complete recipe details, including name, photo, ingredients, instructions, total time, and serving (login not required)
  - Interact with posts: like and comment (login required)
  - Save recipes (login required) 
- Admin Management
  - Admin user type required
  - Update user role types and delete users
  - Edit and delete recipes and posts 

This codebase provides the front-end implementation of ReciPals built with React and TypeScript. See repository for the back-end implementation with Node.js and Express: https://github.com/jasminduong/recipals-node-server-app 

RUNNING THE APP: 
To run the app on the server: https://recipals.netlify.app/ 

To run the react app (front-end) locally: 
1) Clone the repository, run on your terminal:
  git clone https://github.com/jasminduong/recipals.git
  cd recipals-react-web-app
2) Install dependencies
  npm install
3) Create an .env file with required variables:
  VITE_REMOTE_SERVER=http://localhost:4000
4) Start the development server, run on your terminal:
  npm run dev
5) Open your browser and navigate to http://localhost:5173 (or the port shown in your terminal)

**The backend server is required for full functionality. See the Node.js server repository for setup instructions: https://github.com/jasminduong/recipals-node-server-app

KEY COMPONENTS:
- Account Management: Handles user authentication, profile management, and admin functionalities
  - Authentication System: Manages user login, signup, and session handling
  - Login and signup components with form validation for user login and signup
  - Protected routes for authenticated users
  - Session management and user state for multiple user sessions
  - Profile components: Manages user profiles, profile editing, and followers/following system

- Admin Components: Manages user and recipe oversight

- Recipe Management: Core functionality for creating, viewing, and managing recipes
  - Recipe details component for viewing recipes
  - Recipe editor component for creating and editing recipes
  - All recipe table component for admin functionalities  

- Post Management: Core social engagement functionality for interacting and sharing recipes
  - Post feed on landing page 
  - Post carousel on user profile for displaying recipes

- Search: Manages search functionality for finding recipes and users 

- Navigation: Provides routing and navigation for core app functionalities

KEY SUB-COMPONENTS:
- Client Components: TypeScript files that handle client-side logic and API interactions
  - client.ts: Main API client configuration that integrates with the user routes implemented in the server
    -  Handles user authentication (signin/signup/signout), profile management, user search and retrieval, user CRUD operations, and recipe saving/unsaving functionality
  - recipeClient.ts: Recipe-specific API calls that integrate with the recipes routes implemented in the server
    - Manages recipe creation, retrieval, updates, and deletion operations
  - postClient.ts: Post-related API operations that integrate with the post routes implemented in the server
    - Handles post creation, retrieval, updates, and deletion for social recipe sharing

- Reducers: State management using Redux pattern
  - reducer.ts: Main application account state management that handles current user authentication state and manages signup flow
  - userReducer.ts: User-specific state management that manages all users data and social interactions, including following/unfollowing users and recipe saving/unsaving functionality
  - recipeReducer.ts: Recipe state management that handles the recipes collection with actions for setting, adding, updating, and deleting recipes
  - postReducer.ts: Post state management that manages the social posts collection, including post CRUD operations, commenting system, and like/unlike functionality

- Styling: CSS modules for component styling (styles.css)

SOURCE ORGANIZATION: The main application structure is organized as follows:
- Home & Core Pages:
  - Main application: src/ReciPals/index.tsx
  - Main navigation: src/ReciPals/Navigation.tsx
  - Home page: src/ReciPals/Home/index.tsx

- Account & Authentication:
  - Admin panel: src/ReciPals/Account/Admin/
  - Routes: src/ReciPals/Account/Admin/index.tsx
  - User and recipe navigation: src/ReciPals/Account/Admin/Navigation.tsx
  - Recipe management: src/ReciPals/Account/Admin/Recipes.tsx
  - Recipe table: src/ReciPals/Recipes/Admin/Table.tsx
  - Recipe details: src/ReciPals/Recipes/Admin/Details.tsx
  - User management: src/ReciPals/Account/Admin/Users.tsx
  - User table: src/ReciPals/Users/Admin/Table.tsx
  - User details: src/ReciPals/Users/Admin/Details.tsx
  - Login: src/Login.tsx
  - Signup: src/Signup.tsx, SignupTags.tsx
  - Session: src/Session.tsx
  - Profile management: src/ReciPals/Account/Profile/
  - Profile editor: src/ReciPals/Account/Profile/Editor.tsx
  - Social features: src/ReciPals/Account/Profile/Followers.tsx, Following.tsx
  - Profile view: src/ReciPals/Account/Profile/index.tsx

- Recipe Features:
  - Recipe components: src/ReciPals/Recipes/
  - Recipe details: src/ReciPals/Recipes/Details.tsx
  - Recipe editor: src/ReciPals/Recipes/Editor.tsx
  - Saved recipes: src/ReciPals/Saved/index.tsx
  - Search functionality: src/ReciPals/Search/index.tsx

- Social Features:
  - User posts: src/ReciPals/Posts/UserPosts.tsx
  - Post management: src/ReciPals/Posts/Post.tsx

- State Management & API:
  - API clients: src/client.ts, recipeClient.ts, postClient.ts
  - Redux reducers: src/reducer.ts, userReducer.ts, recipeReducer.ts, postReducer.ts
  - Store configuration: src/store.ts

- Styling:
  - CSS Styling: src/ReciPals/styles.css
