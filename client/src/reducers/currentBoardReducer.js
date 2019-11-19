import * as types from '../actions/types';


const currentBoardReducer = (state =  [], action) => {


    switch (action.type) {

        case types.FETCH_BOARD_SUCCESS: {
            return action.payload.team
        }


        default:
            return state;
    }

};
export default currentBoardReducer;