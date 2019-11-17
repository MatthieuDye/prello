import axios from "axios";
import { GET_ERRORS, CREATE_BOARD_SUCCESS, FETCH_BOARDS_SUCCESS } from "./types";


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
        .then(() => history.push("/board"))
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