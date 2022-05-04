import { ACTIONS } from '../actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case (ACTIONS.SAVE_USER_SESSION):

            return {
                ...state,
                user: action.data,
                userType: action.data?.userType,
                authenticated: action?.data ? true : false,
                isSessionChecked: true
            }
        case (ACTIONS.SESSION_CHECKED):
            debugger
            return {
                ...state,
                isSessionChecked: true
            }
        default: return state;
    }
}


