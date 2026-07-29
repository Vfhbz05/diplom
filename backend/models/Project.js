const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Название проекта обязательно'],
        trim: true
    },
    description : {
        type: String,
        trim: true
    },
    hourlyRate: {
        type: Number,
        default: 0,
        min: [0, 'Ставка не может быть отрицательной']
    }, 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    team : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);