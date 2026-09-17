import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Habit, HabitInput } from '../types/Habit'

interface HabitFormProps {
  habitToEdit?: Habit | null
  onSubmit: (habitInput: HabitInput) => void
  onCancelEdit: () => void
}

function HabitForm({ habitToEdit, onSubmit, onCancelEdit }: HabitFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const isEditing = Boolean(habitToEdit)

  useEffect(() => {
    setName(habitToEdit?.name ?? '')
    setDescription(habitToEdit?.description ?? '')
    setError('')
  }, [habitToEdit])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('El nombre es obligatorio.')
      return
    }
    onSubmit({ name: trimmedName, description: description.trim() })
    setName('')
    setDescription('')
    setError('')
  }

  function handleCancel() {
    setName('')
    setDescription('')
    setError('')
    onCancelEdit()
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">{isEditing ? 'Actualizar hábito' : 'Nuevo hábito'}</p>
          <h2>{isEditing ? 'Edita tu hábito' : 'Suma una rutina'}</h2>
        </div>
        <span className="form-mark" aria-hidden="true">+</span>
      </div>
      <label htmlFor="habit-name">Nombre</label>
      <input
        id="habit-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Ej. Leer 20 minutos"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'habit-name-error' : undefined}
      />
      <label htmlFor="habit-description">Descripción <span>(opcional)</span></label>
      <textarea
        id="habit-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="¿Qué quieres conseguir con esta rutina?"
        rows={3}
      />
      {error && <p className="form-error" id="habit-name-error">{error}</p>}
      <div className="form-actions">
        {isEditing && <button className="button button-ghost" type="button" onClick={handleCancel}>Cancelar</button>}
        <button className="button button-primary" type="submit">{isEditing ? 'Guardar cambios' : 'Añadir hábito'}</button>
      </div>
    </form>
  )
}

export default HabitForm