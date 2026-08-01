import { ACTION_TYPES } from "../constants/actionTypes";

const initialState = {
    items: [],
    error: null,
    isLoading: false,
};

export function projectsReducer(state = initialState, {type, payload}){
    switch(type){
        case ACTION_TYPES.FETCH_PROJECTS_START:
            return{
                ...state,
                isLoading: true,
                error: null,
            };
        case ACTION_TYPES.SET_PROJECTS: 
            return {
                ...state, 
                items: payload,
                isLoading: false,
                error: null
            };
        case ACTION_TYPES.SET_PROJECTS_ERROR: 
            return {
                ...state,
                error: payload,
                isLoading: false,
            };
        case ACTION_TYPES.ADD_PROJECT: 
            return{
                ...state,
                items: [...state.items, payload],
            };
        case ACTION_TYPES.REMOVE_PROJECT:
            return {
                ...state,
                items: state.items.filter((project) => project._id !== payload),
            };
        case ACTION_TYPES.UPDATE_PROJECT:
            return{
                ...state,
                items: state.items.map((project) => project._id === payload._id ? payload : project),
            };
        default: 
            return state;
    }
}