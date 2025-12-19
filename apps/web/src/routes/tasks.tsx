import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useUsers } from '../hooks/useUsers'
import { useNotifications } from '../hooks/useNotifications'
import { CreateTaskModal } from '../components/CreateTaskModal'
import { TaskCard } from '../components/TaskCard'
import { TaskDetailsModal } from '../components/TaskDetailsModal'
import { TaskFilters } from '../components/TaskFilters'
import { KanbanBoard } from '../components/KanbanBoard'
import { TaskCardSkeleton } from '../components/ui/skeleton'
import { LogOut, LayoutGrid, Columns, Wifi, WifiOff } from 'lucide-react'

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

export const TasksPage = () => {
  const { user, accessToken, logout } = useAuth()
  const navigate = useNavigate()
  const { getUsernameById, users } = useUsers(accessToken)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid')

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showOverdueOnly, setShowOverdueOnly] = useState(false)

  // WebSocket notifications
  const { isConnected } = useNotifications(accessToken, {
    enabled: true,
    onNotification: (notification) => {
      // Refresh tasks when receiving notifications
      if (
        notification.type === 'TASK_CREATED' ||
        notification.type === 'TASK_UPDATED' ||
        notification.type === 'TASK_DELETED'
      ) {
        fetchTasks()
      }
    },
  })

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (!accessToken) navigate({ to: '/login' })
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
        setTasks(data.data)
      }
    } catch (error) {
      toast.error('Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }

  // Filtered tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !task.title.toLowerCase().includes(query) &&
          !task.description.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Status filter
      if (statusFilter && task.status !== statusFilter) {
        return false
      }

      // Priority filter
      if (priorityFilter && task.priority !== priorityFilter) {
        return false
      }

      // Overdue filter
      if (showOverdueOnly) {
        if (!task.dueDate) return false
        const isOverdue =
          new Date(task.dueDate) < new Date() && task.status !== 'DONE'
        if (!isOverdue) return false
      }

      return true
    })
  }, [tasks, searchQuery, statusFilter, priorityFilter, showOverdueOnly])

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== '' ||
    priorityFilter !== '' ||
    showOverdueOnly

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
    setPriorityFilter('')
    setShowOverdueOnly(false)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow border-b">
        <div className="flex justify-between items-center mx-auto px-4 py-4 max-w-6xl">
          <div>
            <h1 className="font-bold text-gray-900 text-2xl">Tarefas</h1>
            <p className="mt-1 text-gray-600 text-sm">
              Bem-vindo, {user?.username}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* WebSocket Connection Status */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                isConnected
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
              title={isConnected ? 'Conectado em tempo real' : 'Desconectado'}
            >
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span className="font-medium">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span className="font-medium">Offline</span>
                </>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="font-medium text-sm">Grade</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Columns className="w-4 h-4" />
                <span className="font-medium text-sm">Kanban</span>
              </button>
            </div>

            <CreateTaskModal
              accessToken={accessToken!}
              onTaskCreated={fetchTasks}
            />
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 py-8 max-w-6xl">
        {/* Filters */}
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          showOverdueOnly={showOverdueOnly}
          onShowOverdueChange={setShowOverdueOnly}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Tasks View */}
        {viewMode === 'kanban' ? (
          <KanbanBoard
            tasks={filteredTasks}
            onTaskClick={setSelectedTask}
            getUsernameById={getUsernameById}
            loading={loading}
          />
        ) : (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Grid de skeletons durante carregamento
              Array.from({ length: 6 }).map((_, index) => (
                <TaskCardSkeleton key={index} />
              ))
            ) : filteredTasks.length === 0 ? (
              <div className="col-span-full py-8 text-gray-500 text-center">
                {hasActiveFilters
                  ? 'Nenhuma tarefa encontrada com os filtros aplicados'
                  : 'Nenhuma tarefa encontrada'}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                  creatorName={getUsernameById(task.createdBy)}
                  executorName={
                    task.executorId
                      ? getUsernameById(task.executorId)
                      : undefined
                  }
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={fetchTasks}
          onDelete={fetchTasks}
          accessToken={accessToken!}
          users={users}
        />
      )}
    </div>
  )
}
