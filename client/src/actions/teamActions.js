import axios from "axios";
import { GET_ERRORS, CREATE_TEAM_SUCCESS, FETCH_TEAMS_SUCCESS, FETCH_TEAM_SUCCESS,
    ADD_MEMBER_SUCCESS, UPDATE_TEAM_SUCCESS, UPDATE_MEMBER_ROLE_SUCCESS, DELETE_MEMBER_SUCCESS } from "./types";


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

// _______ FETCH TEAMS _______

export const fetchTeamsSuccessAction = teams => ({
    type: FETCH_TEAMS_SUCCESS,
    payload: {
        teams,
    },
});

export const fetchTeams = (userId) => dispatch => {
    axios
        .get(`/api/private/user/${userId}/teams`)
        .then(res => dispatch(fetchTeamsSuccessAction(res.data.teams)))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ FETCH ONE TEAM _______

export const fetchTeamSuccessAction = team => ({
    type: FETCH_TEAM_SUCCESS,
    payload: {
        team,
    },
});

export const fetchTeam = (teamId) => dispatch => {
    axios
        .get(`/api/private/team/member/${teamId}`, {headers : {teamId : teamId}})
        .then(res => dispatch(fetchTeamSuccessAction(res.data.team)))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ ADD MEMBER_______

export const addMemberSuccessAction = team => ({
    type: ADD_MEMBER_SUCCESS,
    payload: {
        team,
    },
});

export const addMember = (userName, teamId) => dispatch => {
    axios
        .post(`/api/private/team/admin/${teamId}/add/user/${userName}`,undefined, {headers : {"teamId" : teamId}})
        .then(res => dispatch(addMemberSuccessAction(res.data.team)))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ UPDATE MEMBER ROLE _____

export const updateMemberRoleSuccessAction = team => ({
    type: UPDATE_MEMBER_ROLE_SUCCESS,
    payload: {
        team,
    },
});

export const updateMemberRole = (userId, teamId, isAdmin) => dispatch => {
    axios
        .put(`/api/private/team/admin/${teamId}/update/user/role/${userId}`, {isAdmin: isAdmin}, {headers : {"teamId" : teamId}} )
        .then(res => dispatch(updateMemberRoleSuccessAction(res.data.team)))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

//________ DELETE MEMBER _______

export const deleteMemberSuccessAction = team => ({
    type: DELETE_MEMBER_SUCCESS,
    payload: {
        team,
    },
});

export const deleteMember = (userId, teamId) => dispatch => {
    axios
        .delete(`/api/private/team/admin/${teamId}/delete/user/${userId}`, {headers : {"teamId" : teamId}})
        .then(res => dispatch(deleteMemberSuccessAction(res.data.team)))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

//________ UPDATE TEAM _______

export const updateTeamSuccessAction = team => ({
    type: UPDATE_TEAM_SUCCESS,
    payload: {
        team,
    },
});

export const updateTeam = (teamId, teamData) => dispatch => {
    axios
        .put(`/api/private/team/admin/${teamId}/update`, teamData)
        .then(res => dispatch(updateTeamSuccessAction(res.data.team)))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};