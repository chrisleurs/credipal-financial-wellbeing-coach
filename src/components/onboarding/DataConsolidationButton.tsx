
import React from 'react'
import { Button } from '@/components/ui/button'
import { useOptimizedOnboardingConsolidation } from '@/hooks/useOptimizedOnboardingConsolidation'
import { useToast } from '@/hooks/use-toast'
import { Database, RefreshCw } from 'lucide-react'

export const DataConsolidationButton = () => {
  const { consolidateData, isConsolidating } = useOptimizedOnboardingConsolidation()
  const { toast } = useToast()

  const handleConsolidate = async () => {
    try {
      console.log('🚀 Manual data consolidation started...')
      
      toast({
        title: "Iniciando consolidación",
        description: "Migrando datos del onboarding a las tablas principales..."
      })
      
      await consolidateData(false) // Don't mark as completed, just migrate data
      
      console.log('✅ Manual data consolidation completed')
      
      toast({
        title: "¡Consolidación completada!",
        description: "Los datos han sido migrados exitosamente a las tablas principales."
      })
      
      // Refresh page after consolidation to see updated data
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
    } catch (error) {
      console.error('❌ Manual consolidation error:', error)
      
      toast({
        title: "Error en consolidación",
        description: "Hubo un problema al migrar los datos. Revisa la consola para más detalles.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Database className="h-5 w-5 text-yellow-600" />
        <h3 className="font-semibold text-yellow-800">Consolidación de Datos Pendiente</h3>
      </div>
      
      <p className="text-yellow-700 text-sm mb-4">
        Detectamos que completaste el onboarding pero los datos aún no se han migrado 
        a las tablas principales. Esto puede afectar los cálculos y reportes.
      </p>
      
      <Button 
        onClick={handleConsolidate}
        disabled={isConsolidating}
        className="bg-yellow-600 hover:bg-yellow-700 text-white"
      >
        {isConsolidating ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Consolidando...
          </>
        ) : (
          <>
            <Database className="h-4 w-4 mr-2" />
            Consolidar Datos Ahora
          </>
        )}
      </Button>
    </div>
  )
}
