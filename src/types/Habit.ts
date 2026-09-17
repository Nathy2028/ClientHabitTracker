export interface Habit {
  id: string
  name: string
  description: string
  completed: boolean
}

export interface HabitInput {
  name: string
  description: string
}