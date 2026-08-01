export const selectProjectItems = (state) => state.projects.items;
export const selectProjectsError = (state) => state.projects.error;
export const selectProjectById = (state, projectId) => 
    state.projects.items.find((project) => project._id === projectId);

export const selectProjectsIsLoading = (state) => state.projects.isLoading;

