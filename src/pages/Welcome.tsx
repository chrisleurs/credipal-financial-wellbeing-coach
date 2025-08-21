
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
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-2xl font-bold text-primary">Credipal</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#beneficios" className="text-gray-600 hover:text-primary transition-colors">Beneficios</a>
            <a href="#como-ayuda" className="text-gray-600 hover:text-primary transition-colors">Cómo Te Ayuda</a>
            <a href="#testimonios" className="text-gray-600 hover:text-primary transition-colors">Testimonios</a>
            <a href="#contacto" className="text-gray-600 hover:text-primary transition-colors">Contacto</a>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageToggle variant="dashboard" />
            <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90">
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mr-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-primary">Credipal</span>
              </h1>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Tu Coach de Bienestar Financiero Personal
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Te acompañamos en cada paso hacia tu libertad financiera con seguimiento inteligente, 
              motivación constante y estrategias personalizadas. No solo administramos tu dinero, 
              <strong> te acompañamos en tu crecimiento financiero.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={handleGetStarted} 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Comenzar Mi Transformación Financiera
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                Conocer Más
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-gray-600">Coach Personal</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-secondary mb-2">100%</div>
                <div className="text-gray-600">Personalizado</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-gray-600">Motivación Constante</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Credipal Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              ¿Qué es Credipal?
            </h2>
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                <strong>Credipal es más que una aplicación financiera</strong> - es tu compañero personal 
                en el viaje hacia la libertad económica. Combinamos inteligencia artificial con coaching 
                humano para transformar la ansiedad financiera en confianza y control sobre tu futuro.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
                  🎯 Coach Personal
                </span>
                <span className="bg-secondary/10 text-secondary px-4 py-2 rounded-full font-medium">
                  📊 Seguimiento Inteligente
                </span>
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
                  💪 Motivación Diaria
                </span>
                <span className="bg-secondary/10 text-secondary px-4 py-2 rounded-full font-medium">
                  🚀 Crecimiento Sostenible
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Credipal como tu coach financiero?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              El primer asistente financiero que actúa como tu coach personal, 
              motivándote día a día hacia tus metas económicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow duration-300">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Credipal Helps Section */}
      <section id="como-ayuda" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cómo te ayuda Credipal
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nuestro enfoque integral te acompaña desde la planificación hasta el logro 
              de tu libertad financiera, paso a paso.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {howItHelps.map((step, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-bold text-secondary mb-2">{step.step}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Historias de transformación
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Miles de personas han transformado su bienestar financiero con Credipal. 
              Estas son algunas de sus historias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">"{testimonial.comment}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-6">
              Comienza tu transformación financiera hoy
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a miles de personas que ya han tomado control de su bienestar financiero 
              con Credipal. Tu coach personal te está esperando.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-primary hover:bg-gray-50 px-8 py-4 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Comenzar Ahora - Es Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Sin compromisos
              </span>
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Coach personal incluido
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                100% seguro y confidencial
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                ¿Tienes preguntas sobre tu bienestar financiero?
              </h2>
              <p className="text-xl text-gray-600">
                Nuestro equipo está aquí para ayudarte. Contáctanos y comienza tu transformación.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MessageSquare className="h-6 w-6 text-primary mr-4" />
                    <div>
                      <div className="font-semibold">Chat en Vivo</div>
                      <div className="text-gray-600">Disponible 24/7 en la app</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-6 w-6 text-primary mr-4" />
                    <div>
                      <div className="font-semibold">Teléfono</div>
                      <div className="text-gray-600">01 800 123 4567</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 text-primary mr-4" />
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-gray-600">hola@credipal.com</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 text-primary mr-4" />
                    <div>
                      <div className="font-semibold">Oficinas</div>
                      <div className="text-gray-600">Ciudad de México, México</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Envíanos un Mensaje</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input placeholder="Nombre" />
                    <Input placeholder="Email" type="email" />
                  </div>
                  <Input placeholder="Teléfono" />
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={4}
                    placeholder="¿Cómo podemos ayudarte con tu bienestar financiero?"
                  ></textarea>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Enviar Mensaje
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-2xl font-bold">Credipal</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Tu coach de bienestar financiero personal. Te acompañamos hacia la libertad económica 
                con motivación constante y estrategias personalizadas.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Coach Financiero Personal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seguimiento Inteligente</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Planificación Personalizada</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Motivación y Acompañamiento</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Condusef</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Unidad Especializada</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Credipal. Todos los derechos reservados. Tu coach de bienestar financiero.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
