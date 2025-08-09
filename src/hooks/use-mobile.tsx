
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Función para calcular si es mobile
    const checkIsMobile = () => window.innerWidth < MOBILE_BREAKPOINT
    
    // Establecer valor inicial
    setIsMobile(checkIsMobile())

    // Debounce para evitar cambios constantes
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsMobile(checkIsMobile())
      }, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return !!isMobile
}
