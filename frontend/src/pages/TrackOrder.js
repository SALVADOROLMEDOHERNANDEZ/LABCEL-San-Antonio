import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Package, Search, CheckCircle2, Clock, Truck, Home, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const statusConfig = {
  pendiente: { 
    icon: Clock, 
    color: 'text-yellow-600 bg-yellow-100',
    label: 'Pendiente',
    description: 'Tu pedido está siendo revisado'
  },
  confirmado: { 
    icon: CheckCircle2, 
    color: 'text-blue-600 bg-blue-100',
    label: 'Confirmado',
    description: 'Tu pedido ha sido confirmado'
  },
  en_proceso: { 
    icon: Package, 
    color: 'text-purple-600 bg-purple-100',
    label: 'En Proceso',
    description: 'Estamos fabricando tu funda personalizada'
  },
  enviado: { 
    icon: Truck, 
    color: 'text-green-600 bg-green-100',
    label: 'Enviado',
    description: 'Tu pedido está en camino'
  },
  entregado: { 
    icon: Home, 
    color: 'text-emerald-600 bg-emerald-100',
    label: 'Entregado',
    description: '¡Tu pedido ha sido entregado!'
  },
  cancelado: { 
    icon: XCircle, 
    color: 'text-red-600 bg-red-100',
    label: 'Cancelado',
    description: 'Este pedido ha sido cancelado'
  }
};

const statusOrder = ['pendiente', 'confirmado', 'en_proceso', 'enviado', 'entregado'];

export default function TrackOrder() {
  const { orderId: paramOrderId } = useParams();
  const navigate = useNavigate();
  
  const [orderId, setOrderId] = useState(paramOrderId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (paramOrderId) {
      fetchOrder(paramOrderId);
    }
  }, [paramOrderId]);

  const fetchOrder = async (id) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.get(`/orders/track/${id}`);
      setOrder(response.data);
    } catch (err) {
      setError('Pedido no encontrado');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/rastrear/${orderId.trim()}`);
      fetchOrder(orderId.trim());
    }
  };

  const currentStatusIndex = order ? statusOrder.indexOf(order.status) : -1;
  const StatusIcon = order ? statusConfig[order.status]?.icon || AlertCircle : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          Rastrear <span className="text-[#00C853]">Pedido</span>
        </h1>
        <p className="text-gray-600">
          Ingresa tu número de pedido para ver el estado actual
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-12">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Número de pedido (ej: ORD-20260203-ABC123)"
              className="pl-12 h-14 text-lg"
              data-testid="track-order-input"
            />
          </div>
          <Button type="submit" className="btn-primary h-14 px-8" data-testid="track-order-button">
            Buscar
          </Button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00C853] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Buscando pedido...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-medium">{error}</p>
          <p className="text-red-600 text-sm mt-2">
            Verifica que el número de pedido sea correcto
          </p>
        </div>
      )}

      {/* Order Status */}
      {order && !loading && (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          {/* Header */}
          <div className="bg-[#00C853] text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Pedido</p>
                <p className="text-xl font-bold mono">{order.order_id}</p>
              </div>
              <div className={`p-3 rounded-full ${statusConfig[order.status]?.color || 'bg-gray-100'}`}>
                {StatusIcon && <StatusIcon className="h-6 w-6" />}
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${statusConfig[order.status]?.color || 'bg-gray-100'}`}>
                {StatusIcon && <StatusIcon className="h-8 w-8" />}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {statusConfig[order.status]?.label || order.status}
                </h2>
                <p className="text-gray-600">
                  {statusConfig[order.status]?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          {order.status !== 'cancelado' && (
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                {statusOrder.slice(0, -1).map((status, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const config = statusConfig[status];
                  const Icon = config.icon;
                  
                  return (
                    <div key={status} className="flex-1 flex flex-col items-center relative">
                      {/* Connector line */}
                      {index < statusOrder.length - 2 && (
                        <div 
                          className={`absolute top-5 left-1/2 w-full h-1 ${
                            index < currentStatusIndex ? 'bg-[#00C853]' : 'bg-gray-200'
                          }`}
                        />
                      )}
                      
                      {/* Icon */}
                      <div 
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-[#00C853] text-white' 
                            : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-[#00C853]/20' : ''}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      {/* Label */}
                      <span className={`text-xs mt-2 text-center ${
                        isCompleted ? 'text-[#00C853] font-medium' : 'text-gray-400'
                      }`}>
                        {config.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* History */}
          {order.status_history && order.status_history.length > 0 && (
            <div className="p-6">
              <h3 className="font-semibold mb-4">Historial de Estado</h3>
              <div className="space-y-4">
                {order.status_history.slice().reverse().map((entry, index) => {
                  const config = statusConfig[entry.status];
                  const Icon = config?.icon || AlertCircle;
                  const date = new Date(entry.timestamp);
                  
                  return (
                    <div key={index} className="flex gap-4">
                      <div className={`p-2 rounded-full h-fit ${config?.color || 'bg-gray-100'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{config?.label || entry.status}</p>
                        {entry.notes && (
                          <p className="text-sm text-gray-600">{entry.notes}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1 mono">
                          {date.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
