export const selectProjectItems = (state) => state.projects.items;
export const selectProjectsError = (state) => state.projects.error;
export const selectProjectById = (projectId) => (state) => 
  (state.projects.items).find((p) => (
        p._id === projectId || p.id === projectId
    ));

export const selectProjectsIsLoading = (state) => state.projects.isLoading;

export const selectProjectTeam = (projectId) => (state) => {
  const project = selectProjectById(projectId)(state);
  return project?.team;
};