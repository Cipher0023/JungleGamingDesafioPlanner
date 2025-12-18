import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await register(email, username, password)
      toast.success('Cadastro realizado! Faça login.')
      navigate({ to: '/login' })
    } catch (error) {
      toast.error('Falha no cadastro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 min-h-screen">
      <div className="bg-white shadow-2xl p-8 rounded-lg w-full max-w-md">
        <h1 className="mb-6 font-bold text-3xl text-center">Registre-se</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-2 rounded-lg w-full font-semibold text-white"
          >
            {loading ? 'Carregando...' : 'Registrar'}
          </button>
        </form>
        <p className="mt-4 text-gray-600 text-sm text-center">
          Já tem conta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Faça login
          </a>
        </p>
      </div>
    </div>
  )
}
