import * as types from '../actions/types';

export const initialState = {
    profile: undefined,
    user: undefined,
};

const teamReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.CREATE_TEAM_SUCCESS: {
            return {
                ...state,
                profile: {
                    ...state.profile,
                    teams: state.profile.teams.concat(action.payload.team)
                }
            }
        }

        default:
            return state;
    }

};
export default teamReducer;