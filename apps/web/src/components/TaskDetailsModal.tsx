import React, { useState, useEffect } from 'react'
import {
  X,
  Calendar,
  User,
  UserCheck,
  Edit,
  Save,
  Trash2,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'

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

interface TaskDetailsModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onUpdate?: () => void
  onDelete?: () => void
  accessToken: string
  users?: Array<{ id: string; username: string }>
}

const STATUS_OPTIONS = [
  {
    value: 'TODO',
    label: 'A Fazer',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  {
    value: 'IN_PROGRESS',
    label: 'Em Andamento',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    value: 'REVIEW',
    label: 'Em Revisão',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  },
  {
    value: 'DONE',
    label: 'Concluído',
    color: 'bg-green-100 text-green-700 border-green-300',
  },
]

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Baixa', color: 'bg-gray-100 text-gray-600' },
  { value: 'MEDIUM', label: 'Média', color: 'bg-blue-100 text-blue-600' },
  { value: 'HIGH', label: 'Alta', color: 'bg-orange-100 text-orange-600' },
  { value: 'URGENT', label: 'Urgente', color: 'bg-red-100 text-red-600' },
]

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  accessToken,
  users = [],
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate || '',
    executorId: task.executorId || '',
  })

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || '',
      executorId: task.executorId || '',
    })
    setIsEditing(false)
  }, [task])

  if (!isOpen) return null

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${apiUrl}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          executorId: formData.executorId || undefined,
          dueDate: formData.dueDate || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || 'Erro ao atualizar tarefa')
      }

      toast.success('Tarefa atualizada com sucesso!')
      setIsEditing(false)
      onUpdate?.()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao atualizar tarefa',
      )
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return

    try {
      setIsDeleting(true)
      const response = await fetch(`${apiUrl}/tasks/${task.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || 'Erro ao excluir tarefa')
      }

      toast.success('Tarefa excluída com sucesso!')
      onDelete?.()
      onClose()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao excluir tarefa',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const creatorUser = users.find((u) => u.id === task.createdBy)
  const executorUser = users.find((u) => u.id === task.executorId)
  const currentStatus = STATUS_OPTIONS.find((s) => s.value === task.status)
  const currentPriority = PRIORITY_OPTIONS.find(
    (p) => p.value === task.priority,
  )

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="top-0 sticky flex justify-between items-start bg-white px-6 py-4 border-b">
          <div className="flex-1 pr-4">
            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border-blue-500 border-b-2 focus:outline-none w-full font-bold text-2xl"
                placeholder="Título da tarefa"
              />
            ) : (
              <h2 className="font-bold text-gray-900 text-2xl">{task.title}</h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 px-6 py-4">
          {/* Status and Priority */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Status
              </label>
              {isEditing ? (
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Task['status'],
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div
                  className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium border ${currentStatus?.color}`}
                >
                  {currentStatus?.label}
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Prioridade
              </label>
              {isEditing ? (
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as Task['priority'],
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div
                  className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${currentPriority?.color}`}
                >
                  {currentPriority?.label}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Descrição
            </label>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-h-[120px]"
                placeholder="Descrição da tarefa"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description}
              </p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium text-gray-700 text-sm">
              <Calendar className="w-4 h-4" />
              Data de Vencimento
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            ) : task.dueDate ? (
              <p className="text-gray-700">
                {new Date(task.dueDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            ) : (
              <p className="text-gray-500 italic">Sem data definida</p>
            )}
          </div>

          {/* Executor */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium text-gray-700 text-sm">
              <UserCheck className="w-4 h-4" />
              Executor
            </label>
            {isEditing ? (
              <select
                value={formData.executorId}
                onChange={(e) =>
                  setFormData({ ...formData, executorId: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Sem executor</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            ) : executorUser ? (
              <p className="text-gray-700">{executorUser.username}</p>
            ) : (
              <p className="text-gray-500 italic">Sem executor atribuído</p>
            )}
          </div>

          {/* Creator */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium text-gray-700 text-sm">
              <User className="w-4 h-4" />
              Criado por
            </label>
            <p className="text-gray-700">
              {creatorUser?.username || 'Desconhecido'}
            </p>
          </div>

          {/* Timestamps */}
          <div className="gap-4 grid grid-cols-2 pt-4 border-t text-gray-600 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-1 text-gray-500">
                <Clock className="w-4 h-4" />
                Criado em
              </div>
              <p>
                {new Date(task.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {task.updatedAt && (
              <div>
                <div className="flex items-center gap-2 mb-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  Atualizado em
                </div>
                <p>
                  {new Date(task.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bottom-0 sticky flex justify-between items-center bg-gray-50 px-6 py-4 border-t">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 hover:bg-red-50 disabled:opacity-50 px-4 py-2 rounded-lg text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      title: task.title,
                      description: task.description,
                      status: task.status,
                      priority: task.priority,
                      dueDate: task.dueDate || '',
                      executorId: task.executorId || '',
                    })
                  }}
                  className="hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
