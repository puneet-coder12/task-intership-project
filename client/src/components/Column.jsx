import { useState } from 'react';
import TaskCard from './TaskCard.jsx';
import { COLUMNS } from '../utils.js';

export default function Column({ column, tasks, filtering, onMove, onEdit, onAdd }) {
  const [over, setOver] = useState(false);
  const index = COLUMNS.findIndex((c) => c.id === column.id);

  return (
    <section
      className={`column ${column.id} ${over ? 'over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(false); }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onMove(e.dataTransfer.getData('text/plain'), column.id);
      }}
    >
      <div className="column-head">
        <span className="dot" />
        <h2>{column.label}</h2>
        <span className="count">{tasks.length}</span>
        <button className="icon" aria-label={`Add task to ${column.label}`} onClick={onAdd}>+</button>
      </div>

      <div className="cards">
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onEdit={() => onEdit(t)}
            onPrev={index > 0 ? () => onMove(t.id, COLUMNS[index - 1].id) : null}
            onNext={index < COLUMNS.length - 1 ? () => onMove(t.id, COLUMNS[index + 1].id) : null}
            prevLabel={COLUMNS[index - 1]?.label}
            nextLabel={COLUMNS[index + 1]?.label}
          />
        ))}
        {tasks.length === 0 && (
          <p className="empty">{filtering ? 'No tasks match your filters.' : 'Nothing here yet. Add a task or drop one in.'}</p>
        )}
      </div>
    </section>
  );
}
