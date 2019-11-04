import * as types from '../actions/types';

const initialState = {
    isAuthenticated: false,
    user: {teams:[]},
    loading: false
};

const teamReducer = (state = initialState, action) => {


    switch (action.type) {
        case types.CREATE_TEAM_SUCCESS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    teams: state.user.teams.concat(action.payload.team)
                }
            };
        }

        default:
            return state;
    }

};
export default teamReducer;