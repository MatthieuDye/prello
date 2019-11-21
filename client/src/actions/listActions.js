import axios from "axios";
import * as TYPE from "./types";

// _______ ADD LIST CARD_______

export const addListCardSuccessAction = card => ({
    type: TYPE.ADD_LIST_CARD_SUCCESS,
    payload: {
        card,
    },
});

export const addListCard = (newCardData) => dispatch => {
    axios
        .post(`/api/private/board/member/card/create`, newCardData, {headers : {boardId : newCardData.boardId}} )
        .then(res => dispatch(addListCardSuccessAction(res.data.card)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ UPDATE LIST_______

export const renameListSuccessAction = list => ({
    type: TYPE.RENAME_LIST_SUCCESS,
    payload: {
        list,
    },
});

export const renameList = (renameListData) => dispatch => {
    axios
        .put(`/api/private/board/member/list/${renameListData.id}/rename`, renameListData, {headers : {boardId : renameListData.boardId}}  )
        .then(res => dispatch(renameListSuccessAction(res.data.list)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ ARCHIVE LIST_______

export const archiveListSuccessAction = list => ({
    type: TYPE.ARCHIVE_LIST_SUCCESS,
    payload: {
        list,
    },
});

export const archiveList = (archiveListData) => dispatch => {
    axios
        .put(`/api/private/board/member/list/${archiveListData.id}/archive`, archiveListData, {headers : {boardId : archiveListData.boardId}}  )
        .then(res => dispatch(archiveListSuccessAction(res.data.list)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};