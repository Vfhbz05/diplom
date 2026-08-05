import { ACTION_TYPES } from "../constants/actionTypes";


const initialState = {
    items: [],
    loading: false,
    error: null  
}

export function tasksReducer(state = initialState, {type, payload}){
    switch(type){
        case ACTION_TYPES.FETCH_TASKS_START:
            return {
                ...state,
                loading: true,
                error: null
            };
        case ACTION_TYPES.SET_TASKS:
            return{
                ...state,
                items: payload,
                loading: false
            };
        case ACTION_TYPES.ADD_TASK: 
            return{
                ...state,
                items: [...state.items, payload],
            };
        case ACTION_TYPES.UPDATE_TASK:
            return {
                ...state,
                items: state.items.map((task) => {
                    const currentId = String(task._id || task.id);
                    const payloadId = String(payload?._id || payload?.id);

                    return currentId === payloadId ? { ...task, ...payload } : task;
                })
            };
        case ACTION_TYPES.DELETE_TASK: 
            return{
                ...state,
                items: state.items.filter((task) => task._id !== payload)
            };
        case ACTION_TYPES.FETCH_TASKS_FAILURE:
            return {
                ...state,
                loading: false,
                error: payload
            };
        default: 
            return state;
    }
}