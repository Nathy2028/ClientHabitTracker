import type { Habit } from '../types/Habit'
import HabitItem from './HabitItem'

interface HabitListProps {
  habits: Habit[]
  onToggleComplete: (id: string) => void
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
}

function HabitList({ habits, onToggleComplete, onEdit, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <section className="habit-list empty-state" aria-live="polite">
        <span className="empty-icon" aria-hidden="true">○</span>
        <h2>Aún no hay hábitos</h2>
        <p>Añade una rutina arriba para empezar a construir tu día ideal.</p>
      </section>
    )
  }

  return (
    <section className="habit-list" aria-label="Lista de hábitos">
      <div className="list-heading">
        <div><p className="eyebrow">Tu lista</p><h2>Hábitos de hoy</h2></div>
        <span className="habit-count">{habits.length} {habits.length === 1 ? 'hábito' : 'hábitos'}</span>
      </div>
      <div className="habit-items">
        {habits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} onToggleComplete={onToggleComplete} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </section>
  )
}

export default HabitList