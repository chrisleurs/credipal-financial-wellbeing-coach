
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  Zap, 
  CheckCircle, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
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
      icon: Clock,
      title: "Aprobación en Minutos",
      description: "Procesa tu solicitud de crédito en menos de 5 minutos con nuestra tecnología avanzada."
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Protegemos tus datos con encriptación bancaria y cumplimos con todas las regulaciones financieras."
    },
    {
      icon: Zap,
      title: "Dinero al Instante",
      description: "Recibe el dinero en tu cuenta bancaria inmediatamente después de la aprobación."
    },
    {
      icon: CheckCircle,
      title: "Sin Papeleo",
      description: "Proceso 100% digital. Solo necesitas tu INE y comprobante de ingresos."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Completa tu Solicitud",
      description: "Llena el formulario en línea con tus datos básicos. Solo toma 2 minutos."
    },
    {
      step: "02",
      title: "Verificación Instantánea",
      description: "Nuestro sistema analiza tu perfil crediticio automáticamente."
    },
    {
      step: "03",
      title: "Recibe tu Dinero",
      description: "Una vez aprobado, el dinero llega a tu cuenta en segundos."
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Emprendedora",
      rating: 5,
      comment: "Increíble rapidez. Necesitaba dinero urgente para mi negocio y en 10 minutos ya lo tenía en mi cuenta."
    },
    {
      name: "Carlos Rodríguez",
      role: "Profesionista",
      rating: 5,
      comment: "El proceso más fácil que he visto. Sin filas, sin papeleos, sin complicaciones. Totalmente recomendado."
    },
    {
      name: "Ana Martínez",
      role: "Estudiante",
      rating: 5,
      comment: "Excelente servicio al cliente. Me ayudaron en cada paso y las tasas son muy competitivas."
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
            <a href="#como-funciona" className="text-gray-600 hover:text-primary transition-colors">Cómo Funciona</a>
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
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Créditos <span className="text-primary">Rápidos</span> y{' '}
              <span className="text-secondary">Seguros</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Obtén el dinero que necesitas en minutos. Sin papeleo, sin filas, sin complicaciones. 
              Tu solución financiera digital de confianza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={handleGetStarted} 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Solicitar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                Ver Tasas
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-primary mb-2">5 min</div>
                <div className="text-gray-600">Tiempo de aprobación</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
                <div className="text-gray-600">Disponible siempre</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-primary mb-2">0%</div>
                <div className="text-gray-600">Comisión por apertura</div>
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
              ¿Por qué elegir Credipal?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Somos la plataforma fintech líder en créditos personales con la mejor experiencia digital del mercado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow duration-300">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cómo funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Obtén tu crédito en 3 simples pasos. Rápido, seguro y completamente digital.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
                  )}
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
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Miles de personas confían en Credipal para sus necesidades financieras.
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
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
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
              ¿Listo para obtener tu crédito?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a miles de personas que ya confían en Credipal. 
              Solicita tu crédito ahora y recibe el dinero en minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-primary hover:bg-gray-50 px-8 py-4 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Solicitar Mi Crédito
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="text-white/80 text-sm">
                Sin compromisos • Respuesta inmediata
              </div>
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
                ¿Tienes preguntas?
              </h2>
              <p className="text-xl text-gray-600">
                Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus dudas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Información de Contacto</h3>
                <div className="space-y-4">
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
                    placeholder="¿En qué podemos ayudarte?"
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
                La plataforma fintech líder en créditos personales. Rápido, seguro y confiable.
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
                <li><a href="#" className="hover:text-white transition-colors">Créditos Personales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Préstamos Express</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Línea de Crédito</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refinanciamiento</a></li>
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
            <p>&copy; 2024 Credipal. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
