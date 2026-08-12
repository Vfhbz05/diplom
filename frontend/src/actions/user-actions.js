import { ACTION_TYPES } from "../constants/actionTypes";

export const loginUser = (userData) => ({
    type: ACTION_TYPES.USER_LOGIN,
    payload: userData
});

export const logoutUser = () => ({
    type: ACTION_TYPES.USER_LOGOUT
});

export const setUser = (updatedName) => ({
    type: ACTION_TYPES.SET_USER,
    payload: updatedName
});