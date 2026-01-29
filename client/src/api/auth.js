import axios from "axios";
import { ENDPOINTS } from "./endpoints";
export const loginUser = async (email, password) => {
  const response = await axios.post(
    ENDPOINTS.LOGIN,
    { email, password },
    { withCredentials: true } 
  );

  return response.data;
};


export const registerUser = async (name, email, password) => {
  const response = await axios.post(
    ENDPOINTS.REGISTER,
    { username: name, email, password },
    { withCredentials: true } 
  );

  return response.data;
};


export const GETUserProfile = async () => {
  const response = await axios.get(ENDPOINTS.Get_ME, {
    withCredentials: true,  
  });

  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(ENDPOINTS.Logout, {
    withCredentials: true,
  });
  return response.data;
};