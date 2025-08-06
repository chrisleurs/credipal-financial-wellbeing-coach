
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Circle, ArrowRight } from 'lucide-react'
import type { FinancialJourney } from '@/types/financialPlan'

interface JourneyProgressProps {
  journey: FinancialJourney
}

export const JourneyProgress: React.FC<JourneyProgressProps> = ({ journey }) => {
  const getStepIcon = (status: string, index: number) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'in_progress':
        return (
          <div className="relative">
            <Circle className="h-6 w-6 text-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        )
      default:
        return <Circle className="h-6 w-6 text-muted-foreground" />
    }
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          Tu Camino Financiero
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between relative">
          {journey.steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 z-10 bg-background p-3 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="text-xl">{step.emoji}</span>
                  {getStepIcon(step.status, index)}
                </div>
                <span className={`text-xs font-medium ${
                  step.status === 'completed' ? 'text-green-600' :
                  step.status === 'in_progress' ? 'text-primary' :
                  'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
              
              {index < journey.steps.length - 1 && (
                <div className="flex-1 flex items-center justify-center px-2">
                  <ArrowRight className={`h-4 w-4 ${
                    index < journey.currentStep ? 'text-green-500' : 'text-muted-foreground'
                  }`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
