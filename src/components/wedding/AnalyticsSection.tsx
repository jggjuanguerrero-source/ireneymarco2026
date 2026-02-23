import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Loader2 } from 'lucide-react';

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

const StatCard = ({ label, value, emoji }: { label: string; value: number; emoji: string }) => (
  <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm text-center">
    <p className="text-2xl mb-1">{emoji}</p>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-xs text-slate-500 mt-1">{label}</p>
  </div>
);

const BarSegment = ({ label, value, total, color }: { label: string; value: number; total: number; color: string }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-800">{value} ({pct}%)</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const FunnelStep = ({ label, value, prevValue, emoji }: { label: string; value: number; prevValue?: number; emoji: string }) => {
  const dropoff = prevValue && prevValue > 0 ? Math.round(((prevValue - value) / prevValue) * 100) : null;
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-800">{value}</span>
          <span className="text-sm text-slate-500">{label}</span>
        </div>
        {dropoff !== null && dropoff > 0 && (
          <p className="text-xs text-red-400">↓ {dropoff}% pérdida</p>
        )}
      </div>
    </div>
  );
};

const AnalyticsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && !hasFetched) {
      setLoading(true);
      setError(null);
      try {
        const { data: result, error: fnError } = await supabase.functions.invoke('get-analytics');
        if (fnError) throw fnError;
        setData(result as AnalyticsData);
        setHasFetched(true);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error cargando analítica');
      } finally {
        setLoading(false);
      }
    }
  };

  const totalLangs = data ? Object.values(data.languages).reduce((a, b) => a + b, 0) : 0;

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full p-4 hover:bg-slate-50 transition-colors rounded-t-lg">
            <span className="flex items-center gap-2 font-semibold text-slate-800 text-lg">
              📊 Ver Analítica Detallada de Eventos
            </span>
            <ChevronDown
              className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-6 space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-500">Cargando analítica...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {data && !loading && (
              <>
                {/* Summary */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Resumen General</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <StatCard emoji="📨" label="Total Eventos" value={data.summary.total_events} />
                    <StatCard emoji="✅" label="Confirmaciones" value={data.summary.confirmations} />
                    <StatCard emoji="❌" label="Rechazos" value={data.summary.declines} />
                    <StatCard emoji="📧" label="Emails Enviados" value={data.summary.emails_sent} />
                    <StatCard emoji="⚠️" label="Emails Fallidos" value={data.summary.emails_failed} />
                  </div>
                </div>

                {/* Engagement */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Engagement</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard emoji="🏦" label="Clics en copiar IBAN" value={data.engagement.iban_clicks} />
                    <StatCard emoji="🏨" label="Clics en Hoteles" value={data.engagement.hotel_clicks} />
                  </div>
                  {data.engagement.iban_clicks === 0 && data.engagement.hotel_clicks === 0 && (
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      Los eventos de engagement se registrarán cuando se añada tracking del lado cliente a la tabla rsvp_events.
                    </p>
                  )}
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Distribución de Idiomas</h3>
                  <CardContent className="p-0 space-y-3">
                    <BarSegment label="🇪🇸 Español" value={data.languages.es || 0} total={totalLangs} color="bg-red-400" />
                    <BarSegment label="🇬🇧 Inglés" value={data.languages.en || 0} total={totalLangs} color="bg-blue-400" />
                    <BarSegment label="🇮🇹 Italiano" value={data.languages.it || 0} total={totalLangs} color="bg-green-400" />
                  </CardContent>
                </div>

                {/* RSVP Funnel */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Embudo RSVP</h3>
                  <div className="space-y-3 bg-slate-50 rounded-lg p-4">
                    <FunnelStep emoji="👁️" label="Vistas del formulario" value={data.funnel.form_views} />
                    <FunnelStep emoji="✏️" label="Inicio de formulario" value={data.funnel.form_starts} prevValue={data.funnel.form_views} />
                    <FunnelStep emoji="🎯" label="Envíos completados" value={data.funnel.form_submits} prevValue={data.funnel.form_starts} />
                  </div>
                  {data.funnel.form_views === 0 && (
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      Las vistas e inicios de formulario se registrarán cuando se añada tracking del lado cliente.
                    </p>
                  )}
                </div>

                {/* Raw event types */}
                {Object.keys(data.event_types).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Desglose por Tipo de Evento</h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(data.event_types)
                          .sort(([, a], [, b]) => b - a)
                          .map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between text-sm">
                              <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">{type}</code>
                              <span className="font-medium text-slate-800">{count}</span>
                            </div>
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
    </Card>
  );
};

export default AnalyticsSection;
