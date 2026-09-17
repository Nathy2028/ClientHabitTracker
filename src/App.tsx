import { useEffect, useState } from 'react'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import './App.css'
import type { Habit, HabitInput } from './types/Habit'
import { createHabit, deleteHabit, getHabits, toggleHabit, updateHabit } from './services/habitsApi'

function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getHabits()
      .then(setHabits)
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los hábitos.'))
      .finally(() => setIsLoading(false))
  }, [])

  async function handleSaveHabit(habitInput: HabitInput) {
    setError('')
    if (habitToEdit) {
      try {
        const updatedHabit = await updateHabit(habitToEdit.id, {
          ...habitInput,
          completed: habitToEdit.completed,
        })
        setHabits((currentHabits) => currentHabits.map((habit) => habit.id === updatedHabit.id ? updatedHabit : habit))
      } catch (saveError: unknown) {
        setError(saveError instanceof Error ? saveError.message : 'No se pudo actualizar el hábito.')
        return
      }
      setHabitToEdit(null)
      return
    }

    try {
      const newHabit = await createHabit(habitInput)
      setHabits((currentHabits) => [newHabit, ...currentHabits])
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo crear el hábito.')
    }
  }

  async function handleToggleComplete(id: string) {
    const habit = habits.find((currentHabit) => currentHabit.id === id)
    if (!habit) return
    setError('')
    try {
      const updatedHabit = await toggleHabit(id, !habit.completed)
      setHabits((currentHabits) => currentHabits.map((currentHabit) => currentHabit.id === updatedHabit.id ? updatedHabit : currentHabit))
    } catch (toggleError: unknown) {
      setError(toggleError instanceof Error ? toggleError.message : 'No se pudo actualizar el hábito.')
    }
  }

  async function handleDelete(id: string) {
    setError('')
    try {
      await deleteHabit(id)
      setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== id))
      if (habitToEdit?.id === id) setHabitToEdit(null)
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar el hábito.')
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">HT</div>
        <div><p className="brand-name">Habit tracker</p><p className="brand-subtitle">Pequeños pasos, grandes cambios.</p></div>
      </header>
      <section className="intro">
        <div>
          <p className="eyebrow">Panel personal</p>
          <h1>Construye un día que se sienta bien.</h1>
          <p className="intro-copy">Organiza tus rutinas y celebra cada avance, por pequeño que sea.</p>
        </div>
        <div className="progress-note"><strong>{habits.filter((habit) => habit.completed).length}/{habits.length}</strong><span>completados hoy</span></div>
      </section>
      {error && <p role="alert" className="form-error">{error}</p>}
      <div className="dashboard-grid">
        <HabitForm habitToEdit={habitToEdit} onSubmit={handleSaveHabit} onCancelEdit={() => setHabitToEdit(null)} />
        {isLoading ? <section className="habit-list"><p>Cargando hábitos...</p></section> : <HabitList habits={habits} onToggleComplete={handleToggleComplete} onEdit={setHabitToEdit} onDelete={handleDelete} />}
      </div>
    </main>
  )
}

export default App
