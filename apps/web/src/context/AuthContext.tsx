import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  user: any | null
  accessToken: string | null
  refreshToken: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem('accessToken'),
  )
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem('refreshToken'),
  )

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  const login = async (email: string, password: string) => {
    try {
      console.log('Login: fazendo requisição para', `${apiUrl}/auth/login`)
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      console.log('Login: status da resposta', response.status)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `Login failed: ${response.status}`)
      }

      const data = await response.json()
      console.log('Login: dados recebidos', data)
      
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setUser(data.user)
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      console.error('Login: erro capturado', error)
      throw error
    }
  }

  const register = async (
    email: string,
    username: string,
    password: string,
  ) => {
    try {
      console.log('Register: fazendo requisição para', `${apiUrl}/auth/register`)
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })

      console.log('Register: status da resposta', response.status)

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `Registration failed: ${response.status}`)
      }

      const data = await response.json()
      console.log('Register: dados recebidos', data)
      
      // Login automaticamente após registro
      await login(email, password)
    } catch (error) {
      console.error('Register: erro capturado', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
