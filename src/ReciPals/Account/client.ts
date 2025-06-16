import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;
const axiosWithCredentials = axios.create({ withCredentials: true }); 


// Account client.ts integrates with the user routes implemented in the server 

// signin posts a credentials object containing the username and password expected by the server
// if the credentials are found, the response should contain the logged in user
export const signin = async (credentials: any) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials); 
  return response.data;
};

// signup posts a user object
export const signup = async (user: any) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user); 
  return response.data;
};

// updateUser sends user updates to the server to be saved to the database
export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user); 
  return response.data;
};

// profile posts current user object
export const profile = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return response.data;
};

// sign out posts null user object
export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

// gets all usrs
export const getAllUsers = async () => {
    const response = await axiosWithCredentials.get(`${USERS_API}`);
    return response.data;
}


