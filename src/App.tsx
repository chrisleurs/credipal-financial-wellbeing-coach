
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Debts from './pages/Debts'
import Profile from './pages/Profile'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import Plan from './pages/Plan'
import Progress from './pages/Progress'
import Coach from './pages/Coach'

const queryClient = new QueryClient()

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Public Routes */}
            <Route path="/" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAuth>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/expenses"
              element={
                <ProtectedRoute requireAuth>
                  <Expenses />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/debts"
              element={
                <ProtectedRoute requireAuth>
                  <Debts />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute requireAuth>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/plan"
              element={
                <ProtectedRoute requireAuth>
                  <Plan />
                </ProtectedRoute>
              }
            />
            
            {/* New Routes for Bottom Navigation */}
            <Route
              path="/progress"
              element={
                <ProtectedRoute requireAuth>
                  <Progress />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/coach"
              element={
                <ProtectedRoute requireAuth>
                  <Coach />
                </ProtectedRoute>
              }
            />
            
            {/* 404 Route - Redirect to Dashboard */}
            <Route path="*" element={<Auth />} />
          </Routes>
        </QueryClientProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
