import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;
const axiosWithCredentials = axios.create({ withCredentials: true });

// Account client.ts integrates with the user routes implemented in the server

// signin posts a credentials object containing the username and password expected by the server
// if the credentials are found, the response should contain the logged in user
export const signin = async (credentials: any) => {
  try {
    const response = await axiosWithCredentials.post(
      `${USERS_API}/signin`,
      credentials
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

// signup posts a user object
export const signup = async (user: any) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
  return response.data;
};

// updateUser sends user updates to the server to be saved to the database
export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${user._id}`,
    user
  );
  return response.data;
};

// profile posts current user object
export const profile = async () => {
  const response = await axiosWithCredentials.get(`${USERS_API}/profile`);
  return response.data;
};

// sign out posts null user object
export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

// gets all users
export const getAllUsers = async () => {
  const response = await axiosWithCredentials.get(`${USERS_API}`);
  return response.data;
};

// findUsersByPartialName retrieves all users of the given name
export const findUsersByPartialName = async (name: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}?name=${name}`);
  return response.data;
};

// findUserById retrieves all users of the given id
export const findUserById = async (id: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${id}`);
  return response.data;
};

// deleteUser deletes the given user based on id
export const deleteUser = async (userId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
  return response.data;
};

// createUser creates a new user
export const createUser = async (user: any) => {
  const response = await axiosWithCredentials.post(`${USERS_API}`, user);
  return response.data;
};

// saveRecipe adds a recipe to user's saved list
export const saveRecipe = async (userId: string, recipeId: string) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${userId}/save`,
    {
      recipeId: recipeId,
    }
  );
  return response.data;
};

// unsaveRecipe removes a recipe from user's saved list
export const unsaveRecipe = async (userId: string, recipeId: string) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${userId}/unsave`,
    {
      recipeId: recipeId,
    }
  );
  return response.data;
};

// followUser follows the given user
export const followUser = async (targetUserId: string) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/follow/${targetUserId}`);
  return response.data;
};

// unfollow user unfollows the given user
export const unfollowUser = async (targetUserId: string) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/unfollow/${targetUserId}`);
  return response.data;
};
