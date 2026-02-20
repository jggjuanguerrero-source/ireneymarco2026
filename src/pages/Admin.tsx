import { useState, useEffect } from 'react';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  X,
  Check,
  ChevronDown,
  Undo2,
  CheckSquare,
  Download,
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
  song_processed: boolean;
  language: string;
  created_at: string;
  children_count: number | null;
  notes: string | null;
  bus_ida: boolean;
  bus_vuelta: boolean;
  barco_ida: boolean;
  barco_vuelta: boolean;
  preboda: boolean;
}

interface Metrics {
  total: number;
  confirmed: number;
  pending: number;
  dietary: number;
}

// Helper to detect anonymous song suggestions
const isAnonymousSuggestion = (guest: Guest): boolean => {
  return (
    guest.email.endsWith('@suggestion.local') ||
    guest.first_name === 'Anónimo' ||
    guest.first_name === 'Anónimo Sugerencia'
  );
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const langLabel = (code: string) => {
  const map: Record<string, string> = { es: '🇪🇸 ES', en: '🇬🇧 EN', it: '🇮🇹 IT' };
  return map[code] ?? code.toUpperCase();
};

const boolCell = (val: boolean) =>
  val ? (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
      <Check className="w-3 h-3" />
    </span>
  ) : (
    <span className="text-slate-300">—</span>
  );

// CSV Export
const downloadCSV = (guests: Guest[]) => {
  const headers = [
    'Nombre',
    'Apellidos',
    'Email',
    'Asistencia',
    'Pareja',
    'Nombre Pareja',
    'Niños',
    'Notas Niños',
    'Alergias/Dieta',
    'Canción',
    'Idioma',
    'Fecha Registro',
    'Bus',
    'Preboda',
  ];

  const rows = guests.map((g) => [
    g.first_name,
    g.last_name,
    g.email,
    g.rsvp_status === true ? 'Sí' : g.rsvp_status === false ? 'No' : 'Pendiente',
    g.plus_one ? 'Sí' : 'No',
    g.plus_one_name ?? '',
    g.children_count ?? 0,
    g.notes ?? '',
    g.dietary_reqs ?? '',
    g.song_request ?? '',
    g.language ?? '',
    formatDate(g.created_at),
    g.bus_ida ? 'Sí' : 'No',
    g.preboda ? 'Sí' : 'No',
  ]);

  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invitados_irene_marco_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const Admin = () => {
  const { toast } = useToast();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState(false);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ total: 0, confirmed: 0, pending: 0, dietary: 0 });
  const [loading, setLoading] = useState(true);

  // Collapsible states for song sections
  const [pendingSongsOpen, setPendingSongsOpen] = useState(true);
  const [addedSongsOpen, setAddedSongsOpen] = useState(false);

  // Add guest dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    first_name: '',
    last_name: '',
    email: '',
    rsvp_status: false,
    dietary_reqs: '',
  });

  const handleUnlock = () => {
    if (accessCode === ACCESS_CODE) {
      setIsUnlocked(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  const fetchGuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('last_name', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar los invitados', variant: 'destructive' });
      return;
    }

    const guestsData = (data || []) as Guest[];
    setGuests(guestsData);

    const realGuests = guestsData.filter((g) => !isAnonymousSuggestion(g));
    setMetrics({
      total: realGuests.length,
      confirmed: realGuests.filter((g) => g.rsvp_status === true).length,
      pending: realGuests.filter((g) => g.rsvp_status === null || g.rsvp_status === false).length,
      dietary: realGuests.filter((g) => g.dietary_reqs && g.dietary_reqs.trim() !== '').length,
    });

    setLoading(false);
  };

  useEffect(() => {
    if (isUnlocked) fetchGuests();
  }, [isUnlocked]);

  const handleToggleSongProcessed = async (guestId: string, processed: boolean) => {
    const { error } = await supabase
      .from('guests')
      .update({ song_processed: processed })
      .eq('id', guestId);

    if (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar el estado', variant: 'destructive' });
      return;
    }

    toast({
      title: processed ? '✓ Añadida a Spotify' : '↩ Movida a pendientes',
      description: processed ? 'Canción marcada como añadida' : 'Canción devuelta a pendientes',
    });

    fetchGuests();
  };

  const handleAddGuest = async () => {
    if (!newGuest.first_name || !newGuest.last_name || !newGuest.email) {
      toast({ title: 'Error', description: 'Nombre, apellidos y email son obligatorios', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('guests').insert({
      first_name: newGuest.first_name,
      last_name: newGuest.last_name,
      email: newGuest.email,
      rsvp_status: newGuest.rsvp_status,
      dietary_reqs: newGuest.dietary_reqs || null,
      language: 'es',
    });

    if (error) {
      toast({ title: 'Error', description: 'No se pudo añadir el invitado', variant: 'destructive' });
      return;
    }

    toast({ title: '✓ Invitado añadido', description: `${newGuest.first_name} ${newGuest.last_name} ha sido registrado` });

    setNewGuest({ first_name: '', last_name: '', email: '', rsvp_status: false, dietary_reqs: '' });
    setIsAddDialogOpen(false);
    fetchGuests();
  };

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    if (!confirm(`¿Seguro que quieres eliminar a ${guestName}?`)) return;

    const { error } = await supabase.from('guests').delete().eq('id', guestId);

    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el invitado', variant: 'destructive' });
      return;
    }

    toast({ title: '✓ Invitado eliminado', description: `${guestName} ha sido eliminado` });
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
                onChange={(e) => { setAccessCode(e.target.value); setCodeError(false); }}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                className={`text-center text-lg tracking-widest ${codeError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
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

  const realGuests = guests.filter((g) => !isAnonymousSuggestion(g));
  const allSongRequests = guests.filter((g) => g.song_request && g.song_request.trim() !== '');
  const pendingSongs = allSongRequests.filter((g) => !g.song_processed);
  const addedSongs = allSongRequests.filter((g) => g.song_processed);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Panel de Coordinación</h1>
            <p className="text-sm text-slate-500">Irene & Marco · Venecia 2026</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsUnlocked(false)}>
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
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-lg">Gestión de Invitados</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-slate-600"
                onClick={() => downloadCSV(realGuests)}
                disabled={realGuests.length === 0}
              >
                <Download className="w-4 h-4" />
                Descargar CSV
              </Button>
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
                          onChange={(e) => setNewGuest({ ...newGuest, first_name: e.target.value })}
                          placeholder="Nombre"
                        />
                      </div>
                      <div>
                        <Label>Apellidos *</Label>
                        <Input
                          value={newGuest.last_name}
                          onChange={(e) => setNewGuest({ ...newGuest, last_name: e.target.value })}
                          placeholder="Apellidos"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={newGuest.email}
                        onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                        placeholder="email@ejemplo.com"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="rsvp"
                        checked={newGuest.rsvp_status}
                        onCheckedChange={(checked) =>
                          setNewGuest({ ...newGuest, rsvp_status: checked as boolean })
                        }
                      />
                      <Label htmlFor="rsvp">Confirmado</Label>
                    </div>
                    <div>
                      <Label>Restricciones Alimentarias</Label>
                      <Input
                        value={newGuest.dietary_reqs}
                        onChange={(e) => setNewGuest({ ...newGuest, dietary_reqs: e.target.value })}
                        placeholder="Alergias, vegetariano, etc."
                      />
                    </div>
                    <Button onClick={handleAddGuest} className="w-full">
                      Guardar Invitado
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Cargando...</div>
            ) : realGuests.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No hay invitados registrados</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Asistencia</TableHead>
                      <TableHead>Alergias/Dieta</TableHead>
                      <TableHead className="text-center">Idioma</TableHead>
                      <TableHead className="text-center">🚌 Bus</TableHead>
                      <TableHead className="text-center">🎉 Preboda</TableHead>
                      <TableHead className="text-center">Registro</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {realGuests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800">
                              {guest.first_name} {guest.last_name}
                            </p>
                            <p className="text-xs text-slate-500">{guest.email}</p>
                            {guest.plus_one && guest.plus_one_name && (
                              <p className="text-xs text-slate-400 mt-1">+1: {guest.plus_one_name}</p>
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
                          <span className="text-sm">{langLabel(guest.language)}</span>
                        </TableCell>
                        <TableCell className="text-center">{boolCell(guest.bus_ida)}</TableCell>
                        <TableCell className="text-center">{boolCell(guest.preboda)}</TableCell>
                        <TableCell className="text-center text-xs text-slate-500 whitespace-nowrap">
                          {formatDate(guest.created_at)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() =>
                              handleDeleteGuest(guest.id, `${guest.first_name} ${guest.last_name}`)
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
              <span className="text-sm font-normal text-slate-500">({allSongRequests.length} total)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pending Songs */}
            <Collapsible open={pendingSongsOpen} onOpenChange={setPendingSongsOpen}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  <span className="flex items-center gap-2 font-medium text-amber-800">
                    🎵 Pendientes
                    <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-xs">
                      {pendingSongs.length}
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-600 transition-transform ${pendingSongsOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                {pendingSongs.length === 0 ? (
                  <p className="text-slate-500 text-center py-4 text-sm">¡Todas las canciones han sido añadidas! 🎉</p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {pendingSongs.map((guest) => (
                      <div key={guest.id} className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-700 truncate">{guest.song_request}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              — {isAnonymousSuggestion(guest) ? 'Anónimo' : `${guest.first_name} ${guest.last_name}`}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 gap-1 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleToggleSongProcessed(guest.id, true)}
                          >
                            <CheckSquare className="w-3 h-3" />
                            Añadir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Added Songs */}
            <Collapsible open={addedSongsOpen} onOpenChange={setAddedSongsOpen}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="flex items-center gap-2 font-medium text-green-800">
                    ✅ Añadidas a Spotify
                    <span className="bg-green-200 text-green-900 px-2 py-0.5 rounded-full text-xs">
                      {addedSongs.length}
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-green-600 transition-transform ${addedSongsOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                {addedSongs.length === 0 ? (
                  <p className="text-slate-500 text-center py-4 text-sm">No hay canciones añadidas todavía</p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {addedSongs.map((guest) => (
                      <div key={guest.id} className="bg-green-50/50 rounded-lg p-3 border border-green-100">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-600 truncate line-through decoration-green-400">
                              {guest.song_request}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              — {isAnonymousSuggestion(guest) ? 'Anónimo' : `${guest.first_name} ${guest.last_name}`}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="shrink-0 gap-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                            onClick={() => handleToggleSongProcessed(guest.id, false)}
                          >
                            <Undo2 className="w-3 h-3" />
                            Deshacer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
