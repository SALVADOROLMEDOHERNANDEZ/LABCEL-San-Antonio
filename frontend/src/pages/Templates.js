import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Layout, Leaf, Sparkles, Palette, Dog, Sun } from 'lucide-react';
import { toast } from 'sonner';

const categories = [
  { id: 'todas', label: 'Todas', icon: Layout },
  { id: 'abstracto', label: 'Abstracto', icon: Palette },
  { id: 'naturaleza', label: 'Naturaleza', icon: Leaf },
  { id: 'mascotas', label: 'Mascotas', icon: Dog },
];

export default function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todas');

  useEffect(() => {
    fetchTemplates();
  }, [activeCategory]);

  const fetchTemplates = async () => {
    try {
      const params = activeCategory !== 'todas' ? `?category=${activeCategory}` : '';
      const res = await apiClient.get(`/templates${params}`);
      setTemplates(res.data);
    } catch (err) {
      toast.error('Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  };

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUseTemplate = (template) => {
    navigate('/personalizar', { state: { templateImage: template.image_url, templateName: template.name } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-['Orbitron']">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg grid-pattern py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-[#00FF88]" />
            <span className="text-[#00FF88] text-sm font-medium uppercase tracking-wider">Inspiracion</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-['Orbitron'] mb-4">
            Plantillas <span className="text-[#00FF88]">Prediseñadas</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Elige una plantilla como base para tu funda personalizada o usala directamente.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar plantillas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-[#1E1E2E] border-[#00FF88]/20 focus:border-[#00FF88]"
              data-testid="template-search"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                onClick={() => { setActiveCategory(cat.id); setLoading(true); }}
                className={activeCategory === cat.id
                  ? "bg-[#00FF88] text-[#0A0A0F] hover:bg-[#00FF88]/90 h-10"
                  : "border-[#00FF88]/20 text-gray-400 hover:border-[#00FF88]/50 hover:text-white h-10"
                }
                data-testid={`cat-${cat.id}`}
              >
                <cat.icon className="h-4 w-4 mr-1.5" />
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Palette className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron plantillas</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((tmpl) => (
              <div
                key={tmpl.template_id}
                className="group card-futuristic overflow-hidden cursor-pointer"
                onClick={() => handleUseTemplate(tmpl)}
                data-testid={`template-${tmpl.template_id}`}
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#1E1E2E] relative">
                  <img
                    src={tmpl.image_url}
                    alt={tmpl.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="w-full bg-[#00FF88] text-[#0A0A0F] font-bold hover:bg-[#00FF88]/90 h-10">
                      Usar Plantilla
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm group-hover:text-[#00FF88] transition-colors truncate">
                    {tmpl.name}
                  </h3>
                  <span className="text-xs text-gray-500 capitalize">{tmpl.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
