import { useEffect, useState } from 'react'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import './App.css'
import type { Habit, HabitInput } from './types/Habit'
import { createHabit, deleteHabit, getHabits, toggleHabit, updateHabit } from './services/habitsApi'

type PendingAction = 'create' | 'update' | 'toggle' | 'delete' | null
type Feedback = { type: 'success' | 'error'; message: string }

function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [pendingHabitId, setPendingHabitId] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setLoadError('')
    getHabits()
      .then((loadedHabits) => setHabits(loadedHabits))
      .catch((loadError: unknown) => setLoadError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los hábitos.'))
      .finally(() => setIsLoading(false))
  }, [reloadKey])

  async function handleSaveHabit(habitInput: HabitInput): Promise<void> {
    const editingHabit = habitToEdit
    setFeedback(null)
    setPendingAction(editingHabit ? 'update' : 'create')
    setPendingHabitId(editingHabit?.id ?? null)
    try {
      if (editingHabit) {
        const updatedHabit = await updateHabit(editingHabit.id, { ...habitInput, completed: editingHabit.completed })
        setHabits((currentHabits) => currentHabits.map((habit) => habit.id === updatedHabit.id ? updatedHabit : habit))
        setHabitToEdit(null)
        setFeedback({ type: 'success', message: 'Hábito editado con éxito.' })
        return
      }
      const newHabit = await createHabit(habitInput)
      setHabits((currentHabits) => [newHabit, ...currentHabits])
      setFeedback({ type: 'success', message: 'Hábito creado correctamente.' })
    } catch (saveError: unknown) {
      setFeedback({ type: 'error', message: saveError instanceof Error ? saveError.message : editingHabit ? 'No se pudo actualizar el hábito.' : 'No se pudo crear el hábito.' })
      throw saveError
    } finally {
      setPendingAction(null)
      setPendingHabitId(null)
    }
  }

  async function handleToggleComplete(id: string): Promise<void> {
    const habit = habits.find((currentHabit) => currentHabit.id === id)
    if (!habit) return
    setFeedback(null)
    setPendingAction('toggle')
    setPendingHabitId(id)
    try {
      const updatedHabit = await toggleHabit(id, !habit.completed)
      setHabits((currentHabits) => currentHabits.map((currentHabit) => currentHabit.id === updatedHabit.id ? updatedHabit : currentHabit))
      setFeedback({ type: 'success', message: updatedHabit.completed ? 'Hábito completado.' : 'Hábito marcado como pendiente.' })
    } catch (toggleError: unknown) {
      setFeedback({ type: 'error', message: toggleError instanceof Error ? toggleError.message : 'No se pudo actualizar el hábito.' })
      throw toggleError
    } finally {
      setPendingAction(null)
      setPendingHabitId(null)
    }
  }

  async function handleDelete(id: string): Promise<void> {
    setFeedback(null)
    setPendingAction('delete')
    setPendingHabitId(id)
    try {
      await deleteHabit(id)
      setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== id))
      if (habitToEdit?.id === id) setHabitToEdit(null)
      setFeedback({ type: 'success', message: 'Hábito eliminado con éxito.' })
    } catch (deleteError: unknown) {
      setFeedback({ type: 'error', message: deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar el hábito.' })
      throw deleteError
    } finally {
      setPendingAction(null)
      setPendingHabitId(null)
    }
  }

  const isMutating = pendingAction !== null

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
      {feedback && <p role={feedback.type === 'error' ? 'alert' : 'status'} aria-live="polite" className={`form-${feedback.type}`}>{feedback.message}</p>}
      <div className="dashboard-grid">
        <HabitForm habitToEdit={habitToEdit} onSubmit={handleSaveHabit} onCancelEdit={() => setHabitToEdit(null)} disabled={isMutating} />
        {isLoading ? <section className="habit-list"><p role="status">Cargando hábitos...</p></section> : loadError ? (
          <section className="habit-list empty-state">
            <p role="alert" className="form-error">{loadError}</p>
            <button className="button button-primary" type="button" onClick={() => setReloadKey((currentKey) => currentKey + 1)}>Reintentar</button>
          </section>
        ) : <HabitList habits={habits} onToggleComplete={handleToggleComplete} onEdit={setHabitToEdit} onDelete={handleDelete} disabled={isMutating} pendingAction={pendingAction} pendingHabitId={pendingHabitId} />}
      </div>
    </main>
  )
}

export default App
