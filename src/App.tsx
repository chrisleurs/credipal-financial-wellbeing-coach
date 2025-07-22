
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Welcome } from '@/pages/Welcome'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import Plan from '@/pages/Plan'
import Dashboard from '@/pages/Dashboard'
import Expenses from '@/pages/Expenses'
import Debts from '@/pages/Debts'
import Profile from '@/pages/Profile'
import Calendar from '@/pages/Calendar'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'

// Create QueryClient with proper error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  console.log('App component rendering')
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/onboarding" 
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/expenses" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Expenses />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/debts" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Debts />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Profile />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/calendar" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Calendar />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/plan" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Plan />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
              <Sonner />
            </div>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
