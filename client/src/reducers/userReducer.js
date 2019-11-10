import { UPDATE_USER_PROFILE, SAVE_USER } from '../actions/types';

const initialState = {
    user: {},
};

export default function(state = initialState, action) {
    switch (action.type) {
        case UPDATE_USER_PROFILE: {
            return {
                ...state,
                user: action.payload
            }
        }

        case SAVE_USER: {
            return {
                ...state,
                user: action.payload
            }
        }

        default:
            return state;
    }

};