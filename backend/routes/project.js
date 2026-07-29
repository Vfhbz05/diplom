const express = require('express');
const { 
    createProject,
    getProjects,
    addMember, 
    removeMember,
    changeOwner,
    deleteProject,
    updateProject
} = require('../controllers/project');
const isAuth = require('../middlewares/isAuth');
const ROLE = require('../constants/role');
const hasRole = require('../middlewares/hasRole');

const router = express.Router();

router.post('/', isAuth, hasRole([ROLE.ADMIN, ROLE.MODERATOR]), async (req, res) => {
    try{
        const { name, description } = req.body;
        const ownerId = req.user._id;

        const project = await createProject(name, description, ownerId);

        res.status(201).send({ error: null, project });
    } catch(err){
        res.status(400).send({ error: err.message || 'Неизвестная ошибка' });
    }
});

router.get('/', isAuth, async (req, res) => {
    try{
        const projects = await getProjects(req.user._id, req.user.role);
        res.send({ error: null, projects });
    } catch(err){
        res.status(500).send({ error: 'Ошибка при получении списка проектов'});
    }
});

router.patch('/:id/members', isAuth, hasRole([ROLE.ADMIN, ROLE.MODERATOR]), async (req, res) => {
    try{
        const { email } = req.body;
        const projectId = req.params.id;

        const updatedProject = await addMember(projectId, email);
        res.send({ error: null, project: updatedProject});
    } catch (err){
        res.status(400).send({ error: err.message});
    }
});

router.delete('/:id/members/:userId', isAuth, hasRole([ROLE.ADMIN, ROLE.MODERATOR]), async (req, res) => {
    try{
        const projectId = req.params.id;
        const userIdToRemove = req.params.userId;

        const project = await Project.findById(projectId);
        if(!project){
            return res.status(404).send({ error: 'Проект не найден' });
        }

        const isAdmin = req.user.role === ROLE.ADMIN;
        const isOwner = project.owner.toString() === req.user._id.toString();

        if(!isAdmin && !isOwner){
            return res.status(403).send({ error: 'Доступ запрещен: вы не являетесь владельцем этого проекта' });
        }

        const updatedProject = await removeMember(projectId, userIdToRemove);
        res.send({ error: null, project: updatedProject });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.patch('/:id/owner', isAuth, hasRole([ROLE.ADMIN, ROLE.MODERATOR]), async (req, res) => {
    try{
        const projectId = req.params.id;
        const { newOwnerId } = req.body;

        const project = await Project.findById(projectId);
        if(!project){
            return res.status(404).send({ error: 'Проект не найден' });
        }

        const isAdmin = req.user.role === ROLE.ADMIN;
        const isCurrentOwner = project.owner.toString() === req.user._id.toString();

        if(!isAdmin && !isCurrentOwner){
            return res.status(403).send({ error: 'У вас нет прав на передачу этого проекта' });
        }

        const updatedProject = await changeOwner(projectId, newOwnerId);
        res.send({ error: null, project: updatedProject});
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.patch('/:id', isAuth, hasRole([ROLE.ADMIN, ROLE.MODERATOR]), async (req, res) => {
    try{
        const projectId = req.params.id;
        const updateData = req.body;

        const updatedProject = await updateProject(projectId, updateData);
        res.send({ error: null, project: updatedProject });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.delete('/:id', isAuth, hasRole([ROLE.ADMIN, ROLE.MODERATOR]), async (req, res) => {
    try{
        await deleteProject(req.params.id);
        res.send({ error: null, success: true });
    } catch (err){
        res.status(400).send({ error: err.message });
    }
});


module.exports = router;