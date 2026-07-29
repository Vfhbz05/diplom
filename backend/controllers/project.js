const ROLE = require('../constants/role');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

async function createProject(name, description, ownerId){
    if(!name){
        throw new Error('Название проекта обязательно');
    }

    const project = await Project.create({
        name,
        description,
        owner: ownerId,
        team: [ownerId]
    });

    return project;
}

async function getProjects(userId, userRole){

    if(userRole === ROLE.ADMIN){
        return await Project.find()
            .populate('owner', 'email')
            .populate('team', 'email');
    }

    return await Project.find()
        .or([{ owner: userId }, { team: userId }])
        .populate('owner', 'email')
        .populate('team', 'email');
}

async function addMember(projectId, email){
    const userToAdd = await User.findOne({ email });
    if(!userToAdd){
        throw new Error('Пользователь с таким Email не найден');
    }

    if(project.team.includes(userToAdd._id)){
        throw new Error('Пользователь уже добавлен в этот проект');
    }

    project.team.push(userToAdd._id);
    await project.save();
    return project;
}

async function removeMember(projectId, userIdToRemove){
    const project = await Project.findById(projectId);
    if(!project){
        throw new Error('Проект не найден');
    }

    if(project.owner.toString() === userIdToRemove.toString()){
        throw new Error('Нельзя удалить владельца проекта из команды');
    }

    project.team = project.team.filter(memberId => memberId.toString() !== userIdToRemove.toString());
    
    await project.save();
    
    const tasks = await Task.find({ project: projectId });

    for(let i = 0; i < tasks.length; i++){
        const currentTask = tasks[i];

        if(
            currentTask.assignedTodo?.toString() === userIdToRemove.toString() 
            && currentTask.status !== 'Done'){
                currentTask.assignedTodo = project.owner;
                currentTask.status = 'Todo';
        }

        await currentTask.save();
    }
    
    return project;
}

async function changeOwner(projectId, newOwnerId){
    const project = await Project.findById(projectId);
    if(!project){
        throw new Error('Проект не найден');
    }

    const userExists = await User.exists({ _id: newOwnerId });
    if(!userExists){
        throw new Error('Новый владелец не найден в системе');
    }

    project.owner = newOwnerId;

    if(!project.team.includes(newOwnerId)){
        project.team.push(newOwnerId);
    }

    await project.save();
    return project;
}

async function updateProject(projectId, updateData){
    const project = await Project.findByIdAndUpdate(projectId, updateData, { new: true, runValidators: true});

    if(!project){
        throw new Error('Проект не найден');
    }

    return project;
}

async function deleteProject(projectId){
    const project = await Project.findByIdAndDelete(projectId);
    if(!project){
        throw new Error('Проект не найден');
    }
    return true;
}

module.exports = {
    createProject,
    getProjects,
    addMember, 
    removeMember,
    changeOwner,
    deleteProject,
    updateProject
};