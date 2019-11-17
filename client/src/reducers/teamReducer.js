import * as types from '../actions/types';


const teamReducer = (state =  [], action) => {


    switch (action.type) {
        case types.CREATE_TEAM_SUCCESS: {
            return state.concat([action.payload.team])
        }
        case types.FETCH_TEAMS_SUCCESS: {
            return action.payload.teams
        }

        default:
            return state;
    }

};
export default teamReducer;