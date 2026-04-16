import { useState, useEffect } from 'react';
import { apiClient } from '../../App';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '../../components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { Plus, Pencil, Trash2, Layout } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['general', 'abstracto', 'naturaleza', 'mascotas', 'deportes', 'anime'];

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', image_url: '', category: 'general', tags: '' });

  useEffect(() => { fetchTemplates(); }, []);

  const fetchTemplates = async () => {
    try {
      const res = await apiClient.get('/templates');
      setTemplates(res.data);
    } catch { toast.error('Error al cargar'); }
    finally { setLoading(false); }
  };

  const resetForm = () => setForm({ name: '', image_url: '', category: 'general', tags: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (editing) {
        await apiClient.put(`/templates/${editing.template_id}`, payload);
        toast.success('Plantilla actualizada');
      } else {
        await apiClient.post('/templates', payload);
        toast.success('Plantilla creada');
      }
      setDialogOpen(false);
      setEditing(null);
      resetForm();
      fetchTemplates();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error');
    }
  };

  const handleEdit = (tmpl) => {
    setEditing(tmpl);
    setForm({ name: tmpl.name, image_url: tmpl.image_url, category: tmpl.category, tags: (tmpl.tags || []).join(', ') });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta plantilla?')) return;
    try {
      await apiClient.delete(`/templates/${id}`);
      toast.success('Eliminada');
      fetchTemplates();
    } catch { toast.error('Error'); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Layout className="h-6 w-6 text-[#00FF88]" />
          <h1 className="text-2xl font-bold font-['Orbitron']">Plantillas</h1>
          <span className="text-sm text-gray-500">({templates.length})</span>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditing(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button className="bg-[#00FF88] text-[#0A0A0F] hover:bg-[#00FF88]/90" data-testid="add-template-btn">
              <Plus className="h-4 w-4 mr-2" /> Nueva Plantilla
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#12121A] border-[#00FF88]/20 max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-['Orbitron']">{editing ? 'Editar' : 'Nueva'} Plantilla</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-400">Nombre</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="bg-[#1E1E2E] border-[#00FF88]/20 mt-1" />
              </div>
              <div>
                <Label className="text-gray-400">URL de Imagen</Label>
                <Input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} required className="bg-[#1E1E2E] border-[#00FF88]/20 mt-1" />
              </div>
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="h-32 w-full object-cover rounded border border-[#00FF88]/20" />
              )}
              <div>
                <Label className="text-gray-400">Categoría</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="bg-[#1E1E2E] border-[#00FF88]/20 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1E1E2E] border-[#00FF88]/20">
                    {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-400">Tags (separados por coma)</Label>
                <Input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className="bg-[#1E1E2E] border-[#00FF88]/20 mt-1" placeholder="arte, moderno, colores" />
              </div>
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
              <TableHead className="text-gray-400">Imagen</TableHead>
              <TableHead className="text-gray-400">Nombre</TableHead>
              <TableHead className="text-gray-400">Categoría</TableHead>
              <TableHead className="text-gray-400">Tags</TableHead>
              <TableHead className="text-gray-400 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map(tmpl => (
              <TableRow key={tmpl.template_id} className="border-b border-[#00FF88]/5">
                <TableCell>
                  <img src={tmpl.image_url} alt="" className="h-12 w-12 rounded object-cover border border-[#00FF88]/20" />
                </TableCell>
                <TableCell className="font-medium">{tmpl.name}</TableCell>
                <TableCell className="capitalize text-gray-400">{tmpl.category}</TableCell>
                <TableCell className="text-gray-500 text-xs">{(tmpl.tags || []).join(', ')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(tmpl)} className="hover:bg-[#00FF88]/10">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(tmpl.template_id)} className="text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
