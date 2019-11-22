import * as types from '../actions/types';

const cardReducer = (state =  [], action) => {

    switch (action.type) {
        case types.UPDATE_CARD_SUCCESS: {
            return action.payload.card
        }
        case types.DELETE_CARD_SUCCESS: {
            return action.payload.card
        }
        default:
            return state;
    }
};

export default cardReducer;