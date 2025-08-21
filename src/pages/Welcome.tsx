
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Heart, 
  Target,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle,
  Zap,
  Shield,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const benefits = [
    {
      icon: Brain,
      title: "Coach Personal 24/7",
      description: "Tu asistente inteligente que nunca duerme, siempre disponible para guiarte hacia tus metas financieras."
    },
    {
      icon: TrendingUp,
      title: "Seguimiento Inteligente",
      description: "Monitorea automáticamente tu progreso y te alerta sobre oportunidades de mejora en tiempo real."
    },
    {
      icon: Heart,
      title: "Motivación Constante",
      description: "Te impulsa día a día con recordatorios personalizados y celebra cada logro contigo."
    },
    {
      icon: Target,
      title: "Estrategias Personalizadas",
      description: "Planes financieros únicos adaptados a tu situación, objetivos y estilo de vida."
    }
  ];

  const howItHelps = [
    {
      step: "01",
      title: "Planificación Inteligente",
      description: "Analizamos tu situación financiera y creamos un plan personalizado para alcanzar tus metas.",
      icon: Target
    },
    {
      step: "02",
      title: "Seguimiento en Tiempo Real",
      description: "Monitoreamos tus avances automáticamente y ajustamos las estrategias según sea necesario.",
      icon: TrendingUp
    },
    {
      step: "03",
      title: "Motivación y Coaching",
      description: "Te acompañamos con motivación constante, consejos personalizados y celebramos tus logros.",
      icon: Heart
    },
    {
      step: "04",
      title: "Crecimiento Financiero",
      description: "Te guiamos paso a paso hacia la libertad financiera y el bienestar económico que buscas.",
      icon: Zap
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Emprendedora",
      rating: 5,
      comment: "Credipal cambió mi vida financiera. Su motivación diaria y seguimiento personalizado me ayudaron a salir de deudas en 8 meses."
    },
    {
      name: "Carlos Rodríguez",
      role: "Profesionista",
      rating: 5,
      comment: "Es como tener un coach financiero personal. Me mantiene enfocado en mis metas y celebra cada pequeño avance conmigo."
    },
    {
      name: "Ana Martínez",
      role: "Madre de Familia",
      rating: 5,
      comment: "La motivación constante de Credipal me dio la confianza para tomar control de mis finanzas. Ahora tengo un fondo de emergencia."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-Optimized Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-primary">Credipal</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <a href="#beneficios" className="text-gray-600 hover:text-primary transition-colors text-sm">Beneficios</a>
            <a href="#como-ayuda" className="text-gray-600 hover:text-primary transition-colors text-sm">Cómo Te Ayuda</a>
            <a href="#testimonios" className="text-gray-600 hover:text-primary transition-colors text-sm">Testimonios</a>
            <a href="#contacto" className="text-gray-600 hover:text-primary transition-colors text-sm">Contacto</a>
          </nav>

          {/* Mobile & Desktop Actions */}
          <div className="flex items-center gap-2">
            <LanguageToggle variant="dashboard" />
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Desktop Login Button */}
            <Button onClick={handleLogin} className="hidden sm:flex bg-primary hover:bg-primary/90 text-sm px-4 py-2">
              Iniciar Sesión
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#beneficios" 
                className="text-gray-600 hover:text-primary transition-colors py-2 border-b border-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beneficios
              </a>
              <a 
                href="#como-ayuda" 
                className="text-gray-600 hover:text-primary transition-colors py-2 border-b border-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cómo Te Ayuda
              </a>
              <a 
                href="#testimonios" 
                className="text-gray-600 hover:text-primary transition-colors py-2 border-b border-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonios
              </a>
              <a 
                href="#contacto" 
                className="text-gray-600 hover:text-primary transition-colors py-2 border-b border-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </a>
              <Button 
                onClick={handleLogin} 
                className="bg-primary hover:bg-primary/90 w-full mt-4"
              >
                Iniciar Sesión
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Mobile-First Hero Section */}
      <section className="pt-20 pb-12 md:pb-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mr-3 md:mr-4">
                <Brain className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-primary">Credipal</span>
              </h1>
            </div>
            
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 md:mb-6 px-2">
              Tu Coach de Bienestar Financiero Personal
            </h2>
            
            <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
              Te acompañamos en cada paso hacia tu libertad financiera con seguimiento inteligente, 
              motivación constante y estrategias personalizadas. No solo administramos tu dinero, 
              <strong> te acompañamos en tu crecimiento financiero.</strong>
            </p>
            
            <div className="flex flex-col gap-3 md:gap-4 items-center mb-8 md:mb-12 px-4">
              <Button 
                onClick={handleGetStarted} 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Comenzar Mi Transformación Financiera
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl transition-all duration-300"
              >
                Conocer Más
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 text-center px-4">
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm md:text-base text-gray-600">Coach Personal</div>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-secondary mb-2">100%</div>
                <div className="text-sm md:text-base text-gray-600">Personalizado</div>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm md:text-base text-gray-600">Motivación Constante</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Credipal Section - Mobile Optimized */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8 px-2">
              ¿Qué es Credipal?
            </h2>
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg mx-2 md:mx-0">
              <p className="text-base md:text-xl text-gray-700 mb-4 md:mb-6 leading-relaxed">
                <strong>Credipal es más que una aplicación financiera</strong> - es tu compañero personal 
                en el viaje hacia la libertad económica. Combinamos inteligencia artificial con coaching 
                humano para transformar la ansiedad financiera en confianza y control sobre tu futuro.
              </p>
              <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-2 md:gap-4 text-xs md:text-sm">
                <span className="bg-primary/10 text-primary px-3 py-2 rounded-full font-medium">
                  🎯 Coach Personal
                </span>
                <span className="bg-secondary/10 text-secondary px-3 py-2 rounded-full font-medium">
                  📊 Seguimiento Inteligente
                </span>
                <span className="bg-primary/10 text-primary px-3 py-2 rounded-full font-medium">
                  💪 Motivación Diaria
                </span>
                <span className="bg-secondary/10 text-secondary px-3 py-2 rounded-full font-medium">
                  🚀 Crecimiento Sostenible
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Mobile Grid */}
      <section id="beneficios" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-2">
              ¿Por qué elegir Credipal como tu coach financiero?
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              El primer asistente financiero que actúa como tu coach personal, 
              motivándote día a día hacia tus metas económicas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300 bg-gray-50 sm:bg-transparent rounded-2xl p-4 sm:p-0">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:shadow-lg transition-shadow duration-300">
                  <benefit.icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">{benefit.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Credipal Helps Section - Mobile Cards */}
      <section id="como-ayuda" className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-2">
              Cómo te ayuda Credipal
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Nuestro enfoque integral te acompaña desde la planificación hasta el logro 
              de tu libertad financiera, paso a paso.
            </p>
          </div>

          <div className="max-w-5xl mx-auto px-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              {howItHelps.map((step, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                        <step.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-xs md:text-sm font-bold text-secondary mb-2">{step.step}</div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">{step.title}</h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Mobile Swipeable */}
      <section id="testimonios" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-2">
              Historias de transformación
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Miles de personas han transformado su bienestar financiero con Credipal. 
              Estas son algunas de sus historias.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto px-2">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-3 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4 italic leading-relaxed">"{testimonial.comment}"</p>
                <div className="border-t pt-3 md:pt-4">
                  <div className="font-semibold text-sm md:text-base text-gray-900">{testimonial.name}</div>
                  <div className="text-xs md:text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-Optimized CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 px-2">
              Comienza tu transformación financiera hoy
            </h2>
            <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90 px-2">
              Únete a miles de personas que ya han tomado control de su bienestar financiero 
              con Credipal. Tu coach personal te está esperando.
            </p>
            <div className="flex flex-col gap-4 items-center mb-6 md:mb-8 px-4">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-primary hover:bg-gray-50 w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Comenzar Ahora - Es Gratis
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 text-xs md:text-sm text-white/80 px-4">
              <span className="flex items-center justify-center gap-2 p-2">
                <CheckCircle className="h-4 w-4" />
                Sin compromisos
              </span>
              <span className="flex items-center justify-center gap-2 p-2">
                <Heart className="h-4 w-4" />
                Coach personal incluido
              </span>
              <span className="flex items-center justify-center gap-2 p-2">
                <Shield className="h-4 w-4" />
                100% seguro y confidencial
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Contact Section */}
      <section id="contacto" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-2">
                ¿Tienes preguntas sobre tu bienestar financiero?
              </h2>
              <p className="text-base md:text-xl text-gray-600 px-2">
                Nuestro equipo está aquí para ayudarte. Contáctanos y comienza tu transformación.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 px-2">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-primary mr-3 md:mr-4 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm md:text-base">Chat en Vivo</div>
                      <div className="text-xs md:text-sm text-gray-600">Disponible 24/7 en la app</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary mr-3 md:mr-4 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm md:text-base">Teléfono</div>
                      <div className="text-xs md:text-sm text-gray-600">01 800 123 4567</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <Mail className="h-5 w-5 md:h-6 md:w-6 text-primary mr-3 md:mr-4 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm md:text-base">Email</div>
                      <div className="text-xs md:text-sm text-gray-600">hola@credipal.com</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary mr-3 md:mr-4 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm md:text-base">Oficinas</div>
                      <div className="text-xs md:text-sm text-gray-600">Ciudad de México, México</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Envíanos un Mensaje</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Input placeholder="Nombre" className="h-12" />
                    <Input placeholder="Email" type="email" className="h-12" />
                  </div>
                  <Input placeholder="Teléfono" className="h-12" />
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={4}
                    placeholder="¿Cómo podemos ayudarte con tu bienestar financiero?"
                  ></textarea>
                  <Button className="w-full bg-primary hover:bg-primary/90 h-12">
                    Enviar Mensaje
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div className="md:col-span-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-3 md:mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl md:text-2xl font-bold">Credipal</span>
              </div>
              <p className="text-gray-400 mb-4 text-sm md:text-base max-w-md mx-auto md:mx-0">
                Tu coach de bienestar financiero personal. Te acompañamos hacia la libertad económica 
                con motivación constante y estrategias personalizadas.
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                <Facebook className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Servicios</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Coach Financiero Personal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seguimiento Inteligente</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Planificación Personalizada</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Motivación y Acompañamiento</a></li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Condusef</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Unidad Especializada</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-xs md:text-sm">
            <p>&copy; 2024 Credipal. Todos los derechos reservados. Tu coach de bienestar financiero.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
