import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from '../lib/validations'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, register } = useAuth()

  // Login form with react-hook-form + zod
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors, isSubmitting: loginLoading },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Register form with react-hook-form + zod
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors, isSubmitting: registerLoading },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      toast.success('Login realizado com sucesso!')
      navigate({ to: '/tasks' })
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login')
    }
  }

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.email, data.username, data.password)
      toast.success('Conta criada! Você já está logado')
      navigate({ to: '/tasks' })
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta')
    }
  }

  return (
    <div className="flex justify-center items-center bg-gray-50 p-4 min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Task Manager</CardTitle>
          <CardDescription>
            Gerencie suas tarefas de forma colaborativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form
                onSubmit={handleSubmitLogin(onLoginSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    {...registerLogin('email')}
                  />
                  {loginErrors.email && (
                    <p className="text-red-500 text-sm">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    {...registerLogin('password')}
                  />
                  {loginErrors.password && (
                    <p className="text-red-500 text-sm">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginLoading}
                >
                  {loginLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form
                onSubmit={handleSubmitRegister(onRegisterSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    {...registerRegister('email')}
                  />
                  {registerErrors.email && (
                    <p className="text-red-500 text-sm">
                      {registerErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    placeholder="seu_usuario"
                    {...registerRegister('username')}
                  />
                  {registerErrors.username && (
                    <p className="text-red-500 text-sm">
                      {registerErrors.username.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    {...registerRegister('password')}
                  />
                  {registerErrors.password && (
                    <p className="text-red-500 text-sm">
                      {registerErrors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerLoading}
                >
                  {registerLoading ? 'Criando...' : 'Criar Conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
