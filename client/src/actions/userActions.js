import axios from "axios";

import { GET_ERRORS, UPDATE_USER_PROFILE } from "./types";

//Get user
export const getUserById = userId => {
    axios
      .get("/api/users/" + userId)
      .then(res => res.data.data.name)
  };

export const updateUserSuccessAction = user => ({
  type: UPDATE_USER_PROFILE,
  payload: {
      user,
  },
});

// Update User
export const updateUser = (userId, userData) => dispatch => {
  axios
    .post("/api/users/" + userId, {
        id: userId,
        update: userData
    })
    .then(res => res.data)
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
