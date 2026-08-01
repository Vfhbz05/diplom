import { request } from "../utils/request";
import { ACTION_TYPES } from "../constants/actionTypes";

export const setProjects = (projects) => ({ type: ACTION_TYPES.SET_PROJECTS, payload: projects });
export const addProject = (project) => ({ type: ACTION_TYPES.ADD_PROJECT, payload: project });
export const removeProject = (projectId) => ({ type: ACTION_TYPES.REMOVE_PROJECT, payload: projectId});
export const updateProjectInList = (updatedProject) => ({ type: ACTION_TYPES.UPDATE_PROJECT, payload: updatedProject});
export const setProjectsError = (error) => ({ type: ACTION_TYPES.SET_PROJECTS_ERROR, payload: error});

export const fetchProjects = () => (dispatch) => {
    return request('/projects', 'GET')
        .then((data)=> {
            if(data.error){
                dispatch(setProjectsError(`Не удалось загрузить проекты: ${data.error}`));
                return data;
            }

            dispatch(setProjects(data.projects || []));
            return data;
        }).catch((err) => {
            dispatch(setProjectsError(`Системная ошибка сети: ${err.message}`));
        });
};

export const createNewProject = (projectData) => (dispatch) => {
    return request('/projects', 'POST', projectData).then((data) => {
        if(!data.error && data.project){
            dispatch(addProject(data.project));
        }
        return data;
    });
};

export const removeProjectFromServer = (projectId) => (dispatch) => {
    return request(`/projects/${projectId}`, 'DELETE').then((data) => {
        if(!data.error){
            dispatch(removeProject(projectId));
        }
        return data;
    });
};

export const editProjectOnServer = (projectId, updateData) => (dispatch) => {
    return request(`/projects/${projectId}`, 'PATCH', updateData).then((data) => {
        if(!data.error && data.project) {
            dispatch(updateProjectInList(data.project));
        }
        return data;
    });
};

export const addProjectMember = (projectId, email) => (dispatch) => {
    return request(`/projects/${projectId}/members`, 'PATCH', { email }).then((data) => {
        if(!data.error && data.project) {
            dispatch(updateProjectInList(data.project));
        }
        return data;
    });
};

export const removeProjectMember = (projectId, userIdToRemove) => (dispatch) => {
    return request(`/projects/${projectId}/members/${userIdToRemove}`, 'DELETE').then((data) => {
        if(!data.error && data.project) {
            dispatch(updateProjectInList(data.project));
        }
        return data;
    });
};

export const updateProjectOwner = (projectId, newOwnerId) => (dispatch) => {
    return request(`/projects/${projectId}/owner`, 'PATCH', { newOwnerId }).then((data) => {
        if(!data.error && data.project) {
            dispatch(updateProjectInList(data.project));
        }
        return data;
    });
};