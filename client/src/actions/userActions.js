import axios from "axios";

import { GET_ERRORS, UPDATE_USER_PROFILE } from "./types";

// Update User
export const updateUser = (userId, userData, history) => dispatch => {
  axios
    .post("/api/users/" + userId, {
        id: userId,
        update: userData
    })
    .then(res => {
      // Set token to localStorage
      /*const { token } = res.data;
      console.log(token)
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      console.log(decoded)*/
      dispatch(updateUserProfile(userData));
      history.push("/dashboard");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Update user profile
export const updateUserProfile = userData => {
  console.log("UPDATE USER PROFILE")
  console.log(userData)
  return {
    type: UPDATE_USER_PROFILE,
    payload: userData
  };
};
