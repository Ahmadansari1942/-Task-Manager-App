const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log(err));

const Task = require('./models/Task');

// Get All Tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
});

// Add New Task
app.post('/api/tasks', async (req, res) => {
    const newTask = new Task({
        text: req.body.text,
        description: req.body.description || '',
        priority: req.body.priority || 'medium',
        tag: req.body.tag || 'personal'
    });
    const savedTask = await newTask.save();
    res.json(savedTask);
});

// Toggle Status
app.put('/api/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
        task.status = task.status === 'pending' ? 'completed' : 'pending';
        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

// Edit Task (text + description)
app.patch('/api/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
        if (req.body.text) task.text = req.body.text;
        if (req.body.description !== undefined) task.description = req.body.description;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

// Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task Deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
