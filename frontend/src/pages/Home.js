import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Smartphone, Palette, Truck, Shield, Star } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_78d76407-00e9-4982-b8fe-49b9e45052f0/artifacts/strtt6dl_labcellogo.png";

const features = [
  {
    icon: Palette,
    title: 'Diseño Único',
    description: 'Crea fundas con tus propias imágenes y diseños personalizados.'
  },
  {
    icon: Smartphone,
    title: 'Múltiples Modelos',
    description: 'Compatible con iPhone, Samsung, Xiaomi, Huawei y más.'
  },
  {
    icon: Truck,
    title: 'Envío Rápido',
    description: 'Recibe tu pedido en tiempo récord con rastreo en tiempo real.'
  },
  {
    icon: Shield,
    title: 'Calidad Premium',
    description: 'Materiales de alta calidad que protegen tu dispositivo.'
  }
];

const testimonials = [
  {
    name: 'María García',
    text: 'Excelente calidad y el diseño quedó exactamente como lo quería. ¡100% recomendado!',
    rating: 5
  },
  {
    name: 'Carlos Rodríguez',
    text: 'Pedí una funda con la foto de mi mascota y quedó increíble. Muy buen servicio.',
    rating: 5
  },
  {
    name: 'Ana Martínez',
    text: 'La atención al cliente es excelente y la funda llegó antes de lo esperado.',
    rating: 5
  }
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center noise-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C853]/5 via-transparent to-[#6200EA]/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-[#00C853]/10 text-[#00C853] px-4 py-2 rounded-full text-sm font-medium">
                <Star className="h-4 w-4 fill-current" />
                Diseños únicos para tu estilo
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Fundas <span className="text-[#00C853]">Personalizadas</span> para tu Smartphone
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Diseña tu propia funda con imágenes, fotos o arte. 
                Protege tu teléfono con estilo único y personal.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/personalizar">
                  <Button className="btn-primary text-base h-12 px-8" data-testid="hero-cta-personalizar">
                    Crear Mi Funda
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/catalogo">
                  <Button variant="outline" className="btn-secondary text-base h-12 px-8" data-testid="hero-cta-catalogo">
                    Ver Catálogo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in-up stagger-2">
              <div className="relative z-10">
                <img 
                  src={LOGO_URL}
                  alt="LABCEL Mascota"
                  className="w-full max-w-md mx-auto animate-float drop-shadow-2xl"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-[#00C853]/20 to-[#6200EA]/20 rounded-full blur-3xl -z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              ¿Por qué <span className="text-[#00C853]">elegirnos</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia en personalización de fundas con calidad garantizada.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={`bg-white p-6 rounded-2xl shadow-soft hover:shadow-soft-lg transition-shadow animate-fade-in-up stagger-${index + 1}`}
                data-testid={`feature-${index}`}
              >
                <div className="w-12 h-12 bg-[#00C853]/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-[#00C853]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Nuestras <span className="text-[#00C853]">Fundas</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora nuestra colección de fundas personalizables de alta calidad.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Funda Básica',
                price: '$15.99',
                image: 'https://images.unsplash.com/photo-1525446517618-9a9e5430288b?crop=entropy&cs=srgb&fm=jpg&q=85&w=400'
              },
              {
                name: 'Funda Premium',
                price: '$24.99',
                image: 'https://images.unsplash.com/photo-1636010858142-e1ccc5623542?crop=entropy&cs=srgb&fm=jpg&q=85&w=400'
              },
              {
                name: 'Funda Ultra Slim',
                price: '$19.99',
                image: 'https://images.unsplash.com/photo-1713032396284-9f5c6595359c?crop=entropy&cs=srgb&fm=jpg&q=85&w=400'
              }
            ].map((product, index) => (
              <Link 
                key={product.name} 
                to="/personalizar"
                className="group card-product bg-white overflow-hidden shadow-soft"
                data-testid={`product-preview-${index}`}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-[#00C853] font-bold text-xl mono">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/catalogo">
              <Button variant="outline" className="btn-secondary" data-testid="view-all-products">
                Ver Todos los Productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Lo que dicen nuestros <span className="text-[#00C853]">clientes</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10"
                data-testid={`testimonial-${index}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#00C853] text-[#00C853]" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#00C853] to-[#00A844]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Listo para crear tu funda única?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Sube tu imagen favorita y diseña la funda perfecta para tu teléfono. 
            Es fácil, rápido y el resultado es increíble.
          </p>
          <Link to="/personalizar">
            <Button className="bg-white text-[#00C853] hover:bg-gray-100 h-12 px-8 font-bold rounded-full" data-testid="cta-create-case">
              Comenzar Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
