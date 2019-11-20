import * as types from '../actions/types';


const boardReducer = (state =  [], action) => {


    switch (action.type) {
        // case types.CREATE_BOARD_SUCCESS: {
        //     return state.guestBoards.concat([action.payload.board])
        // }
        case types.FETCH_BOARDS_SUCCESS: {
            return action.payload.boards
        }
        case types.ADD_BOARD_LIST_SUCCESS: {
            return action.payload.board
        }

        default:
            return state;
    }

};
export default boardReducer;