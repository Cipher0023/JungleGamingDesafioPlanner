import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  createdAt: string
}

export const TasksPage = () => {
  const { user, accessToken, logout } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (!accessToken) navigate({ to: '/login' })
    fetchTasks()
  }, [accessToken])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/tasks?page=1&size=10`, {
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

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, description, priority }),
      })

      if (response.ok) {
        toast.success('Tarefa criada!')
        setTitle('')
        setDescription('')
        fetchTasks()
      }
    } catch (error) {
      toast.error('Erro ao criar tarefa')
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="flex justify-between items-center mx-auto px-4 py-4 max-w-6xl">
          <h1 className="font-bold text-2xl">Tarefas</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">{user?.username}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 py-8 max-w-6xl">
        {/* Create Task Form */}
        <div className="bg-white shadow mb-8 p-6 rounded-lg">
          <h2 className="mb-4 font-semibold text-xl">Nova Tarefa</h2>
          <form onSubmit={createTask} className="space-y-4">
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg w-full"
              required
            />
            <textarea
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg w-full"
              rows={3}
              required
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg w-full"
            >
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
              <option>URGENT</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg w-full text-white"
            >
              Criar Tarefa
            </button>
          </form>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-8 text-center">Carregando...</div>
          ) : tasks.length === 0 ? (
            <div className="py-8 text-gray-500 text-center">Nenhuma tarefa</div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white shadow hover:shadow-lg p-6 rounded-lg transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${task.priority === 'URGENT' ? 'bg-red-100 text-red-700' : task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="mb-2 text-gray-600">
                  {task.description.substring(0, 100)}...
                </p>
                <div className="flex justify-between items-center text-gray-500 text-sm">
                  <span>Status: {task.status}</span>
                  <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
