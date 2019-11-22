import {UPDATE_USER_PROFILE, SAVE_USER, FETCH_USER_SUCCESS} from '../actions/types';

const userReducer = (state = [], action) => {
    switch (action.type) {
        case UPDATE_USER_PROFILE: {
            return {
                ...state,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                userName: action.payload.userName,
                email: action.payload.email
            }
        }

        case SAVE_USER: {
            return {
                ...state,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                userName: action.payload.userName,
                email: action.payload.email
            }
        }

        case FETCH_USER_SUCCESS: {
            return action.payload.user
        }

        default:
            return state;
    }

};
export default userReducer;