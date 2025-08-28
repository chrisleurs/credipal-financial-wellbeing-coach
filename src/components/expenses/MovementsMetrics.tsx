
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { useLanguage } from '@/contexts/LanguageContext'

interface MovementsMetricsProps {
  totalThisMonth: number
  dailyAverage: number
  transactionCount: number
}

export const MovementsMetrics: React.FC<MovementsMetricsProps> = ({
  totalThisMonth,
  dailyAverage,
  transactionCount
}) => {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('this_month')}</p>
              <p className="text-sm font-medium">{formatCurrency(totalThisMonth)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('average')}</p>
              <p className="text-sm font-medium">{formatCurrency(dailyAverage)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('movements')}</p>
              <p className="text-sm font-medium">{transactionCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
