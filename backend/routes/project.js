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
const Project = require('../models/Project');
const isProjectOwnerOrAdmin = require('../middlewares/isProjectOwnerOrAdmin');

const router = express.Router();

router.post('/', isAuth, hasRole([ROLE.ADMIN, ROLE.MODERATOR]), async (req, res) => {
    try{
        const { name, description, deadline } = req.body;
        const ownerId = req.user._id;

        const project = await createProject(name, description, ownerId, deadline);

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

router.patch('/:id/members', isAuth, isProjectOwnerOrAdmin, async (req, res) => {
    try{
        const { email } = req.body;
        const projectId = req.params.id;

        const updatedProject = await addMember(req.project, email);
        res.send({ error: null, project: updatedProject});
    } catch (err){
        res.status(400).send({ error: err.message});
    }
});

router.delete('/:id/members/:userId', isAuth, isProjectOwnerOrAdmin, async (req, res) => {
    try{
        const updatedProject = await removeMember(req.project, req.params.userId);
        res.send({ error: null, project: updatedProject });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.patch('/:id/owner', isAuth, isProjectOwnerOrAdmin, async (req, res) => {
    try{
        const { email } = req.body;
        const updatedProject = await changeOwner(req.project, email);
        res.send({ error: null, project: updatedProject});
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.patch('/:id', isAuth, isProjectOwnerOrAdmin, async (req, res) => {
    try{
        const updatedProject = await updateProject(req.project, req.body);
        res.send({ error: null, project: updatedProject });
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

router.delete('/:id', isAuth, isProjectOwnerOrAdmin, async (req, res) => {
    try{
        await deleteProject(req.project);
        res.send({ error: null, success: true });
    } catch (err){
        res.status(400).send({ error: err.message });
    }
});


module.exports = router;