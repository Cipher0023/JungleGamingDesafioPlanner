import { useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  email: string
}

interface UserCache {
  [userId: string]: User
}

/**
 * Hook para buscar e cachear informações de usuários
 */
export const useUsers = (accessToken: string | null) => {
  const [users, setUsers] = useState<User[]>([])
  const [userCache, setUserCache] = useState<UserCache>({})
  const [loading, setLoading] = useState(false)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (accessToken) {
      fetchUsers()
    }
  }, [accessToken])

  const fetchUsers = async () => {
    if (loading || users.length > 0) return
    
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
        
        // Criar cache para acesso rápido
        const cache: UserCache = {}
        data.forEach((user: User) => {
          cache[user.id] = user
        })
        setUserCache(cache)
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserById = (userId?: string): User | null => {
    if (!userId) return null
    return userCache[userId] || null
  }

  const getUsernameById = (userId?: string): string => {
    const user = getUserById(userId)
    return user?.username || 'Desconhecido'
  }

  return {
    users,
    userCache,
    loading,
    getUserById,
    getUsernameById,
    refetch: fetchUsers,
  }
}
