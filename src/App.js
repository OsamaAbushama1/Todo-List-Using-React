import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const handleTaskSubmit = () => {
    if (task.trim()) {
      if (editingIndex !== null) {
        const updatedTasks = tasks.map((t, i) =>
          i === editingIndex
            ? { ...t, text: task, category, priority, dueDate }
            : t
        );
        setTasks(updatedTasks);
        setEditingIndex(null);
      } else {
        setTasks([
          ...tasks,
          { text: task, category, priority, dueDate, completed: false },
        ]);
      }
      setTask("");
      setCategory("General");
      setPriority("Low");
      setDueDate("");
    }
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((t, i) => {
      if (i === index) {
        return {
          ...t,
          completed: !t.completed,
          priority: t.completed ? "Low" : "None",
        };
      }
      return t;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const editTask = (index) => {
    setEditingIndex(index);
    const taskToEdit = tasks[index];
    setTask(taskToEdit.text);
    setCategory(taskToEdit.category);
    setPriority(taskToEdit.priority);
    setDueDate(taskToEdit.dueDate);
  };

  const clearCompletedTasks = () => {
    const updatedTasks = tasks.filter((task) => !task.completed);
    setTasks(updatedTasks);
  };

  const [filter, setFilter] = useState("All");
  const filteredTasks = tasks.filter((task) =>
    filter === "All"
      ? true
      : filter === "Completed"
      ? task.completed
      : !task.completed
  );

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <h1>Todo List</h1>

      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? (
          <i className="fas fa-sun"></i>
        ) : (
          <i className="fas fa-moon"></i>
        )}
      </button>

      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={handleTaskSubmit}>
          {editingIndex === null ? "Add" : "Update"}
        </button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Completed")}>Completed</button>
        <button onClick={() => setFilter("Pending")}>Pending</button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((t, index) => (
          <li
            key={index}
            className={`${t.completed ? "completed" : ""} ${
              darkMode ? "dark-mode" : ""
            }`}
            onClick={() => toggleTaskCompletion(index)}
          >
            <span>{t.text}</span>
            <span className="category">[{t.category}]</span>
            <span className="priority">[{t.priority}]</span>
            <span className="due-date">Due: {t.dueDate}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                editTask(index);
              }}
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(index);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button className="clear-completed" onClick={clearCompletedTasks}>
        Clear Completed Tasks
      </button>
    </div>
  );
}

export default App;
