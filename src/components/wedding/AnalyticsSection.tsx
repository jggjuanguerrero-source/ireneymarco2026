import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronLeft, ChevronRight, Loader2, RefreshCw } from 'lucide-react';

interface AnalyticsData {
  summary: {
    total_events: number;
    confirmations: number;
    declines: number;
    emails_sent: number;
    emails_failed: number;
  };
  engagement: {
    iban_clicks: number;
    hotel_clicks: number;
  };
  languages: Record<string, number>;
  funnel: {
    form_views: number;
    form_starts: number;
    form_submits: number;
  };
  event_types: Record<string, number>;
}

type DatePreset = 'today' | '24h' | '7d' | '30d' | '90d' | 'this_week' | 'this_month' | 'this_year' | 'all';

const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: 'today', label: 'Hoy' },
  { value: '24h', label: 'Últimas 24 horas' },
  { value: 'this_week', label: 'Esta semana' },
  { value: '7d', label: 'Últimos 7 días' },
  { value: 'this_month', label: 'Este mes' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: 'this_year', label: 'Este año' },
  { value: 'all', label: 'Todo el tiempo' },
];

function getDateRange(preset: DatePreset): { from: string | null; to: string | null; label: string } {
  const now = new Date();
  const toISO = (d: Date) => d.toISOString();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  switch (preset) {
    case 'today':
      return { from: toISO(startOfDay(now)), to: toISO(now), label: 'Hoy' };
    case '24h':
      return { from: toISO(new Date(now.getTime() - 86400000)), to: toISO(now), label: 'Últimas 24h' };
    case 'this_week': {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const monday = startOfDay(new Date(now.getTime() - diff * 86400000));
      return { from: toISO(monday), to: toISO(now), label: 'Esta semana' };
    }
    case '7d':
      return { from: toISO(new Date(now.getTime() - 7 * 86400000)), to: toISO(now), label: 'Últimos 7 días' };
    case 'this_month':
      return { from: toISO(new Date(now.getFullYear(), now.getMonth(), 1)), to: toISO(now), label: 'Este mes' };
    case '30d':
      return { from: toISO(new Date(now.getTime() - 30 * 86400000)), to: toISO(now), label: 'Últimos 30 días' };
    case '90d':
      return { from: toISO(new Date(now.getTime() - 90 * 86400000)), to: toISO(now), label: 'Últimos 90 días' };
    case 'this_year':
      return { from: toISO(new Date(now.getFullYear(), 0, 1)), to: toISO(now), label: 'Este año' };
    case 'all':
      return { from: null, to: null, label: 'Todo el tiempo' };
  }
}

// --- Sub-components with dark Umami-style ---

const MetricCard = ({ label, value, accent }: { label: string; value: number; accent?: string }) => (
  <div className="rounded-lg bg-[#1a1a2e] border border-[#2a2a4a] p-4 flex flex-col items-center justify-center min-h-[90px]">
    <p className={`text-3xl font-bold tracking-tight ${accent || 'text-white'}`}>{value.toLocaleString()}</p>
    <p className="text-xs text-[#8888aa] mt-1 uppercase tracking-wider">{label}</p>
  </div>
);

const LanguageBar = ({ label, value, total, color }: { label: string; value: number; total: number; color: string }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#ccccdd]">{label}</span>
        <span className="text-white font-semibold tabular-nums">{value} <span className="text-[#8888aa] font-normal">({pct}%)</span></span>
      </div>
      <div className="w-full bg-[#1a1a2e] rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.max(pct, 1)}%` }} />
      </div>
    </div>
  );
};

const FunnelRow = ({ label, value, prevValue, color }: { label: string; value: number; prevValue?: number; color: string }) => {
  const rate = prevValue && prevValue > 0 ? Math.round((value / prevValue) * 100) : null;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#2a2a4a] last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="text-[#ccccdd] text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white font-bold tabular-nums">{value.toLocaleString()}</span>
        {rate !== null && (
          <span className="text-xs text-[#8888aa] tabular-nums w-12 text-right">{rate}%</span>
        )}
      </div>
    </div>
  );
};

const EventRow = ({ name, count, total }: { name: string; count: number; total: number }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#2a2a4a] last:border-0">
      <span className="text-[#ccccdd] text-sm font-mono">{name}</span>
      <div className="flex items-center gap-3">
        <span className="text-white font-bold tabular-nums">{count}</span>
        <span className="text-xs text-[#8888aa] tabular-nums w-10 text-right">{pct}%</span>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold text-[#8888aa] uppercase tracking-widest mb-3">{children}</h3>
);

// --- Main component ---

const AnalyticsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [preset, setPreset] = useState<DatePreset>('all');

  const fetchData = useCallback(async (datePreset: DatePreset) => {
    setLoading(true);
    setError(null);
    try {
      const range = getDateRange(datePreset);
      const params: Record<string, string> = {};
      if (range.from) params.from = range.from;
      if (range.to) params.to = range.to;

      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `get-analytics?${queryString}` : 'get-analytics';

      const { data: result, error: fnError } = await supabase.functions.invoke(url);
      if (fnError) throw fnError;
      setData(result as AnalyticsData);
      setHasFetched(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error cargando analítica');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && !hasFetched) {
      fetchData(preset);
    }
  };

  const handlePresetChange = (value: string) => {
    const newPreset = value as DatePreset;
    setPreset(newPreset);
    if (isOpen) fetchData(newPreset);
  };

  // Navigate presets with arrows
  const currentIndex = DATE_PRESETS.findIndex(p => p.value === preset);
  const goPrev = () => {
    if (currentIndex > 0) handlePresetChange(DATE_PRESETS[currentIndex - 1].value);
  };
  const goNext = () => {
    if (currentIndex < DATE_PRESETS.length - 1) handlePresetChange(DATE_PRESETS[currentIndex + 1].value);
  };

  const totalLangs = data ? Object.values(data.languages).reduce((a, b) => a + b, 0) : 0;
  const totalEvents = data?.summary.total_events || 0;

  return (
    <div className="rounded-xl overflow-hidden border border-[#2a2a4a] bg-[#0d0d1a] shadow-2xl">
      <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full px-5 py-4 hover:bg-[#1a1a2e] transition-colors">
            <span className="flex items-center gap-2 font-semibold text-white text-base tracking-wide">
              📊 Analítica de Eventos
            </span>
            <ChevronDown
              className={`w-5 h-5 text-[#8888aa] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 pb-6 space-y-6">
            {/* Date filter bar */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={goPrev}
                disabled={currentIndex <= 0}
                className="p-1.5 rounded-md border border-[#2a2a4a] bg-[#1a1a2e] text-[#8888aa] hover:text-white hover:border-[#4a4a6a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goNext}
                disabled={currentIndex >= DATE_PRESETS.length - 1}
                className="p-1.5 rounded-md border border-[#2a2a4a] bg-[#1a1a2e] text-[#8888aa] hover:text-white hover:border-[#4a4a6a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <Select value={preset} onValueChange={handlePresetChange}>
                <SelectTrigger className="w-[200px] bg-[#1a1a2e] border-[#2a2a4a] text-white text-sm hover:border-[#4a4a6a] focus:ring-[#4a4a6a]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-[#2a2a4a]">
                  {DATE_PRESETS.map(p => (
                    <SelectItem key={p.value} value={p.value} className="text-[#ccccdd] focus:bg-[#2a2a4a] focus:text-white">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={() => fetchData(preset)}
                disabled={loading}
                className="p-1.5 rounded-md border border-[#2a2a4a] bg-[#1a1a2e] text-[#8888aa] hover:text-white hover:border-[#4a4a6a] disabled:opacity-30 transition-colors ml-auto"
                title="Refrescar"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-[#8888aa]" />
                <span className="ml-2 text-[#8888aa] text-sm">Cargando...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-800/40 rounded-lg p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {data && !loading && (
              <>
                {/* Summary */}
                <div>
                  <SectionTitle>Resumen</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <MetricCard label="Total Eventos" value={data.summary.total_events} />
                    <MetricCard label="Confirmaciones" value={data.summary.confirmations} accent="text-emerald-400" />
                    <MetricCard label="Rechazos" value={data.summary.declines} accent="text-red-400" />
                    <MetricCard label="Emails Enviados" value={data.summary.emails_sent} accent="text-blue-400" />
                    <MetricCard label="Emails Fallidos" value={data.summary.emails_failed} accent="text-amber-400" />
                  </div>
                </div>

                {/* Engagement */}
                <div>
                  <SectionTitle>Engagement</SectionTitle>
                  <div className="grid grid-cols-2 gap-3">
                    <MetricCard label="Copiar IBAN" value={data.engagement.iban_clicks} accent="text-violet-400" />
                    <MetricCard label="Clics Hoteles" value={data.engagement.hotel_clicks} accent="text-cyan-400" />
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <SectionTitle>Idiomas</SectionTitle>
                  <div className="bg-[#12122a] rounded-lg p-4 space-y-3 border border-[#2a2a4a]">
                    <LanguageBar label="🇪🇸 Español" value={data.languages.es || 0} total={totalLangs} color="bg-red-500" />
                    <LanguageBar label="🇬🇧 Inglés" value={data.languages.en || 0} total={totalLangs} color="bg-blue-500" />
                    <LanguageBar label="🇮🇹 Italiano" value={data.languages.it || 0} total={totalLangs} color="bg-emerald-500" />
                  </div>
                </div>

                {/* RSVP Funnel */}
                <div>
                  <SectionTitle>Embudo RSVP</SectionTitle>
                  <div className="bg-[#12122a] rounded-lg p-4 border border-[#2a2a4a]">
                    <FunnelRow label="Vistas del formulario" value={data.funnel.form_views} color="bg-blue-500" />
                    <FunnelRow label="Inicio de formulario" value={data.funnel.form_starts} prevValue={data.funnel.form_views} color="bg-violet-500" />
                    <FunnelRow label="Envíos completados" value={data.funnel.form_submits} prevValue={data.funnel.form_starts} color="bg-emerald-500" />
                  </div>
                </div>

                {/* Event breakdown table */}
                {Object.keys(data.event_types).length > 0 && (
                  <div>
                    <SectionTitle>Eventos</SectionTitle>
                    <div className="bg-[#12122a] rounded-lg border border-[#2a2a4a]">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2a4a]">
                        <span className="text-xs font-semibold text-[#8888aa] uppercase">Evento</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-[#8888aa] uppercase">Count</span>
                          <span className="text-xs font-semibold text-[#8888aa] uppercase w-10 text-right">%</span>
                        </div>
                      </div>
                      <div className="px-4">
                        {Object.entries(data.event_types)
                          .sort(([, a], [, b]) => b - a)
                          .map(([type, count]) => (
                            <EventRow key={type} name={type} count={count} total={totalEvents} />
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AnalyticsSection;
