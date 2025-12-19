import React from 'react'
import { TaskCard } from './TaskCard'
import { AlertCircle, AlertTriangle, Info, Zap } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  createdAt: string
  createdBy?: string
  executorId?: string
  assignedUsers?: Array<{ id: string; username: string }>
}

interface PriorityColumnProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  getUsernameById: (userId?: string) => string
}

const PRIORITY_CONFIG = {
  LOW: {
    label: 'Baixa Prioridade',
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    headerColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  MEDIUM: {
    label: 'Prioridade Média',
    icon: AlertCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    headerColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  HIGH: {
    label: 'Alta Prioridade',
    icon: AlertTriangle,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    headerColor: 'bg-orange-100',
    textColor: 'text-orange-700',
  },
  URGENT: {
    label: 'Urgente',
    icon: Zap,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    headerColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
}

export const PriorityColumn: React.FC<PriorityColumnProps> = ({
  priority,
  tasks,
  onTaskClick,
  getUsernameById,
}) => {
  const config = PRIORITY_CONFIG[priority]
  const Icon = config.icon

  // Ordenar tarefas por prazo (mais próximo primeiro)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  return (
    <div className={`flex flex-col rounded-lg border-2 ${config.borderColor} ${config.bgColor} min-h-[500px]`}>
      {/* Header */}
      <div className={`flex items-center gap-2 px-4 py-3 ${config.headerColor} rounded-t-lg`}>
        <Icon className={`w-5 h-5 ${config.textColor}`} />
        <h3 className={`font-semibold ${config.textColor}`}>{config.label}</h3>
        <span className={`ml-auto ${config.textColor} bg-white px-2 py-0.5 rounded-full text-sm font-medium`}>
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex-1 space-y-3 p-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {sortedTasks.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-gray-400 text-sm">
            Nenhuma tarefa
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick?.(task)}
              creatorName={getUsernameById(task.createdBy)}
              executorName={getUsernameById(task.executorId)}
            />
          ))
        )}
      </div>
    </div>
  )
}
