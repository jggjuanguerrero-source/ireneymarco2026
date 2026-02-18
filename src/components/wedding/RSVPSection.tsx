import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, Heart, Users, Bus, Ship } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
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
  hasChildren: z.boolean(),
  childrenCount: z.number().min(0).max(10).optional(),
  childrenNeeds: z.string().trim().max(500).optional(),
  dietaryReqs: z.string().trim().max(500).optional(),
  busIda: z.boolean(),
  busVuelta: z.boolean(),
  barcoIda: z.boolean(),
  barcoVuelta: z.boolean(),
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
    hasChildren: false,
    childrenCount: 0,
    childrenNeeds: '',
    dietaryReqs: '',
    busIda: false,
    busVuelta: false,
    barcoIda: false,
    barcoVuelta: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RSVPFormData, string>>>({});

  const handleInputChange = (field: keyof RSVPFormData, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        children_count: result.data.hasChildren ? result.data.childrenCount : 0,
        children_needs: result.data.hasChildren ? result.data.childrenNeeds || null : null,
        dietary_reqs: result.data.dietaryReqs || null,
        language: i18n.language,
        bus_ida: result.data.busIda,
        bus_vuelta: result.data.busVuelta,
        barco_ida: result.data.barcoIda,
        barco_vuelta: result.data.barcoVuelta,
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

  // Reusable toggle button style
  const toggleBtn = (active: boolean) =>
    `px-5 py-2 border transition-all duration-300 font-serif tracking-wide ${
      active
        ? 'border-primary bg-primary/15 text-primary'
        : 'border-primary/30 bg-transparent text-foreground/70 hover:border-primary/60'
    }`;

  // Transport checkbox component
  const TransportCheckbox = ({
    field,
    label,
    icon: Icon,
  }: {
    field: 'busIda' | 'busVuelta' | 'barcoIda' | 'barcoVuelta';
    label: string;
    icon: React.ElementType;
  }) => (
    <button
      type="button"
      onClick={() => handleInputChange(field, !formData[field])}
      className={`flex items-center gap-2.5 px-4 py-3 border transition-all duration-300 font-body text-sm ${
        formData[field]
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-primary/20 bg-transparent text-foreground/60 hover:border-primary/50'
      }`}
    >
      <div
        className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
          formData[field] ? 'border-primary bg-primary' : 'border-primary/40'
        }`}
      >
        {formData[field] && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );

  return (
    <section id="rsvp" ref={ref} className="section-padding bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
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
              className="space-y-10"
            >
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-body text-foreground/80 text-base">
                    {t('sections.rsvp.firstName')} *
                  </Label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="input-underline w-full text-lg"
                    placeholder=""
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive font-body">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-body text-foreground/80 text-base">
                    {t('sections.rsvp.lastName')} *
                  </Label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="input-underline w-full text-lg"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive font-body">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-body text-foreground/80 text-base">
                  {t('sections.rsvp.email')} *
                </Label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input-underline w-full text-lg"
                />
                {errors.email && (
                  <p className="text-sm text-destructive font-body">{errors.email}</p>
                )}
              </div>

              {/* Attendance Toggle */}
              <div className="space-y-4">
                <Label className="font-body text-foreground/80 text-base">
                  {t('sections.rsvp.willAttend')} *
                </Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAttendingChoice(true);
                      handleInputChange('rsvpStatus', true);
                    }}
                    className={`flex-1 py-3 px-6 border transition-all duration-300 flex items-center justify-center gap-3 font-serif tracking-wide ${
                      attendingChoice === true
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-primary/30 bg-transparent text-foreground/70 hover:border-primary/60'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{t('sections.rsvp.attending')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttendingChoice(false);
                      handleInputChange('rsvpStatus', false);
                    }}
                    className={`flex-1 py-3 px-6 border transition-all duration-300 flex items-center justify-center gap-3 font-serif tracking-wide ${
                      attendingChoice === false
                        ? 'border-muted-foreground bg-muted/30 text-foreground'
                        : 'border-primary/30 bg-transparent text-foreground/70 hover:border-muted-foreground/60'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>{t('sections.rsvp.notAttending')}</span>
                  </button>
                </div>
              </div>

              {/* Fields only shown when attending */}
              <AnimatePresence>
                {attendingChoice === true && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-10 overflow-hidden"
                  >
                    {/* Plus One Toggle */}
                    <div className="space-y-3">
                      <Label className="font-body text-foreground/80 text-base">
                        {t('sections.rsvp.plusOne')}
                      </Label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleInputChange('plusOne', true)}
                          className={toggleBtn(formData.plusOne)}
                        >
                          {t('sections.rsvp.yes')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleInputChange('plusOne', false);
                            handleInputChange('plusOneName', '');
                          }}
                          className={toggleBtn(!formData.plusOne)}
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
                          className="space-y-2 pl-4 border-l-2 border-primary/20"
                        >
                          <Label htmlFor="plusOneName" className="font-body text-foreground/80 text-base">
                            {t('sections.rsvp.plusOneName')}
                          </Label>
                          <input
                            id="plusOneName"
                            type="text"
                            value={formData.plusOneName}
                            onChange={(e) => handleInputChange('plusOneName', e.target.value)}
                            className="input-underline w-full text-lg"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Children Toggle */}
                    <div className="space-y-3">
                      <Label className="font-body text-foreground/80 text-base flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary/70" />
                        {t('sections.rsvp.childrenQuestion')}
                      </Label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleInputChange('hasChildren', true)}
                          className={toggleBtn(formData.hasChildren)}
                        >
                          {t('sections.rsvp.yes')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleInputChange('hasChildren', false);
                            handleInputChange('childrenCount', 0);
                            handleInputChange('childrenNeeds', '');
                          }}
                          className={toggleBtn(!formData.hasChildren)}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Children Details */}
                    <AnimatePresence>
                      {formData.hasChildren && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 pl-4 border-l-2 border-primary/20"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="childrenCount" className="font-body text-foreground/80 text-base">
                              {t('sections.rsvp.childrenCount')}
                            </Label>
                            <input
                              id="childrenCount"
                              type="number"
                              min="1"
                              max="10"
                              value={formData.childrenCount || ''}
                              onChange={(e) =>
                                handleInputChange('childrenCount', parseInt(e.target.value) || 0)
                              }
                              className="input-underline w-full text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="childrenNeeds" className="font-body text-foreground/80 text-base">
                              {t('sections.rsvp.childrenNeeds')}
                            </Label>
                            <input
                              id="childrenNeeds"
                              type="text"
                              value={formData.childrenNeeds}
                              onChange={(e) => handleInputChange('childrenNeeds', e.target.value)}
                              placeholder={t('sections.rsvp.childrenNeedsPlaceholder')}
                              className="input-underline w-full text-lg"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Dietary Requirements */}
                    <div className="space-y-2">
                      <Label htmlFor="dietary" className="font-body text-foreground/80 text-base">
                        {t('sections.rsvp.dietary')}
                      </Label>
                      <textarea
                        id="dietary"
                        value={formData.dietaryReqs}
                        onChange={(e) => handleInputChange('dietaryReqs', e.target.value)}
                        placeholder={t('sections.rsvp.dietaryPlaceholder')}
                        className="input-underline w-full text-lg min-h-[80px] resize-none"
                      />
                    </div>

                    {/* Transport */}
                    <div className="space-y-4">
                      <Label className="font-body text-foreground/80 text-base">
                        {t('sections.rsvp.transport')}
                      </Label>
                      <p className="font-body text-sm text-muted-foreground -mt-2">
                        {t('sections.rsvp.transportDescription')}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <TransportCheckbox
                          field="busIda"
                          label={t('sections.rsvp.busIda')}
                          icon={Bus}
                        />
                        <TransportCheckbox
                          field="busVuelta"
                          label={t('sections.rsvp.busVuelta')}
                          icon={Bus}
                        />
                        <TransportCheckbox
                          field="barcoIda"
                          label={t('sections.rsvp.barcoIda')}
                          icon={Ship}
                        />
                        <TransportCheckbox
                          field="barcoVuelta"
                          label={t('sections.rsvp.barcoVuelta')}
                          icon={Ship}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: attendingChoice !== null ? 1 : 0.5 }}
                className="pt-6"
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
