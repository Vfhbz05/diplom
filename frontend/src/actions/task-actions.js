import { request } from "../utils/request";
import { updateProjectInList } from "./project-actions";
import { ACTION_TYPES } from "../constants/actionTypes";

export const fetchTasksStart = () => ({type: ACTION_TYPES.FETCH_TASKS_START});
export const setTasks = (tasks) => ({ type: ACTION_TYPES.SET_TASKS, payload: tasks });
export const fetchTasksFailure = (errorMessage) => ({type: ACTION_TYPES.FETCH_TASKS_FAILURE, payload: errorMessage});
export const addTask = (task) => ({ type: ACTION_TYPES.ADD_TASK, payload: task });
export const updateTaskInState = (task) => ({ type: ACTION_TYPES.UPDATE_TASK, payload: task});
export const removeTaskFromState = (taskId) => ({ type: ACTION_TYPES.DELETE_TASK, payload: taskId});

export const fetchProjectTasks = (projectId) => (dispatch) => {
    dispatch(fetchTasksStart());

    return request(`/tasks/project/${projectId}`).then((data) => {
        if(data.error) {
            dispatch(fetchTasksFailure(data.error));
            return data;
        }
        dispatch(setTasks(data.tasks));
        return data;
    }).catch((err) => {
        dispatch(fetchTasksFailure(err.message || 'Ошибка сети'));
    });
};

export const createTaskAction = (taskData) => (dispatch) => {
    return request('/tasks', 'POST', taskData).then((data) => {
        if(data.error) {
            alert(`Ошибка создания задачи: ${data.error}`);
            return data;
        }
        dispatch(addTask(data.task));
        return data;
    });
};
export const deleteTaskAction = (taskId) => (dispatch) => {
    return request(`/tasks/${taskId}`, 'DELETE').then((data) => {
        if(data.error) {
            alert(`Ошибка удаления задачи: ${data.error}`);
            return data;
        }
        dispatch(removeTaskFromState(taskId));
        return data;
    });
};

export const editTaskAction = (taskId, updateFields) => (dispatch) => {
    return request(`/tasks/${taskId}`, 'PATCH', updateFields).then((data) => {
        if(data.error) {
            alert(`Ошибка обновления задачи: ${data.error}`);
            return data;
        }
        dispatch(updateTaskInState(data.task));
        return data;
    });
};
export const changeTaskExecutor = (taskId, newExecutorId) => (dispatch) => {
    return request(`/tasks/${taskId}/executor`, 'PATCH', { newExecutorId }).then((data) => {
        if(data.error) {
            alert(`Ошибка назначения исполнителя: ${data.error}`);
            return data;
        }
        dispatch(updateTaskInState(data.task));
        return data;
    });
};

export const logTaskTime = (taskId, duration) => (dispatch) => {
    return request(`/tasks/${taskId}/time`, 'POST', { duration }).then((data) => {
        if(data.error) {
            alert(`Не удалось записать время: ${data.error}`);
            return data;
        }
        dispatch(updateTaskInState(data.task));
        return data;
    });
};

export const changeTaskStatus = (taskId, newStatus, projectId) => (dispatch, getState) => {
    return request(`/tasks/${taskId}/status`, 'PATCH', { status: newStatus }). then((data) => {
        if(data.error){
            alert(`Ошибка при изменении статуса: ${data.error}`);
            return data;
        }

        dispatch(updateTaskInState(data.task));

        const allProjects = getState().projects.items || [];
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

export const addTeamMember = (projectId, email) => (dispatch) => {
    return request(`/projects/${projectId}/members`, 'PATCH', { email }).then((data) => {
        if(data.error) {
            return data;
        }
        dispatch(updateProjectInList(data.project));
        return data;
    });
};

export const removeTeamMember = (projectId, userId) => (dispatch) => {
    return request(`/projects/${projectId}/members/${userId}`, 'DELETE').then((data) => {
        if(data.error) {
            alert(`Ошибка удаления из команды: ${data.error}`);
            return data;
        }
        dispatch(updateProjectInList(data.project));
        return data;
    });
};

export const logTaskTimeAction = (taskId, minutes) => (dispatch) => {
  return request(`/tasks/${taskId}/time`, 'PATCH', { minutes }).then((data) => {
    if (data.error) {
      alert(`Ошибка при сохранении времени: ${data.error}`);
      return data;
    }
    
    dispatch(updateTaskInState(data.task));
    
    return data;
  });
};

export const updateTaskFieldAction = (taskId, updatedData) => (dispatch) => {
    return request(`/tasks/${taskId}`, 'PATCH', updatedData).then((data) => {
        if (data.error) {
        alert(`Ошибка обновления задачи: ${data.error}`);
        return data;
        }

        dispatch(updateTaskInState(data.task));
        return data;
    });
};