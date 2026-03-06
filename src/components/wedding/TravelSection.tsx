import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Globe, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import hotelImg from '@/assets/hotel-orizzonte.jpg';

const HOTEL_WEB = 'https://www.horizzonte.com/';

const TravelSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [form, setForm] = useState({ guest_name: '', people_count: '', check_in: '', check_out: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guest_name || !form.people_count || !form.check_in || !form.check_out) return;

    setSubmitting(true);
    const { error } = await (supabase.from as any)('hotel_requests').insert({
      guest_name: form.guest_name.trim(),
      people_count: parseInt(form.people_count),
      check_in: form.check_in,
      check_out: form.check_out,
    });

    setSubmitting(false);

    if (error) {
      toast({ title: t('sections.travel.requestError'), variant: 'destructive' });
      return;
    }

    window.umami?.track('hotel_alternative_request');
    setSubmitted(true);
    toast({ title: t('sections.travel.requestSuccess') });
  };

  return (
    <section id="travel" ref={ref} className="section-padding bg-secondary/80">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-primary/40" />
            <span className="text-primary/50 text-xs">✦</span>
            <div className="w-12 h-px bg-primary/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide text-foreground mb-4">
            {t('sections.travel.title')}
          </h2>
          <p className="font-body italic text-lg md:text-xl text-muted-foreground">
            {t('sections.travel.subtitle')}
          </p>
        </motion.div>

        {/* Alternative Accommodation Form — TOP PRIORITY */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-background rounded-xl overflow-hidden border border-border shadow-sm p-6 md:p-8 mb-8"
        >
          <h4 className="font-serif text-xl md:text-2xl text-foreground mb-2">{t('sections.travel.alternativeTitle')}</h4>
          <p className="font-body text-sm text-muted-foreground mb-6">{t('sections.travel.alternativeDescription')}</p>

          {submitted ? (
            <div className="text-center py-6 bg-primary/5 rounded-lg border border-primary/20">
              <p className="font-serif text-lg text-foreground">{t('sections.travel.requestSuccess')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="font-body text-sm">{t('sections.travel.guestName')} *</Label>
                <Input
                  value={form.guest_name}
                  onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                  placeholder={t('sections.travel.guestNamePlaceholder')}
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <Label className="font-body text-sm">{t('sections.travel.peopleCount')} *</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={form.people_count}
                  onChange={(e) => setForm({ ...form, people_count: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-sm">{t('sections.travel.checkIn')} *</Label>
                  <Input
                    type="date"
                    value={form.check_in}
                    onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label className="font-body text-sm">{t('sections.travel.checkOut')} *</Label>
                  <Input
                    type="date"
                    value={form.check_out}
                    onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={submitting}>
                <Send className="w-4 h-4" />
                {submitting ? t('sections.rsvp.submitting') : t('sections.travel.submitRequest')}
              </Button>
            </form>
          )}
        </motion.div>

        {/* Hotel Card — Reduced & greyed out */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="max-w-sm mx-auto bg-background rounded-xl overflow-hidden border border-border shadow-sm opacity-80"
        >
          <div className="relative h-36 overflow-hidden">
            <img
              src={hotelImg}
              alt="Hotel Orizzonte"
              className="w-full h-full object-cover grayscale brightness-50"
            />
            <div className="absolute top-0 right-0 overflow-hidden w-28 h-28">
              <div className="absolute top-[14px] right-[-30px] w-[150px] text-center rotate-45 bg-destructive text-destructive-foreground font-bold text-xs py-1 shadow-lg tracking-wider uppercase">
                {t('sections.travel.soldOut')}
              </div>
            </div>
          </div>
          <div className="p-4 text-center space-y-2">
            <h3 className="font-serif text-lg text-foreground/60">Hotel Orizzonte</h3>
            <p className="font-body text-sm font-bold text-destructive">
              {t('sections.travel.allRoomsBooked')}
            </p>
            <a
              href={HOTEL_WEB}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:underline"
            >
              <Globe className="w-3 h-3" />
              {t('sections.travel.visitWeb')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TravelSection;
