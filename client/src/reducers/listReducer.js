import * as types from '../actions/types';

const listReducer = (state =  [], action) => {

    switch (action.type) {
        case types.ADD_LIST_CARD_SUCCESS: {
            return action.payload.card
        }

        case types.RENAME_LIST_SUCCESS: {
            return action.payload.list
        }

        case types.ARCHIVE_LIST_SUCCESS: {
            return action.payload.list
        }
        
        default:
            return state;
    }
};

export default listReducer;