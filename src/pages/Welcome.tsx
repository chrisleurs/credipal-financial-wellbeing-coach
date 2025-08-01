
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import financialHero from '@/assets/financial-hero.jpg';

export const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

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
            Your Personal Financial Wellness Coach
          </h2>

          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed text-white/90">
            Transform your financial situation into an opportunity for growth. 
            We'll guide you every step of the way to financial stability and success.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-financial">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Growth</h3>
              <p className="text-sm text-white/80">Personalized strategies to maximize your financial potential</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-financial">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Financial Protection</h3>
              <p className="text-sm text-white/80">Build your emergency fund and secure your future</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-financial">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Achievable Goals</h3>
              <p className="text-sm text-white/80">Plan and achieve your financial objectives step by step</p>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-secondary hover:bg-secondary-light text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-wellness transition-all duration-300 hover:scale-105 animate-financial-pulse"
          >
            Start My Financial Journey
          </Button>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              100% Secure & Confidential
            </span>
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Proven Results
            </span>
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Personalized Strategies
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
