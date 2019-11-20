import axios from "axios";

import { GET_ERRORS, UPDATE_USER_PROFILE, FAVORITE_BOARD_SUCCESS } from "./types";

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

// ______ FAVORITE BOARDS ________

export const favoriteBoardsSuccessAction = favoriteBoards => ({
    type: FAVORITE_BOARD_SUCCESS,
    payload: {
        favoriteBoards,
    },
});

export const favoriteBoard = (userId, boardId, isFavorite) => dispatch => {
    axios
        .put(`/api/private/user/${userId}/board/favorite/${boardId}`, {isFavorite : isFavorite})
        .then(res => dispatch(favoriteBoardsSuccessAction(res.data.user.favoriteBoards)))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};
