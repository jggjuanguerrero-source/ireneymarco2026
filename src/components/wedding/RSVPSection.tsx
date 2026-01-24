import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, Heart } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Validation schema
const rsvpSchema = z.object({
  firstName: z.string().trim().min(1, 'required').max(100),
  lastName: z.string().trim().min(1, 'required').max(100),
  email: z.string().trim().email('invalidEmail').max(255),
  rsvpStatus: z.boolean(),
  plusOne: z.boolean(),
  plusOneName: z.string().trim().max(200).optional(),
  dietaryReqs: z.string().trim().max(500).optional(),
});

type RSVPFormData = z.infer<typeof rsvpSchema>;

const RSVPSection = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attendingChoice, setAttendingChoice] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<RSVPFormData>({
    firstName: '',
    lastName: '',
    email: '',
    rsvpStatus: true,
    plusOne: false,
    plusOneName: '',
    dietaryReqs: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RSVPFormData, string>>>({});

  const handleInputChange = (field: keyof RSVPFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const dataToValidate = {
      ...formData,
      rsvpStatus: attendingChoice ?? false,
    };

    const result = rsvpSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RSVPFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof RSVPFormData;
        fieldErrors[field] = t(`sections.rsvp.${err.message}`);
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('guests').insert({
        first_name: result.data.firstName,
        last_name: result.data.lastName,
        email: result.data.email,
        rsvp_status: result.data.rsvpStatus,
        plus_one: result.data.plusOne,
        plus_one_name: result.data.plusOneName || null,
        dietary_reqs: result.data.dietaryReqs || null,
        language: i18n.language,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: t('sections.rsvp.successTitle'),
        description: result.data.rsvpStatus
          ? t('sections.rsvp.successMessage')
          : t('sections.rsvp.successNotAttending'),
      });
    } catch (error) {
      toast({
        title: t('sections.rsvp.errorTitle'),
        description: t('sections.rsvp.errorMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" ref={ref} className="section-padding bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-primary/40" />
            <span className="text-primary/50 text-xs">✦</span>
            <div className="w-12 h-px bg-primary/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide text-foreground mb-4">
            {t('sections.rsvp.title')}
          </h2>
          <p className="font-body italic text-lg md:text-xl text-muted-foreground">
            {t('sections.rsvp.subtitle')}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Heart className="w-10 h-10 text-primary fill-primary" />
              </motion.div>
              <h3 className="font-serif text-2xl text-foreground mb-3">
                {t('sections.rsvp.successTitle')}
              </h3>
              <p className="font-body text-muted-foreground">
                {attendingChoice
                  ? t('sections.rsvp.successMessage')
                  : t('sections.rsvp.successNotAttending')}
              </p>
            </motion.div>
          ) : (
            /* Form */
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-body text-foreground/80">
                    {t('sections.rsvp.firstName')} *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="bg-background/50 border-border focus:border-primary transition-colors font-body"
                    placeholder=""
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive font-body">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-body text-foreground/80">
                    {t('sections.rsvp.lastName')} *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="bg-background/50 border-border focus:border-primary transition-colors font-body"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive font-body">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-body text-foreground/80">
                  {t('sections.rsvp.email')} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-background/50 border-border focus:border-primary transition-colors font-body"
                />
                {errors.email && (
                  <p className="text-sm text-destructive font-body">{errors.email}</p>
                )}
              </div>

              {/* Attendance Toggle */}
              <div className="space-y-4">
                <Label className="font-body text-foreground/80">
                  {t('sections.rsvp.willAttend')} *
                </Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAttendingChoice(true);
                      handleInputChange('rsvpStatus', true);
                    }}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                      attendingChoice === true
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                    <span className="font-body">{t('sections.rsvp.attending')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttendingChoice(false);
                      handleInputChange('rsvpStatus', false);
                    }}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                      attendingChoice === false
                        ? 'border-muted-foreground bg-muted text-foreground'
                        : 'border-border bg-background hover:border-muted-foreground/50'
                    }`}
                  >
                    <X className="w-5 h-5" />
                    <span className="font-body">{t('sections.rsvp.notAttending')}</span>
                  </button>
                </div>
              </div>

              {/* Plus One - Only show if attending */}
              <AnimatePresence>
                {attendingChoice === true && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 overflow-hidden"
                  >
                    {/* Plus One Toggle */}
                    <div className="space-y-4">
                      <Label className="font-body text-foreground/80">
                        {t('sections.rsvp.plusOne')}
                      </Label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => handleInputChange('plusOne', true)}
                          className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 font-body ${
                            formData.plusOne
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background hover:border-primary/50'
                          }`}
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleInputChange('plusOne', false);
                            handleInputChange('plusOneName', '');
                          }}
                          className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 font-body ${
                            !formData.plusOne
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background hover:border-primary/50'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Plus One Name */}
                    <AnimatePresence>
                      {formData.plusOne && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="plusOneName" className="font-body text-foreground/80">
                            {t('sections.rsvp.plusOneName')}
                          </Label>
                          <Input
                            id="plusOneName"
                            value={formData.plusOneName}
                            onChange={(e) => handleInputChange('plusOneName', e.target.value)}
                            className="bg-background/50 border-border focus:border-primary transition-colors font-body"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Dietary Requirements */}
                    <div className="space-y-2">
                      <Label htmlFor="dietary" className="font-body text-foreground/80">
                        {t('sections.rsvp.dietary')}
                      </Label>
                      <Textarea
                        id="dietary"
                        value={formData.dietaryReqs}
                        onChange={(e) => handleInputChange('dietaryReqs', e.target.value)}
                        placeholder={t('sections.rsvp.dietaryPlaceholder')}
                        className="bg-background/50 border-border focus:border-primary transition-colors font-body min-h-[100px] resize-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: attendingChoice !== null ? 1 : 0.5 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  disabled={attendingChoice === null || isSubmitting}
                  className="w-full py-6 text-lg font-body tracking-wide"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('sections.rsvp.submitting')}
                    </>
                  ) : (
                    t('sections.rsvp.submit')
                  )}
                </Button>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RSVPSection;
