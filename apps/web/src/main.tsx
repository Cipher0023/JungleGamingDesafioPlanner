import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { LoginPage } from './routes/login'
import { TasksPage } from './routes/tasks'
import './styles.css'

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Toaster position="top-right" />
      <Outlet />
    </>
  ),
})

// Index route (redirect to login)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/login' })
  },
  component: () => null,
})

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// Tasks route
const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks',
  component: TasksPage,
})

// Route tree
const routeTree = rootRoute.addChildren([indexRoute, loginRoute, tasksRoute])

// Router
const router = createRouter({ routeTree })

// Type declaration
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Mount app
const rootElement = document.getElementById('app')
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
  )
}

