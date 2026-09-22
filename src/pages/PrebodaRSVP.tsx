import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, Heart } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/wedding/LanguageSelector';

const schema = z.object({
  name: z.string().trim().min(1, 'required').max(200),
  attending: z.boolean(),
  guestCount: z.number().min(1).max(20),
});

const inputClass =
  'w-full bg-transparent border-b border-primary/20 py-2 font-body text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none transition-colors';

const PrebodaRSVP = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (attending === null) {
      setErrors({ attending: t('sections.prebodaRsvp.required') });
      return;
    }

    const result = schema.safeParse({
      name,
      attending,
      guestCount: attending ? guestCount : 1,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[String(err.path[0])] = t(`sections.prebodaRsvp.${err.message}`);
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('preboda_rsvp').insert({
        name: result.data.name,
        attending: result.data.attending,
        guest_count: result.data.attending ? result.data.guestCount : 0,
      } as never);
      if (error) throw error;
      setIsSuccess(true);
    } catch (err) {
      toast({
        title: t('sections.prebodaRsvp.errorTitle'),
        description: t('sections.prebodaRsvp.errorMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <a href="/" className="font-serif text-lg tracking-wide text-foreground">
          Irene &amp; Marco
        </a>
        <LanguageSelector />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-primary/40" />
            <span className="text-primary/50 text-xs">✦</span>
            <div className="w-12 h-px bg-primary/40" />
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-center tracking-wide text-foreground mb-3">
            {t('sections.prebodaRsvp.title')}
          </h1>
          <p className="font-body italic text-center text-muted-foreground mb-10">
            {t('sections.prebodaRsvp.subtitle')}
          </p>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/30 border border-primary/10 rounded-2xl p-10 text-center"
              >
                <Heart className="w-10 h-10 text-primary/60 mx-auto mb-5" />
                <h2 className="font-serif text-2xl text-foreground mb-3">
                  {attending
                    ? t('sections.prebodaRsvp.successTitle')
                    : t('sections.prebodaRsvp.successTitleNotAttending')}
                </h2>
                <p className="font-body text-muted-foreground">
                  {attending
                    ? t('sections.prebodaRsvp.successMessage')
                    : t('sections.prebodaRsvp.successNotAttending')}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/30 border border-primary/10 rounded-2xl p-8 md:p-10 space-y-8"
              >
                {/* Name */}
                <div>
                  <Label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground">
                    {t('sections.prebodaRsvp.name')}
                  </Label>
                  <input
                    type="text"
                    value={name}
                    maxLength={200}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((p) => ({ ...p, name: '' }));
                    }}
                    placeholder={t('sections.prebodaRsvp.namePlaceholder')}
                    className={`${inputClass} mt-2`}
                  />
                  {errors.name && (
                    <p className="font-body text-xs text-destructive mt-2">{errors.name}</p>
                  )}
                </div>

                {/* Attending */}
                <div>
                  <Label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground">
                    {t('sections.prebodaRsvp.willAttend')}
                  </Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setAttending(true);
                        setErrors((p) => ({ ...p, attending: '' }));
                      }}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-body text-sm transition-colors ${
                        attending === true
                          ? 'border-primary/60 bg-primary/10 text-foreground'
                          : 'border-primary/15 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      {t('sections.prebodaRsvp.attending')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAttending(false);
                        setErrors((p) => ({ ...p, attending: '' }));
                      }}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-body text-sm transition-colors ${
                        attending === false
                          ? 'border-primary/60 bg-primary/10 text-foreground'
                          : 'border-primary/15 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      {t('sections.prebodaRsvp.notAttending')}
                    </button>
                  </div>
                  {errors.attending && (
                    <p className="font-body text-xs text-destructive mt-2">{errors.attending}</p>
                  )}
                </div>

                {/* Conditional fields */}
                <AnimatePresence>
                  {attending === true && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-8 overflow-hidden"
                    >
                      <div>
                        <Label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground">
                          {t('sections.prebodaRsvp.guestCount')}
                        </Label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className={`${inputClass} mt-2`}
                        />
                        {errors.guestCount && (
                          <p className="font-body text-xs text-destructive mt-2">
                            {errors.guestCount}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-body text-xs tracking-[0.2em] uppercase py-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('sections.prebodaRsvp.submitting')}
                    </>
                  ) : (
                    t('sections.prebodaRsvp.submit')
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default PrebodaRSVP;
