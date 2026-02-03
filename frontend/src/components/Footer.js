import { Link } from 'react-router-dom';
import { Smartphone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_78d76407-00e9-4982-b8fe-49b9e45052f0/artifacts/strtt6dl_labcellogo.png";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="LABCEL" className="h-12 w-12" />
              <span className="font-bold text-xl">
                LABCEL <span className="text-[#00C853]">San Antonio</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Tu tienda de confianza para fundas personalizadas y accesorios tecnológicos. 
              Diseña tu estilo, protege tu dispositivo.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#00C853] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#00C853] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/catalogo" className="hover:text-[#00C853] transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/personalizar" className="hover:text-[#00C853] transition-colors">
                  Personalizar
                </Link>
              </li>
              <li>
                <Link to="/rastrear" className="hover:text-[#00C853] transition-colors">
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="hover:text-[#00C853] transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-[#00C853] transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#00C853]" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#00C853]" />
                <span>olmedohernandezsalvador@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#00C853] mt-0.5" />
                <span>San Antonio, TX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} LABCEL San Antonio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
