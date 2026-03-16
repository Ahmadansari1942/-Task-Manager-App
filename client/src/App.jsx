import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTrash, FaClock, FaPlus, FaFire, FaLeaf, FaBolt, FaEdit, FaTimes, FaSave } from 'react-icons/fa';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tag, setTag] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

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

  const addTask = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(API_URL, {
        text: input,
        description,
        priority,
        tag
      });
      setTasks([res.data, ...tasks]);
      setInput("");
      setDescription("");
      setPriority("medium");
      setTag("personal");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`);
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const saveEdit = async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, {
        text: editText,
        description: editDesc
      });
      setTasks(tasks.map(task => task._id === id ? res.data : task));
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const done = tasks.filter(t => t.status === 'completed').length;
  const total = tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const priorityIcon = (p) => {
    if (p === 'high') return <FaFire className="pri-icon high" />;
    if (p === 'medium') return <FaBolt className="pri-icon medium" />;
    return <FaLeaf className="pri-icon low" />;
  };

  return (
    <div className="app-wrapper">
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      <div className="app-container">

        {/* Header */}
        <div className="header">
          <div className="header-icon">✦</div>
          <h1>My Task Manager</h1>
          <p>Stay focused. Get things done.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-num">{total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card green">
            <span className="stat-num">{done}</span>
            <span className="stat-label">Done</span>
          </div>
          <div className="stat-card yellow">
            <span className="stat-num">{total - done}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-wrap">
          <div className="progress-label">
            <span>Progress</span>
            <strong>{pct}%</strong>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }}></div>
          </div>
        </div>

        {/* Input */}
        <div className="input-section">
          <div className="input-row">
            <input
              type="text"
              className="main-input"
              placeholder="Task title..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button className="add-btn" onClick={addTask}>
              <FaPlus />
            </button>
          </div>
          <textarea
            className="desc-input"
            placeholder="Add a description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <div className="select-row">
            <div className="select-wrap">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="high">🔥 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">🌿 Low</option>
              </select>
            </div>
            <div className="select-wrap">
              <label>Tag</label>
              <select value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="work">💼 Work</option>
                <option value="personal">👤 Personal</option>
                <option value="urgent">🚨 Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {['all', 'pending', 'completed'].map(f => (
            <button
              key={f}
              className={`tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="task-list">
          {loading ? (
            <p className="loading">Loading tasks...</p>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span>◎</span>
              <p>No tasks here!</p>
            </div>
          ) : (
            filtered.map(task => (
              <div key={task._id} className={`task-item ${task.status === 'completed' ? 'completed' : ''} pri-${task.priority || 'medium'}`}>

                {editId === task._id ? (
                  <div className="edit-mode">
                    <input
                      className="edit-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="Task title..."
                    />
                    <textarea
                      className="edit-textarea"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Description..."
                      rows={2}
                    />
                    <div className="edit-actions">
                      <button className="btn-save" onClick={() => saveEdit(task._id)}>
                        <FaSave /> Save
                      </button>
                      <button className="btn-cancel" onClick={() => setEditId(null)}>
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-left">
                      <div className="priority-dot"></div>
                      <div className="task-info">
                        <div className="task-title-row">
                          {priorityIcon(task.priority)}
                          <span className="task-text">{task.text}</span>
                          {task.tag && <span className={`task-tag tag-${task.tag}`}>{task.tag}</span>}
                        </div>
                        {task.description && (
                          <p className="task-desc">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="task-actions">
                      <button
                        className={`action-btn ${task.status === 'completed' ? 'pending-btn' : 'complete-btn'}`}
                        onClick={() => toggleStatus(task._id)}
                        title={task.status === 'completed' ? "Mark Pending" : "Mark Complete"}
                      >
                        {task.status === 'completed' ? <FaClock /> : <FaCheck />}
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => { setEditId(task._id); setEditText(task.text); setEditDesc(task.description || ''); }}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => deleteTask(task._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="app-footer">
          <span>{total} tasks total</span>
          <button className="clear-btn" onClick={() => {
            tasks.filter(t => t.status === 'completed').forEach(t => deleteTask(t._id));
          }}>
            Clear completed
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;
