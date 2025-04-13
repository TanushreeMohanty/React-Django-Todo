import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000/api/tasks/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  };

  const handleAddTask = async () => {
    if (input.trim() === '') return;
    const res = await axios.post(API_URL, {
      text: input,
      completed: false,
    });
    setTasks([res.data, ...tasks]);
    setInput('');
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}${id}/`);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = async (id, completed) => {
    const res = await axios.patch(`${API_URL}${id}/`, { completed: !completed });
    setTasks(
      tasks.map((task) =>
        task.id === id ? res.data : task
      )
    );
  };

  return (
    <div className="app">
      <h1>📝 ToDo App</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet!</p>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id, task.completed)}
              />
              <span>{task.text}</span>
              <button onClick={() => handleDelete(task.id)}>❌</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
