import React, { useState, useEffect } from 'react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', status: 'To Do' });

  const statuses = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${apiUrl}/tasks`);
        if (!response.ok) throw new Error('Error fetching tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const createTask = async () => {
    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error('Error creating task');
      const task = await response.json();
      setTasks([...tasks, task]);
      setNewTask({ title: '', status: 'To Do' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting task');
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${apiUrl}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Error updating task status');
      setTasks(tasks.map((task) =>
        task._id === id ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filterTasksByStatus = (status) => tasks.filter(task => task.status === status);

  return (
    <div className="container mx-auto px-4 pt-20 pb-10 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      
      {/* Task Creation */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-200">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Add New Task</h2>
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <input
            type="text"
            placeholder="Enter task title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
          />
          <button
            onClick={createTask}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300"
          >
            Create Task
          </button>
        </div>
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statuses.map((status) => (
          <div key={status} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <h3 className="text-xl font-semibold text-center text-gray-700 border-b pb-2 mb-4">{status}</h3>
            <div className="space-y-4">
              {filterTasksByStatus(status).map((task) => (
                <div key={task._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border hover:shadow-md transition">
                  <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${
                      task.status === 'To Do' ? 'bg-red-500' :
                      task.status === 'In Progress' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}>
                      {task.status}
                    </span>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      className="ml-2 px-2 py-1 border border-gray-300 text-sm rounded-md bg-white text-gray-700"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-md transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {filterTasksByStatus(status).length === 0 && (
                <p className="text-center text-gray-400 text-sm">No tasks here yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManagement;

