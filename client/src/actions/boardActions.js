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
        .post(`/api/private/board/admin/${boardId}/add/user/${userName}`, undefined, {headers : {boardId : boardId}})
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
        .get(`/api/private/board/member/${boardId}/all`,{headers : {boardId : boardId}})
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
        .post(`/api/private/board/member/list/create`, newListData , {headers : {boardId : newListData.boardId}})
        .then(res => dispatch(addBoardListSuccessAction(res.data.list)))
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
        .post(`/api/private/board/admin/${boardId}/add/team/${teamName}`, undefined, {headers : {boardId : boardId}})
        .then(res => dispatch(addTeamSuccessAction(res.data.board)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};

//________ DELETE MEMBER _______

export const deleteMemberBoardSuccessAction = board => ({
    type: TYPE.DELETE_MEMBER_BOARD_SUCCESS,
    payload: {
        board,
    },
});

export const deleteBoardMember = (userId, boardId) => dispatch => {
    axios
        .delete(`/api/private/board/admin/${boardId}/delete/user/${userId}`, {headers : {"boardId" : boardId}})
        .then(res => dispatch(deleteMemberBoardSuccessAction(res.data.board)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};

//________ DELETE TEAM _______

export const deleteMemberTeamSuccessAction = board => ({
    type: TYPE.DELETE_TEAM_BOARD_SUCCESS,
    payload: {
        board,
    },
});

export const deleteTeamMember = (teamId, boardId) => dispatch => {
    axios
        .delete(`/api/private/board/admin/${boardId}/delete/team/${teamId}`, {headers : {"boardId" : boardId}})
        .then(res => dispatch(deleteMemberTeamSuccessAction(res.data.board)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ UPDATE MEMBER ROLE _____

export const updateBoardMemberRoleSuccessAction = team => ({
    type: TYPE.UPDATE_BOARD_MEMBER_ROLE_SUCCESS,
    payload: {
        team,
    },
});

export const updateMemberRole = (userId, boardId, isAdmin) => dispatch => {
    axios
        .put(`/api/private/board/admin/${boardId}/update/user/role/${userId}`, {isAdmin: isAdmin}, {headers : {"boardId" : boardId}} )
        .then(res => dispatch(updateBoardMemberRoleSuccessAction(res.data.board)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};

