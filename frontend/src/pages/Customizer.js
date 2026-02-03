import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../App';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Upload, RotateCcw, ZoomIn, ZoomOut, ShoppingCart, Image as ImageIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Camera configurations for different phone models
const cameraConfigs = {
  // Apple
  'model_iphone15': { type: 'dual-diagonal', count: 2 },
  'model_iphone15pro': { type: 'triple-pro', count: 3 },
  'model_iphone14': { type: 'dual-diagonal', count: 2 },
  'model_iphone13': { type: 'dual-diagonal', count: 2 },
  // Samsung
  'model_s24': { type: 'triple-vertical', count: 3 },
  'model_s24ultra': { type: 'quad-vertical', count: 4 },
  'model_s23': { type: 'triple-vertical', count: 3 },
  'model_a54': { type: 'triple-vertical', count: 3 },
  // Xiaomi
  'model_redmi13': { type: 'dual-vertical', count: 2 },
  'model_poco': { type: 'triple-vertical', count: 3 },
  // Huawei
  'model_p60': { type: 'triple-circle', count: 3 },
  // Motorola
  'model_edge40': { type: 'dual-vertical', count: 2 },
};

// Render camera module based on configuration
const CameraModule = ({ config, brandId }) => {
  if (!config) {
    return (
      <div className="absolute top-4 left-4 w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-[#2A2A2A] border-2 border-[#3A3A3A]" />
      </div>
    );
  }

  const isApple = brandId === 'brand_apple';
  const isSamsung = brandId === 'brand_samsung';
  const isHuawei = brandId === 'brand_huawei';

  // Apple style - square module with diagonal cameras
  if (config.type === 'dual-diagonal' && isApple) {
    return (
      <div className="absolute top-4 left-4 w-20 h-20 bg-[#1A1A1A] rounded-2xl p-2 border border-[#2A2A2A]">
        <div className="relative w-full h-full">
          <div className="absolute top-0 left-0 w-7 h-7 rounded-full bg-[#0A0A0A] border-2 border-[#3A3A3A] flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#0A0A1A]" />
          </div>
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0A0A0A] border-2 border-[#3A3A3A] flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#0A0A1A]" />
          </div>
          <div className="absolute top-0 right-1 w-3 h-3 rounded-full bg-[#2A2A2A]" />
        </div>
      </div>
    );
  }

  // Apple Pro style - triple camera
  if (config.type === 'triple-pro' && isApple) {
    return (
      <div className="absolute top-4 left-4 w-24 h-24 bg-[#1A1A1A] rounded-3xl p-2 border border-[#2A2A2A]">
        <div className="relative w-full h-full">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#0A0A0A] border-2 border-[#3A3A3A] flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#0A0A1A]" />
          </div>
          <div className="absolute bottom-1 left-1 w-7 h-7 rounded-full bg-[#0A0A0A] border-2 border-[#3A3A3A] flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#0A0A1A]" />
          </div>
          <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#0A0A0A] border-2 border-[#3A3A3A] flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#0A0A1A]" />
          </div>
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#2A2A2A]" />
        </div>
      </div>
    );
  }

  // Samsung style - vertical cameras
  if ((config.type === 'triple-vertical' || config.type === 'quad-vertical') && isSamsung) {
    const cameraCount = config.type === 'quad-vertical' ? 4 : 3;
    return (
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        {[...Array(cameraCount)].map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-[#0A0A0A] border-2 border-[#2A2A2A] flex items-center justify-center shadow-lg">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#0A0A1A]" />
          </div>
        ))}
        <div className="w-4 h-4 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] ml-2" />
      </div>
    );
  }

  // Huawei style - circle module
  if (config.type === 'triple-circle' && isHuawei) {
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#1A1A1A] rounded-full p-3 border border-[#2A2A2A]">
        <div className="relative w-full h-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0A0A0A] border-2 border-[#3A3A3A]" />
          <div className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-[#0A0A0A] border-2 border-[#3A3A3A]" />
          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#0A0A0A] border-2 border-[#3A3A3A]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#2A2A2A]" />
        </div>
      </div>
    );
  }

  // Default vertical cameras (Xiaomi, Motorola, etc.)
  return (
    <div className="absolute top-4 left-4 bg-[#1A1A1A] rounded-2xl p-2 border border-[#2A2A2A]">
      <div className="flex flex-col gap-2">
        {[...Array(config.count || 2)].map((_, i) => (
          <div key={i} className="w-7 h-7 rounded-full bg-[#0A0A0A] border-2 border-[#3A3A3A] flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#0A0A1A]" />
          </div>
        ))}
        <div className="w-3 h-3 rounded-full bg-[#2A2A2A] mx-auto" />
      </div>
    </div>
  );
};

export default function Customizer() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const fileInputRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customImage, setCustomImage] = useState(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [imageScale, setImageScale] = useState([100]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (productId && products.length > 0) {
      const product = products.find(p => p.product_id === productId);
      if (product) setSelectedProduct(product);
    }
  }, [productId, products]);

  useEffect(() => {
    if (selectedBrand) {
      fetchModels(selectedBrand);
    } else {
      setModels([]);
      setSelectedModel('');
    }
  }, [selectedBrand]);

  const fetchData = async () => {
    try {
      const [productsRes, brandsRes] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/phone-brands')
      ]);
      setProducts(productsRes.data);
      setBrands(brandsRes.data);
      
      if (!productId && productsRes.data.length > 0) {
        setSelectedProduct(productsRes.data[0]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async (brandId) => {
    try {
      const response = await apiClient.get(`/phone-models?brand_id=${brandId}`);
      setModels(response.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar 5MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setCustomImage(response.data.url);
      setCustomImageUrl(response.data.image_id);
      toast.success('Imagen cargada correctamente');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const resetImage = () => {
    setImagePosition({ x: 50, y: 50 });
    setImageScale([100]);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      toast.error('Selecciona un producto');
      return;
    }
    if (!selectedBrand || !selectedModel) {
      toast.error('Selecciona marca y modelo de teléfono');
      return;
    }

    const brandName = brands.find(b => b.brand_id === selectedBrand)?.name || '';
    const modelName = models.find(m => m.model_id === selectedModel)?.name || '';

    addItem({
      product_id: selectedProduct.product_id,
      product_name: selectedProduct.name,
      quantity: 1,
      price: selectedProduct.price,
      phone_brand: brandName,
      phone_model: modelName,
      custom_image_url: customImageUrl,
      preview_image_url: customImage
    });

    navigate('/carrito');
  };

  const cameraConfig = cameraConfigs[selectedModel] || null;

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
    <div className="min-h-screen gradient-bg grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-['Orbitron'] mb-2">
            Personaliza tu <span className="text-[#00FF88]">Funda</span>
          </h1>
          <p className="text-gray-400">Selecciona tu teléfono y sube tu diseño</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Canvas Area */}
          <div className="order-2 lg:order-1">
            <div 
              className="relative aspect-[3/4] max-w-md mx-auto bg-[#0A0A0F] rounded-3xl overflow-hidden border border-[#00FF88]/20 shadow-[0_0_60px_rgba(0,255,136,0.1)]"
              data-testid="customizer-canvas"
            >
              {/* Phone mockup */}
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="relative w-full h-full bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] rounded-[2.5rem] border-2 border-[#2A2A2A] overflow-hidden shadow-2xl">
                  {/* Case/Back area */}
                  <div className="absolute inset-1 bg-white rounded-[2rem] overflow-hidden">
                    {/* Custom image */}
                    {customImage ? (
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${customImage})`,
                          backgroundSize: `${imageScale[0]}%`,
                          backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                        <ImageIcon className="h-16 w-16 mb-4 opacity-30" />
                        <p className="text-sm font-medium">Sube tu imagen</p>
                        <p className="text-xs opacity-60">JPG, PNG hasta 5MB</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Camera Module - Dynamic based on model */}
                  <CameraModule config={cameraConfig} brandId={selectedBrand} />
                  
                  {/* Flash */}
                  <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#FFE066]/80" />
                </div>
              </div>
              
              {/* Model label */}
              {selectedModel && (
                <div className="absolute bottom-4 left-4 bg-[#0A0A0F]/80 backdrop-blur px-3 py-1.5 rounded border border-[#00FF88]/30 text-sm font-['Orbitron']">
                  <span className="text-[#00FF88]">{brands.find(b => b.brand_id === selectedBrand)?.name}</span>
                  <span className="text-gray-400 ml-2">{models.find(m => m.model_id === selectedModel)?.name}</span>
                </div>
              )}

              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00FF88]/5 to-[#00D4FF]/5 rounded-[3rem] -z-10 blur-xl" />
            </div>
          </div>

          {/* Controls Panel */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="card-futuristic p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-[#00FF88]" />
                <h2 className="text-xl font-bold font-['Orbitron']">Configuración</h2>
              </div>
              
              {/* Product Selection */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-gray-400 mb-2 block text-sm">Tipo de Funda</Label>
                  <Select 
                    value={selectedProduct?.product_id || ''} 
                    onValueChange={(val) => setSelectedProduct(products.find(p => p.product_id === val))}
                  >
                    <SelectTrigger className="h-12 bg-[#1E1E2E] border-[#00FF88]/20 text-white" data-testid="product-select">
                      <SelectValue placeholder="Selecciona producto" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E2E] border-[#00FF88]/20">
                      {products.map(p => (
                        <SelectItem key={p.product_id} value={p.product_id} className="hover:bg-[#00FF88]/10">
                          {p.name} - <span className="text-[#00FF88] font-['JetBrains_Mono']">${p.price.toFixed(0)}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-400 mb-2 block text-sm">Marca del Teléfono</Label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="h-12 bg-[#1E1E2E] border-[#00FF88]/20 text-white" data-testid="brand-select">
                      <SelectValue placeholder="Selecciona marca" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E2E] border-[#00FF88]/20">
                      {brands.map(b => (
                        <SelectItem key={b.brand_id} value={b.brand_id} className="hover:bg-[#00FF88]/10">
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-400 mb-2 block text-sm">Modelo</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
                    <SelectTrigger className="h-12 bg-[#1E1E2E] border-[#00FF88]/20 text-white" data-testid="model-select">
                      <SelectValue placeholder={selectedBrand ? "Selecciona modelo" : "Primero selecciona marca"} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E2E] border-[#00FF88]/20">
                      {models.map(m => (
                        <SelectItem key={m.model_id} value={m.model_id} className="hover:bg-[#00FF88]/10">
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="border-t border-[#00FF88]/10 pt-6 mb-6">
                <Label className="text-gray-400 mb-3 block text-sm">Tu Imagen</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-12 bg-[#1E1E2E] border border-[#00FF88]/30 text-white hover:bg-[#00FF88]/10 hover:border-[#00FF88]/50 transition-all"
                  disabled={uploading}
                  data-testid="upload-button"
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Upload className="h-5 w-5 mr-2" />
                  )}
                  {uploading ? 'Subiendo...' : 'Subir Imagen'}
                </Button>
              </div>

              {/* Image Controls */}
              {customImage && (
                <div className="space-y-4 border-t border-[#00FF88]/10 pt-6 mb-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-400 text-sm">Ajustes de Imagen</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetImage}
                      className="text-gray-400 hover:text-[#00FF88]"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ZoomOut className="h-4 w-4 text-gray-500" />
                      <Slider
                        value={imageScale}
                        onValueChange={setImageScale}
                        min={50}
                        max={200}
                        step={5}
                        className="flex-1"
                      />
                      <ZoomIn className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-500 text-center font-['JetBrains_Mono']">Zoom: {imageScale[0]}%</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Posición X</Label>
                      <Slider
                        value={[imagePosition.x]}
                        onValueChange={([x]) => setImagePosition(p => ({ ...p, x }))}
                        min={0}
                        max={100}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Posición Y</Label>
                      <Slider
                        value={[imagePosition.y]}
                        onValueChange={([y]) => setImagePosition(p => ({ ...p, y }))}
                        min={0}
                        max={100}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Price & Add to Cart */}
              <div className="border-t border-[#00FF88]/10 pt-6">
                {selectedProduct && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Precio:</span>
                    <span className="text-3xl font-bold text-[#00FF88] font-['JetBrains_Mono']">
                      ${selectedProduct.price.toFixed(0)}
                    </span>
                  </div>
                )}
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-14 btn-futuristic"
                  data-testid="add-to-cart-button"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Añadir al Carrito
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
