import {UPDATE_USER_PROFILE, SAVE_USER, FAVORITE_BOARD_SUCCESS} from '../actions/types';

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

        case FAVORITE_BOARD_SUCCESS: {
            return {
                ...state,
                favoriteBoards: state.favoriteBoards.concat(action.payload)
            }
        }

        default:
            return state;
    }

};
export default userReducer;