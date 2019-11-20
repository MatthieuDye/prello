import * as types from '../actions/types';
import {FAVORITE_BOARD_SUCCESS} from "../actions/types";


const boardReducer = (state =  [], action) => {


    switch (action.type) {
        // case types.CREATE_BOARD_SUCCESS: {
        //     return state.guestBoards.concat([action.payload.board])
        // }
        case types.FETCH_BOARDS_SUCCESS: {
            return action.payload.boards
        }

        case FAVORITE_BOARD_SUCCESS: {
            return {
                ...state,
                favoriteBoards: action.payload.favoriteBoards
            }
        }

        default:
            return state;
    }

};
export default boardReducer;