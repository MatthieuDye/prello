import axios from "axios";
import { GET_ERRORS, CREATE_BOARD_SUCCESS, FETCH_BOARDS_SUCCESS, ADD_BOARD_MEMBER_SUCCESS, FETCH_BOARD_SUCCESS, ADD_BOARD_TEAM_SUCCESS } from "./types";


// _______ CREATE BOARD _______

export const createBoardSuccessAction = board => ({
    type: CREATE_BOARD_SUCCESS,
    payload: {
        board,
    },
});


export const createBoard = (boardData, history) => dispatch => {
    axios
        .post("/api/private/board/create", boardData)
        .then(res => dispatch(createBoardSuccessAction(res.data.board)))
        .then(() => history.push("/:userName/boards"))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};


export const fetchBoardsSuccessAction = boards => ({
    type: FETCH_BOARDS_SUCCESS,
    payload: {
        boards,
    },
});

export const fetchBoards = (userId) => dispatch => {
    axios
        .get(`/api/private/user/${userId}/boards`)
        .then(res => dispatch(fetchBoardsSuccessAction(res.data.boards)))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};
// _______ ADD MEMBER_______

export const addMemberSuccessAction = board => ({
    type: ADD_BOARD_MEMBER_SUCCESS,
    payload: {
        board,
    },
});

export const addMember = (userName, boardId) => dispatch => {
    axios
        .post(`/api/private/board/admin/${boardId}/add/user/${userName}`)
        .then(res => dispatch(addMemberSuccessAction(res.data.board)))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ FETCH ONE BOARD _______

export const fetchBoardSuccessAction = board => ({
    type: FETCH_BOARD_SUCCESS,
    payload: {
        board,
    },
});

export const fetchBoard = (boardId) => dispatch => {
    axios
        .get(`/api/private/board/member/${boardId}`)
        .then(res => dispatch(fetchBoardSuccessAction(res.data.board)))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ ADD TEAM_______

export const addTeamSuccessAction = board => ({
    type: ADD_BOARD_TEAM_SUCCESS,
    payload: {
        board,
    },
});

export const addTeam = (teamName, boardId) => dispatch => {
    axios
        .post(`/api/private/board/admin/${boardId}/add/team/${teamName}`)
        .then(res => dispatch(addTeamSuccessAction(res.data.board)))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};