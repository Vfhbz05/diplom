const express = require('express');
const isAuth = require('../middlewares/isAuth');
const hasRole = require('../middlewares/hasRole');
const { 
    createTask,
    getProjectTasks,
    deleteTask,
    updateTask,
    updateExecutor,
    updateTaskStatus,
    logTime
 } = require('../controllers/task');
const { updateProjectProgress } = require('../controllers/project');
const ROLE = require('../constants/role');
const Task = require('../models/Task');
const STATUS = require('../constants/status');
const mapTask = require('../helpers/mapTask');

const router = express.Router();

router.post('/', isAuth, async (req, res) => {
    try{
        const { title, description, dueDate, projectId, assignedTodo } = req.body;
        const task = await createTask(title, description, dueDate, projectId, assignedTodo, req.user._id);

        await updateProjectProgress(projectId);

        res.status(201).send({ error: null, task });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.get('/project/:projectId', isAuth, async (req, res) => {
    try{
        const tasks = await getProjectTasks(req.params.projectId, req.user._id);
        res.send({ error: null, tasks: tasks.map(task => mapTask(task)) });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.delete('/:id', isAuth, hasRole([ROLE.ADMIN, ROLE.MODERATOR]), async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).send({ error: 'Задача не найдена' });
        }
        const projectId = task.project;

        await deleteTask(req.params.id);

        if(projectId){
            await updateProjectProgress(projectId);
        }

        res.send({ error: null, success: true });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.patch('/:id', isAuth, async (req,res) => {
    try{
        const task = await Task.findById(req.params.id).populate('project');
        if(!task){
            return res.status(404).send({ error: 'Задача не найдена' });
        }

        const isProjectOwner = task.project.owner.toString() === req.user._id.toString();
        const isManagement = [ROLE.ADMIN].includes(req.user.role);
        const isCreator = task.createdBy && task.createdBy.toString() === req.user._id.toString();

        if(!isProjectOwner && !isManagement && !isCreator){
            return res.status(403).send({ error: 'У вас нет прав на редактирование этой задачи' });
        }

        const updatedTask = await updateTask(req.params.id, req.body);
        res.send({ error: null, task: updatedTask });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.patch('/:id/executor', isAuth, async (req, res) => {
    try{
        const { newExecutorId } = req.body;
        const task = await Task.findById(req.params.id).populate('project');
        if(!task){
            return res.status(404).send({ error: 'Задача не найдена' });
        }

        const isAdmin = req.user.role === ROLE.ADMIN;
        const isProjectOwner = task.project.owner.toString() === req.user._id.toString();

        if(!isAdmin && !isProjectOwner){
            return res.status(403).send({ error: 'Иззменять исполнителя может только владелец проекта или администратор' });
        }

        const updatedTask = await updateExecutor(req.params.id, newExecutorId);
        res.send({ error: null, task: updatedTask });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.patch('/:id/status', isAuth, async (req, res) => {
    try{
        const { status } = req.body;
        const updatedTask = await updateTaskStatus( req.params.id, status, req.user);

        let newProgress = 0;

        if(updatedTask && updatedTask.project){
            newProgress = await updateProjectProgress(updatedTask.project);
        }
        
        res.send({ error: null, task: updatedTask, projectProgress: newProgress });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.patch('/:id/time', isAuth, async (req, res) => {
    try{
        const taskId = req.params.id;
        const { minutes } = req.body;
        const userId = req.user._id;

        const updatedTask = await logTime(taskId, minutes, userId);
        res.send({ error: null, task: updatedTask });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.get('/my-work', isAuth, async (req, res) => {
    try{
        const userId = req.user._id;
        const tasks = await Task.find({
            assignedTodo: userId,
            status: { $in: [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.IN_REVISION] }
        }).populate('project', 'name');

        res.send({ error: null, tasks: tasks.map(task => mapTask(task)) });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.get('/my-reviews', isAuth, async (req, res) => {
    try{
        const userId = req.user._id;

        const Project = require('../models/Project');
        const myProjects = await Project.find({ owner: userId });
        const projectIds = myProjects.map(p => p._id);

        const tasks = await Task.find({
            project: { $in: projectIds },
            status: STATUS.REVIEW
        }).populate('assignedTodo', 'email').populate('project', 'name');
        
        res.send({ error: null, tasks });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

module.exports = router;