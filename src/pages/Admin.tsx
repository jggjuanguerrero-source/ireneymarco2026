import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Music,
  Trash2,
  UserPlus,
  Lock,
  Save,
  X,
  Check,
} from 'lucide-react';

// ============================================
// ACCESS CODE - Change this to your secret code
// ============================================
const ACCESS_CODE = 'VENECIA2026';

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  rsvp_status: boolean | null;
  table_id: number | null;
  dietary_reqs: string | null;
  song_request: string | null;
  plus_one: boolean | null;
  plus_one_name: string | null;
}

interface Metrics {
  total: number;
  confirmed: number;
  pending: number;
  dietary: number;
}

const Admin = () => {
  const { toast } = useToast();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ total: 0, confirmed: 0, pending: 0, dietary: 0 });
  const [loading, setLoading] = useState(true);
  const [editingTableId, setEditingTableId] = useState<{ id: string; value: string } | null>(null);
  
  // Add guest dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    first_name: '',
    last_name: '',
    email: '',
    rsvp_status: false,
    table_id: '',
    dietary_reqs: '',
  });

  // Check access code
  const handleUnlock = () => {
    if (accessCode === ACCESS_CODE) {
      setIsUnlocked(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  // Fetch guests data
  const fetchGuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('last_name', { ascending: true });

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los invitados',
        variant: 'destructive',
      });
      return;
    }

    const guestsData = data || [];
    setGuests(guestsData);

    // Calculate metrics
    setMetrics({
      total: guestsData.length,
      confirmed: guestsData.filter((g) => g.rsvp_status === true).length,
      pending: guestsData.filter((g) => g.rsvp_status === null || g.rsvp_status === false).length,
      dietary: guestsData.filter((g) => g.dietary_reqs && g.dietary_reqs.trim() !== '').length,
    });

    setLoading(false);
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchGuests();
    }
  }, [isUnlocked]);

  // Update table_id for a guest
  const handleUpdateTableId = async (guestId: string, tableId: string) => {
    const tableNumber = tableId ? parseInt(tableId, 10) : null;
    
    const { error } = await supabase
      .from('guests')
      .update({ table_id: tableNumber })
      .eq('id', guestId);

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la mesa',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '✓ Mesa actualizada',
      description: `Mesa asignada: ${tableNumber || 'Sin asignar'}`,
    });

    setEditingTableId(null);
    fetchGuests();
  };

  // Add new guest
  const handleAddGuest = async () => {
    if (!newGuest.first_name || !newGuest.last_name || !newGuest.email) {
      toast({
        title: 'Error',
        description: 'Nombre, apellidos y email son obligatorios',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('guests').insert({
      first_name: newGuest.first_name,
      last_name: newGuest.last_name,
      email: newGuest.email,
      rsvp_status: newGuest.rsvp_status,
      table_id: newGuest.table_id ? parseInt(newGuest.table_id, 10) : null,
      dietary_reqs: newGuest.dietary_reqs || null,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo añadir el invitado',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '✓ Invitado añadido',
      description: `${newGuest.first_name} ${newGuest.last_name} ha sido registrado`,
    });

    setNewGuest({
      first_name: '',
      last_name: '',
      email: '',
      rsvp_status: false,
      table_id: '',
      dietary_reqs: '',
    });
    setIsAddDialogOpen(false);
    fetchGuests();
  };

  // Delete guest
  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    if (!confirm(`¿Seguro que quieres eliminar a ${guestName}?`)) return;

    const { error } = await supabase.from('guests').delete().eq('id', guestId);

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el invitado',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '✓ Invitado eliminado',
      description: `${guestName} ha sido eliminado`,
    });

    fetchGuests();
  };

  // Lock Screen
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-slate-600" />
            </div>
            <CardTitle className="text-2xl font-semibold text-slate-800">
              Panel de Coordinación
            </CardTitle>
            <p className="text-slate-500 text-sm mt-2">
              Introduce el código de acceso para continuar
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Código de acceso..."
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value);
                  setCodeError(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                className={`text-center text-lg tracking-widest ${
                  codeError ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              {codeError && (
                <p className="text-red-500 text-sm text-center mt-2">
                  Código incorrecto. Inténtalo de nuevo.
                </p>
              )}
            </div>
            <Button onClick={handleUnlock} className="w-full" size="lg">
              Acceder
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Song requests (filtered)
  const songRequests = guests.filter(
    (g) => g.song_request && g.song_request.trim() !== ''
  );

  // Dashboard
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Panel de Coordinación
            </h1>
            <p className="text-sm text-slate-500">Irene & Marco · Venecia 2026</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUnlocked(false)}
          >
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{metrics.total}</p>
                  <p className="text-sm text-slate-500">Total Invitados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{metrics.confirmed}</p>
                  <p className="text-sm text-slate-500">Confirmados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{metrics.pending}</p>
                  <p className="text-sm text-slate-500">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{metrics.dietary}</p>
                  <p className="text-sm text-slate-500">Dietas Especiales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guest Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Gestión de Invitados</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Añadir Invitado
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir Nuevo Invitado</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre *</Label>
                      <Input
                        value={newGuest.first_name}
                        onChange={(e) =>
                          setNewGuest({ ...newGuest, first_name: e.target.value })
                        }
                        placeholder="Nombre"
                      />
                    </div>
                    <div>
                      <Label>Apellidos *</Label>
                      <Input
                        value={newGuest.last_name}
                        onChange={(e) =>
                          setNewGuest({ ...newGuest, last_name: e.target.value })
                        }
                        placeholder="Apellidos"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={newGuest.email}
                      onChange={(e) =>
                        setNewGuest({ ...newGuest, email: e.target.value })
                      }
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Mesa</Label>
                      <Input
                        type="number"
                        value={newGuest.table_id}
                        onChange={(e) =>
                          setNewGuest({ ...newGuest, table_id: e.target.value })
                        }
                        placeholder="Número de mesa"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <Checkbox
                        id="rsvp"
                        checked={newGuest.rsvp_status}
                        onCheckedChange={(checked) =>
                          setNewGuest({ ...newGuest, rsvp_status: checked as boolean })
                        }
                      />
                      <Label htmlFor="rsvp">Confirmado</Label>
                    </div>
                  </div>
                  <div>
                    <Label>Restricciones Alimentarias</Label>
                    <Input
                      value={newGuest.dietary_reqs}
                      onChange={(e) =>
                        setNewGuest({ ...newGuest, dietary_reqs: e.target.value })
                      }
                      placeholder="Alergias, vegetariano, etc."
                    />
                  </div>
                  <Button onClick={handleAddGuest} className="w-full">
                    Guardar Invitado
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Cargando...</div>
            ) : guests.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No hay invitados registrados
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Asistencia</TableHead>
                      <TableHead>Alergias/Dieta</TableHead>
                      <TableHead className="text-center">Mesa</TableHead>
                      <TableHead>Canción</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800">
                              {guest.first_name} {guest.last_name}
                            </p>
                            <p className="text-xs text-slate-500">{guest.email}</p>
                            {guest.plus_one && guest.plus_one_name && (
                              <p className="text-xs text-slate-400 mt-1">
                                +1: {guest.plus_one_name}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {guest.rsvp_status === true ? (
                            <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
                              <Check className="w-3 h-3" /> Sí
                            </span>
                          ) : guest.rsvp_status === false ? (
                            <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs">
                              <X className="w-3 h-3" /> No
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">Pendiente</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {guest.dietary_reqs ? (
                            <span className="text-sm text-slate-600 bg-rose-50 px-2 py-1 rounded">
                              {guest.dietary_reqs}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {editingTableId?.id === guest.id ? (
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                className="w-16 h-8 text-center text-sm"
                                value={editingTableId.value}
                                onChange={(e) =>
                                  setEditingTableId({
                                    ...editingTableId,
                                    value: e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateTableId(guest.id, editingTableId.value);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingTableId(null);
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleUpdateTableId(guest.id, editingTableId.value)
                                }
                              >
                                <Save className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                setEditingTableId({
                                  id: guest.id,
                                  value: guest.table_id?.toString() || '',
                                })
                              }
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium text-slate-700 transition-colors min-w-[48px]"
                            >
                              {guest.table_id || '—'}
                            </button>
                          )}
                        </TableCell>
                        <TableCell>
                          {guest.song_request ? (
                            <span className="text-sm text-slate-600 flex items-center gap-1">
                              <Music className="w-3 h-3" />
                              {guest.song_request}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() =>
                              handleDeleteGuest(
                                guest.id,
                                `${guest.first_name} ${guest.last_name}`
                              )
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Song Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Music className="w-5 h-5" />
              Peticiones de Canciones
              <span className="text-sm font-normal text-slate-500">
                ({songRequests.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {songRequests.length === 0 ? (
              <p className="text-slate-500 text-center py-4">
                No hay peticiones de canciones todavía
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {songRequests.map((guest) => (
                  <div
                    key={guest.id}
                    className="bg-slate-50 rounded-lg p-3 border border-slate-100"
                  >
                    <p className="font-medium text-slate-700">{guest.song_request}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      — {guest.first_name} {guest.last_name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
