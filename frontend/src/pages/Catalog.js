import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00C853] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Catálogo de <span className="text-[#00C853]">Fundas</span>
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Explora nuestra selección de fundas personalizables. Elige tu favorita y crea un diseño único.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
            data-testid="search-input"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 h-12" data-testid="sort-select">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nombre</SelectItem>
            <SelectItem value="price_asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price_desc">Precio: Mayor a Menor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No se encontraron productos</p>
          {searchTerm && (
            <Button 
              variant="link" 
              onClick={() => setSearchTerm('')}
              className="text-[#00C853] mt-2"
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Link
              key={product.product_id}
              to={`/personalizar/${product.product_id}`}
              className="group card-product bg-white overflow-hidden shadow-soft"
              data-testid={`product-card-${index}`}
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                {product.base_image_url ? (
                  <img 
                    src={product.base_image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-[#00C853] transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#00C853] font-bold text-xl mono">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.is_customizable && (
                    <span className="text-xs bg-[#6200EA]/10 text-[#6200EA] px-2 py-1 rounded-full font-medium">
                      Personalizable
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
