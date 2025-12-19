import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useUsers } from '../hooks/useUsers'
import { PriorityColumn } from '../components/PriorityColumn'
import { CreateTaskModal } from '../components/CreateTaskModal'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Search, Filter, LogOut } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

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

function Dashboard() {
  const { user, accessToken, logout } = useAuth()
  const navigate = useNavigate()
  const { getUsernameById } = useUsers(accessToken)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (!accessToken) {
      navigate({ to: '/login' })
      return
    }
    fetchTasks()
  }, [accessToken])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/tasks?page=1&size=100`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(data.data || [])
      } else {
        toast.error('Erro ao carregar tarefas')
      }
    } catch (error) {
      toast.error('Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar tarefas
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Organizar tarefas por prioridade
  const tasksByPriority = {
    LOW: filteredTasks.filter((task) => task.priority === 'LOW'),
    MEDIUM: filteredTasks.filter((task) => task.priority === 'MEDIUM'),
    HIGH: filteredTasks.filter((task) => task.priority === 'HIGH'),
    URGENT: filteredTasks.filter((task) => task.priority === 'URGENT'),
  }

  const handleTaskClick = (task: Task) => {
    // TODO: Navegar para detalhes da tarefa
    toast.info(`Detalhes da tarefa: ${task.title}`)
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 py-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-gray-900 text-2xl">
                Sistema de Gestão de Tarefas
              </h1>
              <p className="mt-1 text-gray-600 text-sm">
                Bem-vindo, {user.username}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CreateTaskModal
                accessToken={accessToken!}
                onTaskCreated={fetchTasks}
              />
              <Button variant="outline" onClick={logout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="mx-auto px-4 py-6 max-w-7xl">
        <div className="bg-white shadow-sm mb-6 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
              <Input
                type="text"
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="ALL">Todos Status</option>
                <option value="TODO">A Fazer</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="REVIEW">Em Revisão</option>
                <option value="DONE">Concluído</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="gap-4 grid grid-cols-4 mb-6">
          <div className="bg-white shadow-sm p-4 rounded-lg">
            <div className="text-gray-600 text-sm">Total de Tarefas</div>
            <div className="mt-1 font-bold text-gray-900 text-2xl">
              {filteredTasks.length}
            </div>
          </div>
          <div className="bg-blue-50 shadow-sm p-4 rounded-lg">
            <div className="text-blue-600 text-sm">Baixa Prioridade</div>
            <div className="mt-1 font-bold text-blue-700 text-2xl">
              {tasksByPriority.LOW.length}
            </div>
          </div>
          <div className="bg-green-50 shadow-sm p-4 rounded-lg">
            <div className="text-green-600 text-sm">Média Prioridade</div>
            <div className="mt-1 font-bold text-green-700 text-2xl">
              {tasksByPriority.MEDIUM.length}
            </div>
          </div>
          <div className="bg-orange-50 shadow-sm p-4 rounded-lg">
            <div className="text-orange-600 text-sm">Alta Prioridade</div>
            <div className="mt-1 font-bold text-orange-700 text-2xl">
              {tasksByPriority.HIGH.length}
            </div>
          </div>
          <div className="col-span-4 bg-red-50 shadow-sm p-4 rounded-lg">
            <div className="text-red-600 text-sm">Urgente</div>
            <div className="mt-1 font-bold text-red-700 text-2xl">
              {tasksByPriority.URGENT.length}
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block border-blue-600 border-b-2 rounded-full w-8 h-8 animate-spin"></div>
            <p className="mt-2 text-gray-600">Carregando tarefas...</p>
          </div>
        ) : (
          <div className="gap-4 grid grid-cols-4">
            <PriorityColumn
              priority="LOW"
              tasks={tasksByPriority.LOW}
              onTaskClick={handleTaskClick}
              getUsernameById={getUsernameById}
            />
            <PriorityColumn
              priority="MEDIUM"
              tasks={tasksByPriority.MEDIUM}
              onTaskClick={handleTaskClick}
              getUsernameById={getUsernameById}
            />
            <PriorityColumn
              priority="HIGH"
              tasks={tasksByPriority.HIGH}
              onTaskClick={handleTaskClick}
              getUsernameById={getUsernameById}
            />
            <PriorityColumn
              priority="URGENT"
              tasks={tasksByPriority.URGENT}
              onTaskClick={handleTaskClick}
              getUsernameById={getUsernameById}
            />
          </div>
        )}
      </div>
    </div>
  )
}
