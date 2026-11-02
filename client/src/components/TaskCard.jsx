import { formatDate, initials, isOverdue } from '../utils.js';

export default function TaskCard({ task, onEdit, onPrev, onNext, prevLabel, nextLabel }) {
  const overdue = isOverdue(task);

  return (
    <article
      className={`card ${overdue ? 'overdue' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <button className="card-body" onClick={onEdit} aria-label={`Edit ${task.title}`}>
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
      </button>

      <div className="card-foot">
        <div className="meta">
          {task.assignee && (
            <span className="assignee" title={task.assignee}>
              <span className="avatar">{initials(task.assignee)}</span>
              {task.assignee}
            </span>
          )}
          {task.dueDate && (
            <span className={`due ${overdue ? 'late' : ''}`}>
              {overdue ? 'Overdue since' : 'Due'} {formatDate(task.dueDate)}
            </span>
          )}
        </div>
        <div className="move">
          <button className="icon" disabled={!onPrev} onClick={onPrev} aria-label={prevLabel ? `Move to ${prevLabel}` : 'Move back'}>‹</button>
          <button className="icon" disabled={!onNext} onClick={onNext} aria-label={nextLabel ? `Move to ${nextLabel}` : 'Move forward'}>›</button>
        </div>
      </div>
    </article>
  );
}
