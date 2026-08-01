import { ACTION_TYPES } from "../constants/actionTypes";

const initialState = {
    items: []
}

export function tasksReducer(state = initialState, {type, payload}){
    switch(type){
        case ACTION_TYPES.SET_TASKS:
            return{
                ...state,
                items: payload
            };
        case ACTION_TYPES.ADD_TASK: 
            return{
                ...state,
                items: [...state.items, payload],
            };
        case ACTION_TYPES.UPDATE_TASK:
            return {
                ...state,
                items: state.items.map((task) => task._id === payload._id ? payload : task), 
            };
        default: 
            return state;
    }
}