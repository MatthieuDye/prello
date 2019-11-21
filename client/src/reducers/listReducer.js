import * as types from '../actions/types';

const listReducer = (state =  [], action) => {

    switch (action.type) {
        case types.ADD_LIST_CARD_SUCCESS: {
            return action.payload.card
        }
        default:
            return state;
    }
};

export default listReducer;