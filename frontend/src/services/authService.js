import axios from "axios";
import { toast } from "react-toastify";
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/users/register`,
      userData,
      {
        withCredentials: true,
      }
    );
    if (res.statusText === "OK") {
      toast.success("User registered successfully");
    }
    return res.data;
  } catch (error) {
    const message =
      //-A list of all of those possible error formats
      //-This is how we can cover any possible variable where errors can be saved.
      //-This is the easiest way to make sure that we pick the exact error that we send from the backend to the frontend
      (err.res && err.res.data && err.res.data.message) ||
      err.message ||
      err.toString();
    toast.error(message);
  }
};

export const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/users/login`, userData);
    if (res.statusText === "OK") {
      toast.success("login successfully.");
    }
  } catch (error) {
    const message =
      (err.res && err.res.data && err.res.data.message) ||
      err.message ||
      err.toString();
    toast.error(message);
  }
};

export const logoutUser = async () => {
  try {
    await axios.get(`${BACKEND_URL}/api/users/logout`);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const forgotPassword = async (userData) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/users/forgotpassword`,
      userData
    );
    toast.success(res.data.message);
  } catch (error) {
    (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const resetPassword = async (userData, resetToken) => {
  try {
    const res = await axios.put(
      `${BACKEND_URL}/api/user/resetpassword/${resetToken}`,
      userData
    );
    return res.data;
  } catch (error) {
    (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getLoginStatus = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/users/loggedin`);
    return res.data;
  } catch (error) {
    (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getUser = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/users/getuser`);
    return res.data;
  } catch (error) {
    (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const updateUser = async (formData) => {
  try {
    const res = await axios.patch(
      `${BACKEND_URL}/api/users/updateuser`,
      formData
    );
    return res.data;
  } catch (error) {
    (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const changePassword = async (formData) => {
  try {
    const res = await axios.patch(
      `${BACKEND_URL}/api/users/changepassword`,
      formData
    );
    return res.data;
  } catch (error) {
    (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
