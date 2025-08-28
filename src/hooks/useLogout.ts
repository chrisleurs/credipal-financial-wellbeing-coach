
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

export const useLogout = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      console.log('Iniciando logout...')
      
      const { error } = await signOut()
      
      if (error) {
        console.error('Error en logout:', error)
        toast({
          title: "Error al cerrar sesión",
          description: error.message,
          variant: "destructive"
        })
        return
      }

      console.log('Logout exitoso')
      
      // Limpiar localStorage
      localStorage.removeItem('bottomNav_activeTab')
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente"
      })
      
      // Navegar a la página de auth
      navigate('/auth', { replace: true })
      
    } catch (error: any) {
      console.error('Error inesperado en logout:', error)
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al cerrar sesión",
        variant: "destructive"
      })
    }
  }

  return { handleLogout }
}
