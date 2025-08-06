
import React from 'react'
import { AlertTriangle, Database, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DataSourceIndicatorProps {
  dataSource: 'database' | 'onboarding' | 'mock'
  hasRealData: boolean
}

export const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({ 
  dataSource, 
  hasRealData 
}) => {
  const getIndicatorConfig = () => {
    switch (dataSource) {
      case 'database':
        return {
          icon: Database,
          text: 'Datos reales',
          variant: 'default' as const,
          color: 'text-primary'
        }
      case 'onboarding':
        return {
          icon: User,
          text: 'Datos del onboarding',
          variant: 'secondary' as const,
          color: 'text-blue-600'
        }
      case 'mock':
        return {
          icon: AlertTriangle,
          text: 'Datos de ejemplo',
          variant: 'outline' as const,
          color: 'text-amber-600'
        }
    }
  }

  const { icon: Icon, text, variant, color } = getIndicatorConfig()

  if (hasRealData && dataSource !== 'mock') {
    return null // Don't show indicator for real data
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
      <Icon className={`h-5 w-5 ${color}`} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge variant={variant}>{text}</Badge>
          <span className="text-sm text-text-secondary">
            {dataSource === 'mock' 
              ? 'Completa tu información financiera para ver datos reales'
              : 'Datos cargados desde tu perfil'
            }
          </span>
        </div>
      </div>
    </div>
  )
}
