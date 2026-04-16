import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../App';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, SlidersHorizontal, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [reviewStats, setReviewStats] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchReviewStats();
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

  const fetchReviewStats = async () => {
    try {
      const res = await apiClient.get('/reviews/stats');
      setReviewStats(res.data);
    } catch {}
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
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold font-['Orbitron'] mb-4">
            Catálogo de <span className="text-[#00FF88]">Fundas</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Explora nuestra selección de fundas personalizables. Elige tu favorita y crea un diseño único.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-[#1E1E2E] border-[#00FF88]/20 focus:border-[#00FF88]"
              data-testid="search-input"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 h-12 bg-[#1E1E2E] border-[#00FF88]/20" data-testid="sort-select">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="bg-[#1E1E2E] border-[#00FF88]/20">
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
                className="text-[#00FF88] mt-2"
              >
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-8">
            {filteredProducts.map((product, index) => (
              <Link
                key={product.product_id}
                to={`/personalizar/${product.product_id}`}
                className="group card-futuristic overflow-hidden"
                data-testid={`product-card-${index}`}
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#1E1E2E] relative">
                  {product.base_image_url ? (
                    <img 
                      src={product.base_image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    {product.is_customizable && (
                      <span className="flex items-center gap-1 text-xs bg-[#00FF88]/20 text-[#00FF88] px-3 py-1 rounded border border-[#00FF88]/30 font-medium">
                        <Sparkles className="h-3 w-3" />
                        Personalizable
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2 font-['Orbitron'] group-hover:text-[#00FF88] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#00FF88] font-bold text-2xl font-['JetBrains_Mono']">
                      ${product.price.toFixed(0)}
                    </span>
                    <div className="text-right">
                      {reviewStats[product.product_id] ? (
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(reviewStats[product.product_id].avg_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">({reviewStats[product.product_id].total_reviews})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                          {product.price === 180 ? 'Uso Normal' : 'Uso Rudo'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Reviews Section */}
        <ReviewsSection products={products} />
      </div>
    </div>
  );
}

function ReviewsSection({ products }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await apiClient.get('/reviews?limit=10');
      setReviews(res.data);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) { toast.error('Selecciona un producto'); return; }
    setSubmitting(true);
    try {
      await apiClient.post('/reviews', { product_id: selectedProduct, rating, comment });
      toast.success('Reseña publicada');
      setShowForm(false);
      setComment('');
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al publicar');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold font-['Orbitron']">
          Reseñas de <span className="text-[#00FF88]">Clientes</span>
        </h2>
        {user && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className={showForm ? "btn-outline-futuristic" : "bg-[#00FF88] text-[#0A0A0F] hover:bg-[#00FF88]/90"}
            data-testid="write-review-btn"
          >
            {showForm ? 'Cancelar' : 'Escribir Reseña'}
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-futuristic p-6 mb-8 space-y-4" data-testid="review-form">
          <div>
            <Label className="text-gray-400">Producto</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="bg-[#1E1E2E] border-[#00FF88]/20 mt-1"><SelectValue placeholder="Selecciona producto" /></SelectTrigger>
              <SelectContent className="bg-[#1E1E2E] border-[#00FF88]/20">
                {products.map(p => <SelectItem key={p.product_id} value={p.product_id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-400 mb-2 block">Calificación</Label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setRating(s)} data-testid={`star-${s}`}>
                  <Star className={`h-7 w-7 transition-colors ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 hover:text-yellow-400/50'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-gray-400">Comentario</Label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              rows={3}
              className="w-full mt-1 rounded-md bg-[#1E1E2E] border border-[#00FF88]/20 p-3 text-white focus:border-[#00FF88] outline-none resize-none"
              placeholder="Comparte tu experiencia..."
              data-testid="review-comment"
            />
          </div>
          <Button type="submit" disabled={submitting} className="bg-[#00FF88] text-[#0A0A0F] hover:bg-[#00FF88]/90" data-testid="submit-review-btn">
            {submitting ? 'Publicando...' : 'Publicar Reseña'}
          </Button>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 card-futuristic">
          <Star className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map(r => (
            <div key={r.review_id} className="card-futuristic p-5" data-testid={`review-${r.review_id}`}>
              <div className="flex items-start gap-3">
                {r.user_picture ? (
                  <img src={r.user_picture} alt="" className="h-10 w-10 rounded-lg border border-[#00FF88]/20" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#00FF88] to-[#00D4FF] flex items-center justify-center text-[#0A0A0F] font-bold text-sm">
                    {(r.user_name || 'A').charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{r.user_name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{r.comment}</p>
                  <p className="text-xs text-gray-600 mt-2">{new Date(r.created_at).toLocaleDateString('es-MX')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
