import axios from "axios";

import { GET_ERRORS } from "./types";

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
