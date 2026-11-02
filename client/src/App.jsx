import { useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import { COLUMNS } from './utils.js';
import Column from './components/Column.jsx';
import TaskModal from './components/TaskModal.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [assignee, setAssignee] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, task = edit

  useEffect(() => {
    api.list().then(setTasks).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const assignees = useMemo(
    () => [...new Set(tasks.map((t) => t.assignee).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [tasks]
  );

  // If the selected assignee no longer exists (e.g. last task deleted), reset the filter
  useEffect(() => {
    if (assignee && !assignees.includes(assignee)) setAssignee('');
  }, [assignees, assignee]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter(
      (t) => (!q || t.title.toLowerCase().includes(q)) && (!assignee || t.assignee === assignee)
    );
  }, [tasks, query, assignee]);

  const fail = (e) => setError(e.message);

  async function save(data) {
    try {
      if (data.id) {
        const updated = await api.update(data.id, data);
        setTasks((ts) => ts.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await api.create(data);
        setTasks((ts) => [...ts, created]);
      }
      setEditing(null);
      setError('');
    } catch (e) {
      fail(e);
    }
  }

  async function remove(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await api.remove(task.id);
      setTasks((ts) => ts.filter((t) => t.id !== task.id));
      setEditing(null);
    } catch (e) {
      fail(e);
    }
  }

  // Optimistic move: update the UI first, roll back if the server rejects it
  async function move(id, status) {
    const prev = tasks;
    if (prev.find((t) => t.id === id)?.status === status) return;
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await api.update(id, { status });
    } catch (e) {
      setTasks(prev);
      fail(e);
    }
  }

  const filtering = Boolean(query || assignee);

  return (
    <div className="app">
      <header className="topbar">
        <h1>Team board</h1>
        <div className="controls">
          <input
            type="search"
            placeholder="Search by title"
            aria-label="Search tasks by title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select aria-label="Filter by assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
            <option value="">All assignees</option>
            {assignees.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <button className="btn primary" onClick={() => setEditing({})}>New task</button>
        </div>
      </header>

      {error && (
        <div className="banner" role="alert">
          <span>{error}</span>
          <button className="icon" aria-label="Dismiss error" onClick={() => setError('')}>×</button>
        </div>
      )}

      {loading ? (
        <p className="state">Loading your board…</p>
      ) : (
        <main className="board">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={visible.filter((t) => t.status === col.id)}
              filtering={filtering}
              onMove={move}
              onEdit={setEditing}
              onAdd={() => setEditing({ status: col.id })}
            />
          ))}
        </main>
      )}

      {editing && (
        <TaskModal task={editing} onSave={save} onDelete={remove} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
