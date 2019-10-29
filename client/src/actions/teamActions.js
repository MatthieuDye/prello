import axios from "axios";
import { GET_ERRORS, CREATE_TEAM_SUCCESS } from "./types";


// _______ CREATE TEAM _______

export const createTeamSuccessAction = team => ({
    type: CREATE_TEAM_SUCCESS,
    payload: {
        team,
    },
});


export const createTeam = (teamData, history) => dispatch => {
  axios
    .post("/api/team/creation", userData)
    .then(res =>  dispatch(createTeamSuccessAction(res.data.team)))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};