import { request } from "../utils/request";
import { updateProjectInList } from "./project-actions";
import { ACTION_TYPES } from "../constants/actionTypes";

export const setTasks = (tasks) => ({ type: ACTION_TYPES.SET_TASKS, payload: tasks });
export const addTask = (task) => ({ type: ACTION_TYPES.ADD_TASK, payload: task });
export const updateTaskInState = (task) => ({ type: ACTION_TYPES.UPDATE_TASK, payload: task});

export const changeTaskStatus = (taskId, newStatus, projectId) => (dispatch, getState) => {
    return request(`tasks/${taskId}/status`, 'PATCH', { status: newStatus }). then((data) => {
        if(data.error){
            alert(`Ошибка при изменении статуса: ${data.error}`);
            return data;
        }

        dispatch(updateTaskInState(data.task));

        const allProjects = getState().projects.item;
        const currentProject = allProjects.find(p => p._id === projectId);

        if(currentProject){
            const updatedProject = {
                ...currentProject,
                progress: data.projectProgress
            };

            dispatch(updateProjectInList(updatedProject));
        }

        return data;
    });
};