import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../App';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Palette, Trash2, ArrowRight, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export default function MyDesigns() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchDesigns();
    else setLoading(false);
  }, [user]);

  const fetchDesigns = async () => {
    try {
      const res = await apiClient.get('/designs');
      setDesigns(res.data);
    } catch (err) {
      toast.error('Error al cargar diseños');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (designId) => {
    if (!window.confirm('¿Eliminar este diseño guardado?')) return;
    try {
      await apiClient.delete(`/designs/${designId}`);
      setDesigns(prev => prev.filter(d => d.design_id !== designId));
      toast.success('Diseño eliminado');
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  const handleUseDesign = (design) => {
    navigate('/personalizar', {
      state: {
        savedDesign: design
      }
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg grid-pattern flex items-center justify-center px-4">
        <div className="card-futuristic p-10 text-center max-w-md">
          <Palette className="h-16 w-16 text-[#00FF88]/30 mx-auto mb-6" />
          <h2 className="text-2xl font-bold font-['Orbitron'] mb-3">Mis Diseños</h2>
          <p className="text-gray-400 mb-6">Inicia sesión para ver y gestionar tus diseños guardados.</p>
          <Button onClick={login} className="btn-futuristic" data-testid="login-btn">
            Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="w-12 h-12 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg grid-pattern py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold font-['Orbitron'] mb-2">
              Mis <span className="text-[#00FF88]">Diseños</span>
            </h1>
            <p className="text-gray-400">Tus diseños guardados listos para reutilizar</p>
          </div>
          <Button onClick={() => navigate('/personalizar')} className="btn-futuristic" data-testid="new-design-btn">
            <Palette className="h-4 w-4 mr-2" />
            Nuevo Diseño
          </Button>
        </div>

        {designs.length === 0 ? (
          <div className="text-center py-20">
            <Palette className="h-20 w-20 text-gray-700 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-2">Sin diseños guardados</h3>
            <p className="text-gray-500 mb-6">Crea tu primera funda personalizada y guarda el diseño para usarlo después.</p>
            <Button onClick={() => navigate('/personalizar')} className="btn-futuristic">
              Crear Mi Primer Diseño
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {designs.map((design) => (
              <div key={design.design_id} className="card-futuristic overflow-hidden group" data-testid={`design-${design.design_id}`}>
                <div className="aspect-[3/4] bg-[#1E1E2E] relative overflow-hidden">
                  {design.preview_image_url ? (
                    <img src={design.preview_image_url} alt={design.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Smartphone className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      className="bg-[#00FF88] text-[#0A0A0F] hover:bg-[#00FF88]/90"
                      onClick={() => handleUseDesign(design)}
                      data-testid={`use-design-${design.design_id}`}
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Usar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(design.design_id)}
                      data-testid={`delete-design-${design.design_id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{design.name}</h3>
                  <p className="text-xs text-gray-500">
                    {design.phone_brand_name} {design.phone_model_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
