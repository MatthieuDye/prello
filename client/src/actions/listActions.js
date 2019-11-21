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
        .post(`/api/private/board/member/card/create`, newCardData )
        .then(res => dispatch(addListCardSuccessAction(res.data.card)))
        .catch(err =>
            dispatch({
                type: TYPE.GET_ERRORS,
                payload: err.response.data
            })
        );
};