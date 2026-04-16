import { useState, useEffect } from 'react';
import { apiClient } from '../../App';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '../../components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { Plus, Pencil, Trash2, Tag, Percent, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    code: '', discount_type: 'percentage', discount_value: '', min_purchase: '0', max_uses: '0', expires_at: '', is_active: true
  });

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const res = await apiClient.get('/coupons');
      setCoupons(res.data);
    } catch { toast.error('Error al cargar cupones'); }
    finally { setLoading(false); }
  };

  const resetForm = () => setForm({ code: '', discount_type: 'percentage', discount_value: '', min_purchase: '0', max_uses: '0', expires_at: '', is_active: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      discount_value: parseFloat(form.discount_value),
      min_purchase: parseFloat(form.min_purchase || '0'),
      max_uses: parseInt(form.max_uses || '0'),
      expires_at: form.expires_at || null,
    };
    try {
      if (editing) {
        await apiClient.put(`/coupons/${editing.coupon_id}`, payload);
        toast.success('Cupón actualizado');
      } else {
        await apiClient.post('/coupons', payload);
        toast.success('Cupón creado');
      }
      setDialogOpen(false);
      setEditing(null);
      resetForm();
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error');
    }
  };

  const handleEdit = (coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: String(coupon.discount_value),
      min_purchase: String(coupon.min_purchase || 0),
      max_uses: String(coupon.max_uses || 0),
      expires_at: coupon.expires_at || '',
      is_active: coupon.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este cupón?')) return;
    try {
      await apiClient.delete(`/coupons/${id}`);
      toast.success('Cupón eliminado');
      fetchCoupons();
    } catch { toast.error('Error'); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Tag className="h-6 w-6 text-[#00FF88]" />
          <h1 className="text-2xl font-bold font-['Orbitron']">Cupones</h1>
          <span className="text-sm text-gray-500">({coupons.length})</span>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditing(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button className="bg-[#00FF88] text-[#0A0A0F] hover:bg-[#00FF88]/90" data-testid="add-coupon-btn">
              <Plus className="h-4 w-4 mr-2" /> Nuevo Cupón
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#12121A] border-[#00FF88]/20 max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-['Orbitron']">{editing ? 'Editar' : 'Nuevo'} Cupón</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-400">Código</Label>
                <Input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} required className="bg-[#1E1E2E] border-[#00FF88]/20 mt-1 uppercase font-['JetBrains_Mono']" placeholder="DESCUENTO10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Tipo</Label>
                  <Select value={form.discount_type} onValueChange={v => setForm(p => ({ ...p, discount_type: v }))}>
                    <SelectTrigger className="bg-[#1E1E2E] border-[#00FF88]/20 mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1E1E2E] border-[#00FF88]/20">
                      <SelectItem value="percentage">Porcentaje %</SelectItem>
                      <SelectItem value="fixed">Monto Fijo $</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-400">Valor</Label>
                  <div className="relative mt-1">
                    {form.discount_type === 'percentage'
                      ? <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      : <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    }
                    <Input type="number" value={form.discount_value} onChange={e => setForm(p => ({ ...p, discount_value: e.target.value }))} required className="bg-[#1E1E2E] border-[#00FF88]/20 pl-9" min="1" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Compra Mínima ($)</Label>
                  <Input type="number" value={form.min_purchase} onChange={e => setForm(p => ({ ...p, min_purchase: e.target.value }))} className="bg-[#1E1E2E] border-[#00FF88]/20 mt-1" min="0" />
                </div>
                <div>
                  <Label className="text-gray-400">Usos Máximos (0=ilimitado)</Label>
                  <Input type="number" value={form.max_uses} onChange={e => setForm(p => ({ ...p, max_uses: e.target.value }))} className="bg-[#1E1E2E] border-[#00FF88]/20 mt-1" min="0" />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Fecha de Expiración (opcional)</Label>
                <Input type="datetime-local" value={form.expires_at} onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))} className="bg-[#1E1E2E] border-[#00FF88]/20 mt-1" />
              </div>
              {editing && (
                <div className="flex items-center gap-3">
                  <Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} />
                  <Label className="text-gray-400">{form.is_active ? 'Activo' : 'Inactivo'}</Label>
                </div>
              )}
              <Button type="submit" className="w-full bg-[#00FF88] text-[#0A0A0F] hover:bg-[#00FF88]/90">
                {editing ? 'Actualizar' : 'Crear'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="card-futuristic overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#00FF88]/10">
              <TableHead className="text-gray-400">Código</TableHead>
              <TableHead className="text-gray-400">Descuento</TableHead>
              <TableHead className="text-gray-400">Mín. Compra</TableHead>
              <TableHead className="text-gray-400">Usos</TableHead>
              <TableHead className="text-gray-400">Estado</TableHead>
              <TableHead className="text-gray-400 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map(c => (
              <TableRow key={c.coupon_id} className="border-b border-[#00FF88]/5">
                <TableCell className="font-['JetBrains_Mono'] font-bold text-[#00FF88]">{c.code}</TableCell>
                <TableCell>
                  {c.discount_type === 'percentage' ? `${c.discount_value}%` : `$${c.discount_value}`}
                </TableCell>
                <TableCell className="text-gray-400">${c.min_purchase || 0}</TableCell>
                <TableCell className="text-gray-400">
                  {c.current_uses || 0}{c.max_uses > 0 ? `/${c.max_uses}` : '/ilim.'}
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded ${c.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {c.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(c)} className="hover:bg-[#00FF88]/10">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(c.coupon_id)} className="text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {coupons.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">Sin cupones creados</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
