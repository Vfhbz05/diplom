export const selectAllTasks = (state) => state.tasks?.items || [];
export const selectTasksLoading = (state) => state.tasks.isLoading || state.tasks.loading || false;
export const selectTasksError = (state) => state.tasks.error || null;
export const selectTasksByStatus = (status) => (state) => {
  const allTasks = selectAllTasks(state);
  return allTasks.filter(task => task.status === status);
};
export const selectProjectTotalDuration = (state) => {
  const allTasks = selectAllTasks(state);
  return allTasks.reduce((sum, task) => sum + (task.totalDuration || 0), 0);
};
export const selectProjectTotalCost = (state) => {
  const allTasks = selectAllTasks(state);
  return allTasks.reduce((sum, task) => sum + (task.cost || 0), 0);
};