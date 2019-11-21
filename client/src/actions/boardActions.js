import axios from "axios";
import * as TYPE from "./types";


// _______ CREATE BOARD _______

export const createBoardSuccessAction = board => ({
    type: TYPE.CREATE_BOARD_SUCCESS,
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
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};


export const fetchBoardsSuccessAction = boards => ({
    type: TYPE.FETCH_BOARDS_SUCCESS,
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
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};
// _______ ADD MEMBER_______

export const addMemberSuccessAction = board => ({
    type: TYPE.ADD_BOARD_MEMBER_SUCCESS,
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
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ FETCH ONE BOARD _______

export const fetchBoardSuccessAction = board => ({
    type: TYPE.FETCH_BOARD_SUCCESS,
    payload: {
        board,
    },
});

export const fetchBoard = (boardId) => dispatch => {
    axios
        .get(`/api/private/board/member/${boardId}/all`)
        .then(res => dispatch(fetchBoardSuccessAction(res.data.board)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ ADD BOARD LIST_______

export const addBoardListSuccessAction = list => ({
    type: TYPE.ADD_BOARD_LIST_SUCCESS,
    payload: {
        list,
    },
});

export const addBoardList = (newListData) => dispatch => {
    axios
        .post(`/api/private/board/member/list/create`, newListData )
        .then(res => dispatch(addBoardListSuccessAction(res.data.list)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ FETCH A LIST _______

export const fetchBoardListSuccessAction = list => ({
    type: TYPE.FETCH_BOARD_LIST_SUCCESS,
    payload: {
        list,
    },
});

export const fetchList = (listId) => dispatch => {
    axios
        .get(`/api/private/board/member/list/${listId}`)
        .then(res => dispatch(fetchBoardListSuccessAction(res.data.list)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};
// _______ ADD TEAM_______

export const addTeamSuccessAction = board => ({
    type: TYPE.ADD_BOARD_TEAM_SUCCESS,
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
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};
