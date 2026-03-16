import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTrash, FaClock, FaPlus } from 'react-icons/fa';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Backend URL (Local ya Deployed)
  
const API_URL = "https://api.ahmadansari.site/api/tasks";

  // Fetch Tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(API_URL);
        setTasks(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tasks", err);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Add Task
  const addTask = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(API_URL, { text: input });
      setTasks([res.data, ...tasks]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Status (Pending <-> Complete)
  const toggleStatus = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`);
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>My Task Manager 🚀</h1>
      </div>

      {/* Input Area */}
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Add a new task..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button className="add-btn" onClick={addTask}>
          <FaPlus />
        </button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {loading ? (
          <p className="loading">Loading tasks from database...</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
              <span className="task-text">{task.text}</span>
              
              <div className="task-actions">
                {/* Action 1 & 2: Toggle Status */}
                <button 
                  className={`action-btn ${task.status === 'completed' ? 'pending-btn' : 'complete-btn'}`} 
                  onClick={() => toggleStatus(task._id)}
                  title={task.status === 'completed' ? "Mark Pending" : "Mark Complete"}
                >
                  {task.status === 'completed' ? <FaClock /> : <FaCheck />}
                </button>

                {/* Action 3: Delete */}
                <button 
                  className="action-btn delete-btn" 
                  onClick={() => deleteTask(task._id)}
                  title="Delete Task"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
