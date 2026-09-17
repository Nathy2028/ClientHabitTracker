import type { Habit, HabitInput } from '../types/Habit'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
type HabitUpdate = HabitInput & Partial<Pick<Habit, 'completed'>>

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(body?.message || 'No se pudo completar la solicitud')
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export function getHabits(): Promise<Habit[]> {
  return request<Habit[]>('/habits')
}

export function createHabit(habit: HabitInput): Promise<Habit> {
  return request<Habit>('/habits', {
    method: 'POST',
    body: JSON.stringify(habit),
  })
}

export function updateHabit(id: string, habit: HabitUpdate): Promise<Habit> {
  return request<Habit>(`/habits/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(habit),
  })
}

export function toggleHabit(id: string, completed: boolean): Promise<Habit> {
  return request<Habit>(`/habits/${id}/toggle`, {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
  })
}

export function deleteHabit(id: string): Promise<void> {
  return request<void>(`/habits/${id}`, { method: 'DELETE' })
}
