import { TrendingUp, Shield, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import financialHero from '@/assets/financial-hero.jpg';

interface FinancialHeroProps {
  onGetStarted: () => void;
}

export const FinancialHero = ({ onGetStarted }: FinancialHeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={financialHero} 
          alt="Financial wellness background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-wellness-float">
            <span className="bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Credipal
            </span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 text-primary-glow">
            Tu Coach de Bienestar Financiero
          </h2>

          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed text-white/90">
            Transforma tu situación financiera post-préstamo en una oportunidad de crecimiento. 
            Te acompañamos en cada paso hacia tu estabilidad económica.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-financial">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Crecimiento Inteligente</h3>
              <p className="text-sm text-white/80">Estrategias personalizadas para maximizar tu potencial financiero</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-financial">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Protección Financiera</h3>
              <p className="text-sm text-white/80">Construye tu fondo de emergencia y asegura tu futuro</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-financial">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Metas Alcanzables</h3>
              <p className="text-sm text-white/80">Planifica y logra tus objetivos financieros paso a paso</p>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-secondary hover:bg-secondary-light text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-wellness transition-all duration-300 hover:scale-105 animate-financial-pulse"
          >
            Comenzar Mi Transformación Financiera
          </Button>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              100% Seguro y Confidencial
            </span>
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Resultados Comprobados
            </span>
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Estrategias Personalizadas
            </span>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-wellness-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary-light/20 rounded-full blur-xl animate-wellness-float" style={{ animationDelay: '2s' }}></div>
    </section>
  );
};