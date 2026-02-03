import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../App';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner';
import { CheckCircle2, CreditCard, Truck, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    customer_whatsapp: '',
    shipping_address: '',
    payment_method: 'transferencia',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/orders', {
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          phone_brand: item.phone_brand,
          phone_model: item.phone_model,
          custom_image_url: item.custom_image_url,
          preview_image_url: item.preview_image_url
        })),
        ...formData
      });

      setOrderId(response.data.order_id);
      setOrderComplete(true);
      clearCart();
      toast.success('¡Pedido creado exitosamente!');
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.detail || 'Error al crear el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <CheckCircle2 className="h-20 w-20 text-[#00C853] mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">¡Pedido Confirmado!</h1>
          <p className="text-gray-600 mb-2">
            Tu pedido ha sido recibido exitosamente.
          </p>
          <p className="text-lg font-semibold text-[#00C853] mono mb-6">
            Número de pedido: {orderId}
          </p>
          <p className="text-gray-600 mb-8">
            Te contactaremos pronto para confirmar tu diseño y coordinar el envío.
            Recibirás notificaciones por WhatsApp y correo electrónico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(`/rastrear/${orderId}`)}
              className="btn-primary"
              data-testid="track-order-button"
            >
              Rastrear Pedido
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/carrito');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate('/carrito')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al carrito
      </Button>

      <h1 className="text-3xl font-bold mb-8">
        Finalizar <span className="text-[#00C853]">Compra</span>
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold mb-6">Información de Contacto</h2>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="customer_name">Nombre Completo *</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  className="h-12 mt-1"
                  data-testid="input-name"
                />
              </div>
              
              <div>
                <Label htmlFor="customer_email">Correo Electrónico *</Label>
                <Input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  required
                  className="h-12 mt-1"
                  data-testid="input-email"
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_phone">Teléfono *</Label>
                  <Input
                    id="customer_phone"
                    name="customer_phone"
                    type="tel"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                    className="h-12 mt-1"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="customer_whatsapp">WhatsApp (opcional)</Label>
                  <Input
                    id="customer_whatsapp"
                    name="customer_whatsapp"
                    type="tel"
                    value={formData.customer_whatsapp}
                    onChange={handleChange}
                    placeholder="Para notificaciones"
                    className="h-12 mt-1"
                    data-testid="input-whatsapp"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shipping_address">Dirección de Envío *</Label>
                <Textarea
                  id="shipping_address"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-1"
                  placeholder="Calle, número, colonia, ciudad, código postal"
                  data-testid="input-address"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold mb-6">Método de Pago</h2>
            
            <RadioGroup 
              value={formData.payment_method} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, payment_method: val }))}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-[#00C853] transition-colors cursor-pointer">
                <RadioGroupItem value="transferencia" id="transferencia" />
                <Label htmlFor="transferencia" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Transferencia Bancaria</p>
                      <p className="text-sm text-gray-500">Se enviarán los datos de cuenta</p>
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-[#00C853] transition-colors cursor-pointer">
                <RadioGroupItem value="contra_entrega" id="contra_entrega" />
                <Label htmlFor="contra_entrega" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Pago Contra Entrega</p>
                      <p className="text-sm text-gray-500">Paga al recibir tu pedido</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-2"
              placeholder="Instrucciones especiales para tu pedido..."
              data-testid="input-notes"
            />
          </div>

          <Button
            type="submit"
            className="w-full btn-primary h-14 text-lg"
            disabled={loading}
            data-testid="submit-order-button"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Procesando...
              </>
            ) : (
              `Confirmar Pedido - $${getTotal().toFixed(2)}`
            )}
          </Button>
        </form>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
            
            <div className="divide-y">
              {items.map((item, index) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.preview_image_url && (
                      <img 
                        src={item.preview_image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product_name}</p>
                    {item.phone_brand && (
                      <p className="text-sm text-gray-500">{item.phone_brand} {item.phone_model}</p>
                    )}
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-medium mono">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="mono">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>A coordinar</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-[#00C853] mono">${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
