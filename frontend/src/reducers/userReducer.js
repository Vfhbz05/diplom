import { ACTION_TYPES } from "../constants/actionTypes";

const initialState = {
    user: {
        id: null,
        email: null,
        role: null,
        name: null,
        hourlyRate: 0,   
    },
    loading: true,
    error: null
};

export function userReducer(state = initialState, { type, payload}){
    switch(type){
        case ACTION_TYPES.USER_LOGIN:
            return {
                ...state,
                user: payload,
                loading: false,
                error: null
            };
        case ACTION_TYPES.USER_LOGOUT: 
            return {
                ...state,
                user: initialState.user,
                loading: false,
                error: null
            }
        default: 
            return state;
    }
}