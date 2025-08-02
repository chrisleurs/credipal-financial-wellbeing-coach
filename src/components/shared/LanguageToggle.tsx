
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface LanguageToggleProps {
  variant?: 'onboarding' | 'dashboard'
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'onboarding' }) => {
  const { language, toggleLanguage } = useLanguage()

  const baseClasses = "flex items-center gap-2 cursor-pointer transition-all duration-200 select-none"
  const variantClasses = {
    onboarding: "absolute top-6 right-6 z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 hover:bg-white/20",
    dashboard: "bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5"
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={toggleLanguage}
    >
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
        language === 'es' 
          ? variant === 'onboarding' ? 'bg-white text-primary' : 'bg-primary text-white'
          : variant === 'onboarding' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'
      }`}>
        <span className="text-sm">🇪🇸</span>
        <span>ES</span>
      </div>
      <div className="w-px h-4 bg-white/30"></div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
        language === 'en' 
          ? variant === 'onboarding' ? 'bg-white text-primary' : 'bg-primary text-white'
          : variant === 'onboarding' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'
      }`}>
        <span className="text-sm">🇺🇸</span>
        <span>EN</span>
      </div>
    </div>
  )
}
