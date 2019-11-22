import axios from "axios";
import * as TYPE from "./types";

// _______ UPDATE CARD_______

export const updateCardSuccessAction = card => ({
    type: TYPE.UPDATE_CARD_SUCCESS,
    payload: {
        card,
    },
});

export const updateCard = (newCardData) => dispatch => {
    axios
        .put(`/api/private/board/member/card/${newCardData.id}`, newCardData, {headers : {boardId : newCardData.boardId}}  )
        .then(res => dispatch(updateCardSuccessAction(res.data.card)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};

// _______ DELETE CARD_______

export const deleteCardSuccessAction = card => ({
    type: TYPE.DELETE_CARD_SUCCESS,
    payload: {
        card,
    },
});

export const deleteCard = (cardData) => dispatch => {
    axios
        .delete(`/api/private/board/member/card/${cardData.id}`, cardData, {headers : {boardId : cardData.boardId}}  )
        .then(res => dispatch(deleteCardSuccessAction(res.data.card)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};