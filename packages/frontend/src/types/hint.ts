import { Task } from "./task"

export interface Hint {
  hint: string
}
export interface HintParams {
  task: Task
  previousHints: Hint[]
}