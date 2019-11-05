import { UPDATE_USER_PROFILE } from '../actions/types';

export const initialState = {
    user: undefined,
};

const userReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.UPDATE_USER_PROFILE: {
            return {
                ...state
            }
        }

        default:
            return state;
    }

};
export default userReducer;