import axios from "axios";

import { GET_ERRORS, UPDATE_USER_PROFILE } from "./types";

// Update User
export const updateUser = (userName, userData, history) => dispatch => {
  axios
    .put("/api/private/user/" + userName, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        userName: userData.userName
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
      history.push("/:userName/boards");
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
  return {
    type: UPDATE_USER_PROFILE,
    payload: userData
  };
};
