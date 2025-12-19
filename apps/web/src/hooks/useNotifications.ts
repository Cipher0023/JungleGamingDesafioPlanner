import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

interface NotificationPayload {
  type: 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_DELETED' | 'TASK_ASSIGNED'
  message: string
  taskId?: string
  task?: any
  userId?: string
}

interface UseNotificationsOptions {
  enabled?: boolean
  onNotification?: (notification: NotificationPayload) => void
}

/**
 * Hook para gerenciar conexão WebSocket de notificações em tempo real
 */
export const useNotifications = (
  accessToken: string | null,
  options: UseNotificationsOptions = {}
) => {
  const { enabled = true, onNotification } = options
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<NotificationPayload[]>([])

  const notificationsUrl =
    import.meta.env.VITE_NOTIFICATIONS_URL || 'http://localhost:3003'

  useEffect(() => {
    if (!accessToken || !enabled) {
      return
    }

    // Criar conexão WebSocket
    const socket = io(notificationsUrl, {
      auth: {
        token: accessToken,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    // Event handlers
    socket.on('connect', () => {
      console.log('✅ Conectado ao servidor de notificações')
      setIsConnected(true)
      toast.success('Conectado às notificações em tempo real', {
        duration: 2000,
      })
    })

    socket.on('disconnect', () => {
      console.log('❌ Desconectado do servidor de notificações')
      setIsConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('Erro de conexão:', error)
      setIsConnected(false)
    })

    // Listen for task notifications
    socket.on('taskCreated', (data: NotificationPayload) => {
      console.log('📬 Nova tarefa criada:', data)
      setNotifications((prev) => [...prev, data])
      toast.info(data.message, {
        description: 'Uma nova tarefa foi criada',
        duration: 4000,
      })
      onNotification?.(data)
    })

    socket.on('taskUpdated', (data: NotificationPayload) => {
      console.log('📝 Tarefa atualizada:', data)
      setNotifications((prev) => [...prev, data])
      toast.info(data.message, {
        description: 'Uma tarefa foi atualizada',
        duration: 4000,
      })
      onNotification?.(data)
    })

    socket.on('taskDeleted', (data: NotificationPayload) => {
      console.log('🗑️ Tarefa excluída:', data)
      setNotifications((prev) => [...prev, data])
      toast.warning(data.message, {
        description: 'Uma tarefa foi excluída',
        duration: 4000,
      })
      onNotification?.(data)
    })

    socket.on('taskAssigned', (data: NotificationPayload) => {
      console.log('👤 Tarefa atribuída:', data)
      setNotifications((prev) => [...prev, data])
      toast.success(data.message, {
        description: 'Uma tarefa foi atribuída a você',
        duration: 5000,
      })
      onNotification?.(data)
    })

    // Cleanup
    return () => {
      console.log('🔌 Desconectando WebSocket...')
      socket.disconnect()
      socketRef.current = null
    }
  }, [accessToken, enabled, notificationsUrl, onNotification])

  const sendNotification = (eventName: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(eventName, data)
    } else {
      console.warn('WebSocket não está conectado')
    }
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return {
    isConnected,
    notifications,
    clearNotifications,
    sendNotification,
    socket: socketRef.current,
  }
}
