const mongoose = require('mongoose');

const taskLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    duration: {
        type: Number,
        required: [true, 'Длительность сессии обязательна'],
        min: [0, 'Время не может быть отрицательным']
    },
    cost: {
        type: Number,
        default: 0
    },
    burnedOut: { 
        type: Boolean, 
        default: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const taskSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, 'Название задачи обязательно'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Todo', 'InProgress', 'Review', 'Done', 'InRevision'],
        default: 'Todo'
    },
    dueDate: {
        type: Date,
        default: null
    },
    totalDuration: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        default: 0
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedTodo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedAt: {
        type: Date,
        default: null 
    },
    timeLogs: [taskLogSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
});

module.exports = mongoose.model('Task', taskSchema);