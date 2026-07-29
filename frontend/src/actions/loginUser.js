import { ACTION_TYPES } from "../constants/actionTypes";

export const loginUser = (userData) => ({
    type: ACTION_TYPES.USER_LOGIN,
    payload: userData
})