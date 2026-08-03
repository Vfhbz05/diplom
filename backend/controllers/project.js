const ROLE = require('../constants/role');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const STATUS = require('../constants/status');
const { search } = require('../routes/project');

async function createProject(name, description, ownerId, deadline){
    if(!name){
        throw new Error('Название проекта обязательно');
    }

    const project = await Project.create({
        name,
        description,
        owner: ownerId,
        deadline,
        team: [ownerId]
    });

    return project;
}

async function getProjects(userId, userRole){
    if(userRole === ROLE.ADMIN){
        return await Project.find()
            .populate('owner', 'name email')
            .populate('team', 'name email');
    }

    return await Project.find()
        .or([{ owner: userId }, { team: userId }])
        .populate('owner', 'name email')
        .populate('team', 'name email');
}

async function addMember(project, email){
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

async function removeMember(project, userIdToRemove){
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

async function changeOwner(project, email){
    if (!email || !email.includes('@')) {
        throw new Error('Укажите корректный Email нового владельца');
    }

    const userExists = await User.exists({ email: email.trim().toLowerCase() });
    if(!userExists){
        throw new Error('Новый владелец не найден в системе');
    }

    project.owner = user._id;

    if(!project.team.includes(user._id)){
        project.team.push(user._id);
    }

    await project.save();
    return project;
}

async function updateProject(project, updateData){
    project.set(updateData);
    await project.save({ runValidators: true });

    return project;
}

async function deleteProject(project){
    await Project.findByIdAndDelete(project._id);
    return true;
}

const updateProjectProgress = async (projectId) => {
        const tasks = await Task.find({ project: projectId });

        if(tasks.length === 0){
            const project = await Project.findByIdAndUpdate(projectId, { progress: 0 }, { new: true });
                if (!project) {
                    throw new Error('Проект не найден при пересчете прогресса');
                }
            return 0;
        }
    
        const completedTasksCount = tasks.filter(task => task.status === STATUS.DONE).length;

        const progressPercent = Math.round((completedTasksCount / tasks.length) * 100);

        const project = await Project.findByIdAndUpdate(
            projectId, 
            {progress: progressPercent}, 
            { new: true, runValidators: true }
        );

        if (!project) {
            throw new Error('Проект не найден при сохранении прогресса');
        }

        return progressPercent;
}
module.exports = {
    createProject,
    getProjects,
    addMember, 
    removeMember,
    changeOwner,
    deleteProject,
    updateProject,
    updateProjectProgress 
};