import type { Habit } from '../types/Habit'

interface HabitItemProps {
  habit: Habit
  onToggleComplete: (id: string) => void
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
}

function HabitItem({ habit, onToggleComplete, onEdit, onDelete }: HabitItemProps) {
  return (
    <article className={`habit-item${habit.completed ? ' is-completed' : ''}`}>
      <button
        className="check-button"
        type="button"
        onClick={() => onToggleComplete(habit.id)}
        aria-label={`${habit.completed ? 'Marcar como pendiente' : 'Marcar como completado'}: ${habit.name}`}
        aria-pressed={habit.completed}
      >
        {habit.completed ? '✓' : ''}
      </button>
      <div className="habit-content">
        <div className="habit-title-row">
          <h3>{habit.name}</h3>
          <span className="status-label">{habit.completed ? 'Completado' : 'Pendiente'}</span>
        </div>
        {habit.description && <p>{habit.description}</p>}
      </div>
      <div className="habit-actions">
        <button className="icon-button" type="button" onClick={() => onEdit(habit)}>Editar</button>
        <button className="icon-button danger" type="button" onClick={() => onDelete(habit.id)}>Eliminar</button>
      </div>
    </article>
  )
}

export default HabitItem