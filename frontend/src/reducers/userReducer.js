import { ACTION_TYPES } from "../constants/actionTypes";

const savedUserData = sessionStorage.getItem('userData');
const parsedUser = savedUserData ? JSON.parse(savedUserData) : null;

const initialState = {
    user: {
        _id: parsedUser?._id || parsedUser?.id || null,
        email: parsedUser?.email || null,
        role: parsedUser?.role || null,
        name: parsedUser?.name || null,
        hourlyRate: parsedUser?.hourlyRate || 0,   
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
                user: {
                    _id: null,
                    email: null,
                    role: null,
                    name: null,
                    hourlyRate: 0,
                },
                loading: false,
                error: null
            }
        default: 
            return state;
    }
}