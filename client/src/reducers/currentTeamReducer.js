import * as types from '../actions/types';


const currentTeamReducer = (state =  [], action) => {


    switch (action.type) {

        case types.FETCH_TEAM_SUCCESS: {
            return action.payload.team
        }

        case types.ADD_MEMBER_SUCCESS: {
            return action.payload.team
        }

        default:
            return state;
    }

};
export default currentTeamReducer;