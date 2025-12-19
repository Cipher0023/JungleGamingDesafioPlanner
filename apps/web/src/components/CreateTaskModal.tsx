import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { createTaskSchema, type CreateTaskFormData } from '../lib/validations'

interface CreateTaskModalProps {
  accessToken: string
  onTaskCreated: () => void
}

interface User {
  id: string
  username: string
  email: string
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  accessToken,
  onTaskCreated,
}) => {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: '',
      executorId: '',
    },
  })

  // Buscar usuários quando o modal abre
  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Tarefa criada com sucesso!')
        reset()
        setOpen(false)
        onTaskCreated()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erro ao criar tarefa')
      }
    } catch (error) {
      toast.error('Erro ao criar tarefa')
    }
  }

  return (
    <>
      {/* Botão de abrir modal */}
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" />
        Nova Tarefa
      </Button>

      {/* Modal com AnimatePresence e framer-motion */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop com blur e escurecimento */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="z-50 fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Container do modal */}
            <div className="z-50 fixed inset-0 flex justify-center items-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="relative bg-white shadow-2xl rounded-lg w-full max-w-[500px] max-h-[90vh] overflow-y-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="top-0 z-10 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
                  <div>
                    <h2 className="font-bold text-gray-900 text-xl">
                      Criar Nova Tarefa
                    </h2>
                    <p className="mt-1 text-gray-600 text-sm">
                      Preencha os campos abaixo para criar uma nova tarefa
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 p-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Implementar autenticação"
                      {...register('title')}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva a tarefa..."
                      {...register('description')}
                      className="min-h-[100px]"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="executorId">Executor</Label>
                    <select
                      id="executorId"
                      {...register('executorId')}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                    >
                      <option value="">Selecione o executor (opcional)</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username} ({user.email})
                        </option>
                      ))}
                    </select>
                    {errors.executorId && (
                      <p className="text-red-500 text-sm">
                        {errors.executorId.message}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs">
                      Você será definido automaticamente como criador da tarefa
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Prazo</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      {...register('dueDate')}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.dueDate && (
                      <p className="text-red-500 text-sm">
                        {errors.dueDate.message}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs">
                      Data limite para conclusão da tarefa (opcional)
                    </p>
                  </div>

                  <div className="gap-4 grid grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioridade</Label>
                      <select
                        id="priority"
                        {...register('priority')}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                      >
                        <option value="LOW">Baixa</option>
                        <option value="MEDIUM">Média</option>
                        <option value="HIGH">Alta</option>
                        <option value="URGENT">Urgente</option>
                      </select>
                      {errors.priority && (
                        <p className="text-red-500 text-sm">
                          {errors.priority.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        {...register('status')}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                      >
                        <option value="TODO">A Fazer</option>
                        <option value="IN_PROGRESS">Em Andamento</option>
                        <option value="REVIEW">Em Revisão</option>
                        <option value="DONE">Concluído</option>
                      </select>
                      {errors.status && (
                        <p className="text-red-500 text-sm">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer com botões */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
