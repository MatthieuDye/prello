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
    .post("/api/private/team/create", teamData)
    .then(res => dispatch(createTeamSuccessAction(res.data.team)))
    .then(() => history.push("/:userName/teams"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};