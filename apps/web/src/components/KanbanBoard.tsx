import React from 'react'
import { TaskCard } from './TaskCard'
import { Circle } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  createdAt: string
  updatedAt?: string
  createdBy: string
  executorId?: string
}

interface KanbanBoardProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  getUsernameById: (userId?: string) => string
  loading?: boolean
}

const STATUS_COLUMNS = [
  {
    id: 'TODO',
    title: 'A Fazer',
    color: 'bg-gray-100 border-gray-300',
    dotColor: 'text-gray-500',
  },
  {
    id: 'IN_PROGRESS',
    title: 'Em Andamento',
    color: 'bg-blue-50 border-blue-300',
    dotColor: 'text-blue-500',
  },
  {
    id: 'REVIEW',
    title: 'Em Revisão',
    color: 'bg-yellow-50 border-yellow-300',
    dotColor: 'text-yellow-500',
  },
  {
    id: 'DONE',
    title: 'Concluído',
    color: 'bg-green-50 border-green-300',
    dotColor: 'text-green-500',
  },
]

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskClick,
  getUsernameById,
  loading,
}) => {
  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  if (loading) {
    return (
      <div className="py-12 text-gray-600 text-center">
        Carregando tarefas...
      </div>
    )
  }

  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {STATUS_COLUMNS.map((column) => {
        const columnTasks = getTasksByStatus(column.id)
        
        return (
          <div key={column.id} className="flex flex-col">
            {/* Column Header */}
            <div className={`${column.color} border rounded-lg p-4 mb-4`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Circle className={`w-3 h-3 fill-current ${column.dotColor}`} />
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                </div>
                <span className="bg-white px-2 py-1 rounded font-medium text-gray-600 text-sm">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Column Tasks */}
            <div className="flex-1 space-y-3 min-h-[200px]">
              {columnTasks.length === 0 ? (
                <div className="py-8 text-gray-400 text-sm text-center">
                  Nenhuma tarefa
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick?.(task)}
                    creatorName={getUsernameById(task.createdBy)}
                    executorName={task.executorId ? getUsernameById(task.executorId) : undefined}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
