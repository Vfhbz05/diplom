export const selectCurrentUserName = (state) => state.user.user.name;
export const selectCurrentUserId = (state) =>  state.user.user?._id || state.user.user?.id || null;
export const selectCurrentUser = (state) => state.user.user;
export const selectCurrentUserRole = (state) => state.user.user?.role || null;