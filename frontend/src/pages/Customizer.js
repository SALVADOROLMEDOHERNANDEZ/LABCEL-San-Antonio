import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../App';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Upload, RotateCcw, ZoomIn, ZoomOut, Move, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Customizer() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

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
  const [imageRotation, setImageRotation] = useState(0);
  
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
    setImageRotation(0);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00C853] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Canvas Area */}
          <div className="order-2 lg:order-1">
            <div 
              ref={canvasRef}
              className="relative aspect-[3/4] max-w-lg mx-auto bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-2xl"
              data-testid="customizer-canvas"
            >
              {/* Phone mockup background */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2rem] border-4 border-gray-700 overflow-hidden">
                  {/* Case area */}
                  <div className="absolute inset-2 bg-white rounded-[1.5rem] overflow-hidden">
                    {/* Custom image */}
                    {customImage ? (
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${customImage})`,
                          backgroundSize: `${imageScale[0]}%`,
                          backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                          backgroundRepeat: 'no-repeat',
                          transform: `rotate(${imageRotation}deg)`
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                        <ImageIcon className="h-16 w-16 mb-4 opacity-50" />
                        <p className="text-sm">Sube tu imagen</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Camera cutout */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full"></div>
                </div>
              </div>
              
              {/* Model label */}
              {selectedModel && (
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-sm">
                  {brands.find(b => b.brand_id === selectedBrand)?.name} {models.find(m => m.model_id === selectedModel)?.name}
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="glass-dark rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-6">Personaliza tu Funda</h2>
              
              {/* Product Selection */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-gray-300 mb-2 block">Tipo de Funda</Label>
                  <Select 
                    value={selectedProduct?.product_id || ''} 
                    onValueChange={(val) => setSelectedProduct(products.find(p => p.product_id === val))}
                  >
                    <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white" data-testid="product-select">
                      <SelectValue placeholder="Selecciona producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.product_id} value={p.product_id}>
                          {p.name} - ${p.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Marca del Teléfono</Label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white" data-testid="brand-select">
                      <SelectValue placeholder="Selecciona marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(b => (
                        <SelectItem key={b.brand_id} value={b.brand_id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Modelo</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
                    <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white" data-testid="model-select">
                      <SelectValue placeholder={selectedBrand ? "Selecciona modelo" : "Primero selecciona marca"} />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map(m => (
                        <SelectItem key={m.model_id} value={m.model_id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="border-t border-white/10 pt-6 mb-6">
                <Label className="text-gray-300 mb-3 block">Tu Imagen</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  disabled={uploading}
                  data-testid="upload-button"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  ) : (
                    <Upload className="h-5 w-5 mr-2" />
                  )}
                  {uploading ? 'Subiendo...' : 'Subir Imagen'}
                </Button>
              </div>

              {/* Image Controls */}
              {customImage && (
                <div className="space-y-4 border-t border-white/10 pt-6 mb-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">Ajustes de Imagen</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetImage}
                      className="text-gray-400 hover:text-white"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ZoomOut className="h-4 w-4 text-gray-400" />
                      <Slider
                        value={imageScale}
                        onValueChange={setImageScale}
                        min={50}
                        max={200}
                        step={5}
                        className="flex-1"
                      />
                      <ZoomIn className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 text-center">Zoom: {imageScale[0]}%</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-400">Posición X</Label>
                      <Slider
                        value={[imagePosition.x]}
                        onValueChange={([x]) => setImagePosition(p => ({ ...p, x }))}
                        min={0}
                        max={100}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-400">Posición Y</Label>
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
              <div className="border-t border-white/10 pt-6">
                {selectedProduct && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Precio:</span>
                    <span className="text-2xl font-bold text-[#00C853] mono">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                  </div>
                )}
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-12 btn-primary"
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
