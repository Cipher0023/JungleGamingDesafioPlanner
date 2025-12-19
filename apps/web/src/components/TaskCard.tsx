import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Calendar, Clock, User, UserCheck } from 'lucide-react'

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
}

interface TaskCardProps {
  task: Task
  onClick?: () => void
  creatorName?: string
  executorName?: string
}

const STATUS_COLORS = {
  TODO: 'bg-gray-100 text-gray-700 border-gray-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-300',
  REVIEW: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  DONE: 'bg-green-100 text-green-700 border-green-300',
}

const STATUS_LABELS = {
  TODO: 'A Fazer',
  IN_PROGRESS: 'Em Andamento',
  REVIEW: 'Em Revisão',
  DONE: 'Concluído',
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick,
  creatorName,
  executorName,
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE'

  return (
    <Card
      className="group hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="font-semibold group-hover:text-blue-600 text-base transition-colors">
            {task.title}
          </CardTitle>
          <Badge className={STATUS_COLORS[task.status]} variant="outline">
            {STATUS_LABELS[task.status]}
          </Badge>
        </div>
        <CardDescription className="mt-1 text-sm line-clamp-2">
          {task.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col gap-2 text-gray-600 text-xs">
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                {isOverdue && ' (Atrasado)'}
              </span>
            </div>
          )}

          {creatorName && (
            <div className="flex items-center gap-1 text-gray-500">
              <User className="w-3.5 h-3.5" />
              <span>Criado por: {creatorName}</span>
            </div>
          )}

          {executorName ? (
            <div className="flex items-center gap-1 text-blue-600">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Executor: {executorName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-500">
              <User className="w-3.5 h-3.5" />
              <span>Sem executor atribuído</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px]">
              {new Date(task.createdAt).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
