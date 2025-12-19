import { z } from 'zod'

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Schema de validação para registro
 */
export const registerSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  username: z
    .string()
    .min(3, 'Username deve ter no mínimo 3 caracteres')
    .max(50, 'Username deve ter no máximo 50 caracteres')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username só pode conter letras, números, _ e -',
    ),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa'),
})

export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * Schema de validação para criação de tarefa
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(255, 'Título muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    errorMap: () => ({ message: 'Prioridade inválida' }),
  }),
  status: z
    .enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'], {
      errorMap: () => ({ message: 'Status inválido' }),
    })
    .optional(),
  dueDate: z
    .string()
    .refine((date) => {
      if (!date) return true // opcional
      const parsed = new Date(date)
      return !isNaN(parsed.getTime())
    }, 'Data inválida')
    .optional(),
  executorId: z.string().uuid('ID de executor inválido').optional(),
})

export type CreateTaskFormData = z.infer<typeof createTaskSchema>
