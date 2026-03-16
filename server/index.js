const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log(err));

// Routes
const Task = require('./models/Task');

// 1. Get All Tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
});

// 2. Add New Task
app.post('/api/tasks', async (req, res) => {
    const newTask = new Task({ text: req.body.text });
    const savedTask = await newTask.save();
    res.json(savedTask);
});

// 3. Update Task (Toggle Status / Edit Text)
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

// 4. Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task Deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
