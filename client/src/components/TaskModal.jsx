import { useEffect, useState } from 'react';
import { COLUMNS } from '../utils.js';

export default function TaskModal({ task, onSave, onDelete, onClose }) {
  const isEdit = Boolean(task.id);
  const [form, setForm] = useState({
    title: task.title || '',
    description: task.description || '',
    assignee: task.assignee || '',
    dueDate: task.dueDate || '',
    status: task.status || 'todo',
  });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const titleMissing = !form.title.trim();

  function submit(e) {
    e.preventDefault();
    setTouched(true);
    if (titleMissing) return;
    onSave({ ...form, title: form.title.trim(), id: task.id });
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">{isEdit ? 'Edit task' : 'New task'}</h2>

        <label>
          Title
          <input autoFocus value={form.title} onChange={set('title')} maxLength={120} aria-invalid={touched && titleMissing} />
          {touched && titleMissing && <span className="field-error">Give the task a title.</span>}
        </label>

        <label>
          Description
          <textarea rows={3} value={form.description} onChange={set('description')} maxLength={1000} />
        </label>

        <div className="row">
          <label>
            Assignee
            <input value={form.assignee} onChange={set('assignee')} maxLength={60} placeholder="e.g. Priya" />
          </label>
          <label>
            Due date
            <input type="date" value={form.dueDate} onChange={set('dueDate')} />
          </label>
        </div>

        <label>
          Status
          <select value={form.status} onChange={set('status')}>
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </label>

        <div className="actions">
          {isEdit && (
            <button type="button" className="btn danger" onClick={() => onDelete(task)}>Delete</button>
          )}
          <span className="spacer" />
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">{isEdit ? 'Save changes' : 'Create task'}</button>
        </div>
      </form>
    </div>
  );
}
