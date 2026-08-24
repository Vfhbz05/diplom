const Task = require('../models/Task');
const Project = require('../models/Project');
const ROLE = require('../constants/role');
const STATUS = require('../constants/status');
const User = require('../models/User');

async function createTask(title, description, dueDate, projectId, assignedTodo, userId){
    const project = await Project.findById(projectId);
    if(!project){
        throw new Error('Проект не найден');
    }

    if(!project.team.includes(userId)){
        throw new Error('У вас нет доступа к этому проекту');
    }

    const task = await Task.create({
        title,
        description,
        dueDate: dueDate || 0,
        project: projectId,
        assignedTodo: assignedTodo || userId,
        assignedAt: new Date(),
        createdBy: userId
    });

    await task.populate([
        { path: 'assignedTodo', select: 'name email' },
        { path: 'createdBy', select: 'name email' }
    ]);;
    
    return task;
}

async function getProjectTasks(projectId, userId){
    const project = await Project.findById(projectId);
    if(!project){
        throw new Error('Проект не найден');
    }

    if(!project.team.includes(userId)){
        throw new Error('У вас нет доступа к задачам этого проекта');
    }

    return await Task.find({ project: projectId })
        .populate('assignedTodo', 'name email')
        .populate('createdBy', 'name email')
        .populate('timeLogs.user', 'name email');
}

async function deleteTask(taskId){
    const task = await Task.findByIdAndDelete(taskId);
    if(!task){
        throw new Error('Задача не найдена');
    }
    return true;
}

async function updateTask(taskId, updateData){
    delete updateData.status;
    delete updateData.timeLogs;
    delete updateData.totalDuration;

    const task = await Task.findByIdAndUpdate(taskId, updateData, {new: true, runValidators: true});
    if(!task){
        throw new Error('Задача не найдена');
    }

    await task.populate([
        { path: 'assignedTodo', select: 'name email' },
        { path: 'createdBy', select: 'name email' }
    ]);
    return task;
}

async function updateExecutor(taskId, newExecutorId){
    const task = await Task.findById(taskId);
    if(!task){
        throw new Error('Задача не найдена');
    }

    task.assignedTodo = newExecutorId;
    task.assignedAt = new Date();

    if(task.status !== STATUS.TODO && task.status !== STATUS.DONE){
        task.status = STATUS.TODO;
    }

    await task.save();
    await task.populate([
        { path: 'assignedTodo', select: 'name email' },
        { path: 'createdBy', select: 'name email' }
    ]);
    return task;
}

async function updateTaskStatus(taskId, newStatus, user){
    const task = await Task.findById(taskId)
        .populate('project')
        .populate('assignedTodo')
        .populate('createdBy', 'name email');

    if(!task){
        throw new Error('Задача не найдена');
    }

    const currentStatus = task.status;
    const isExecutor = task.assignedTodo 
  ? (task.assignedTodo?._id?.toString() === user._id?.toString() || 
     task.assignedTodo?.toString() === user._id?.toString())
  : false;
    const isManagement = [ROLE.ADMIN, ROLE.MODERATOR].includes(user.role);

    const isProjectOwner = task.project && task.project.owner.toString() === user._id.toString();

    if(currentStatus === STATUS.TODO && newStatus === STATUS.IN_PROGRESS){
        if(!isExecutor){
            throw new Error('Перевести задачу в работу может только её исполнитель');
        }
    } else if (currentStatus === STATUS.IN_PROGRESS && newStatus === STATUS.REVIEW){
        if(!isExecutor){
            throw new Error('Отправить задачу на проверку может только её исполнитель');
        }
    } else if (currentStatus === STATUS.IN_REVISION && newStatus === STATUS.REVIEW){
        if(!isExecutor){
            throw new Error('Отправить задачу на повторную проверку может только её исполнитель');
        }
    } else if (currentStatus === STATUS.REVIEW && (newStatus === STATUS.DONE || newStatus === STATUS.IN_REVISION)){
        if(!isManagement && !isProjectOwner){
            throw new Error('Вернуть задачу или завершить проверку и принять задачу может только модератор или админ');
        }
    } else {
    throw new Error(`Недопустимый переход из статуса ${currentStatus} в ${newStatus}`);
    }

    if(newStatus === STATUS.IN_REVISION) {
        task.assignedAt = new Date();
    }
    
    task.status = newStatus;
    await task.save();
    await task.populate([
        { path: 'assignedTodo', select: 'name email' },
        { path: 'createdBy', select: 'name email' }
    ]);
    return task;
}

async function logTime(taskId, duration, userId){
    if(duration <= 0){
        throw new Error('Время работы должно быть больше нуля');
    }

    const task = await Task.findById(taskId).populate('project');
    if(!task){
        throw new Error('Задача не найдена');
    }

    const allowedStatusesTracking = [STATUS.IN_PROGRESS, STATUS.IN_REVISION];
    if(!allowedStatusesTracking.includes(task.status)){
        throw new Error('Записывать время можно только тогда, когда задача находится в работе или на доработке');
    }

    if (!task.assignedTodo || task.assignedTodo.toString() !== userId.toString()) {
        throw new Error('Вы не можете записывать время в чужую задачу');
    }

    const user = await User.findById(userId);
    if(!user){
        throw new Error('Пользователь не найден');
    }

    const userHourlyRate = user.hourlyRate || 0;
    const sessionCost = Math.round((userHourlyRate / 3600) * duration * 100) / 100;

    const isBurnedOut = duration > 5400;

    const newLog = {
        user: userId,
        duration,
        cost: sessionCost,
        burnedOut: isBurnedOut,
        createdAt: new Date()
    };

    task.timeLogs.push(newLog);
    task.totalDuration += duration;

    task.cost = task.timeLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

    await task.save();
    await task.populate([
        { path: 'assignedTodo', select: 'name email' },
        { path: 'createdBy', select: 'name email' }
    ]);
    return task;
}

module.exports = {
    createTask,
    getProjectTasks,
    deleteTask,
    updateTask,
    updateExecutor,
    updateTaskStatus,
    logTime
}