import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Search, Loader2, MapPin, RotateCcw, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  table_id: number | null;
}

type SearchState = 'idle' | 'loading' | 'single' | 'multiple' | 'notFound';

const SeatFinderSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [results, setResults] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!searchQuery.trim()) return;

    setSearchState('loading');
    setSelectedGuest(null);

    try {
      // Search for partial matches (case insensitive) in first_name and last_name
      const { data, error } = await supabase
        .from('guests')
        .select('id, first_name, last_name, table_id')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
        .eq('rsvp_status', true) // Only confirmed guests
        .limit(20);

      if (error) throw error;

      if (!data || data.length === 0) {
        setSearchState('notFound');
        setResults([]);
      } else if (data.length === 1) {
        setSearchState('single');
        setSelectedGuest(data[0]);
        setResults(data);
      } else {
        setSearchState('multiple');
        setResults(data);
      }
    } catch (error) {
      setSearchState('notFound');
      setResults([]);
    }
  };

  const handleSelectGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setSearchState('single');
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchState('idle');
    setResults([]);
    setSelectedGuest(null);
  };

  return (
    <section id="seat" ref={ref} className="section-padding bg-secondary/50">
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
            {t('sections.seat.title')}
          </h2>
          <p className="font-body italic text-lg md:text-xl text-muted-foreground">
            {t('sections.seat.subtitle')}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Search Form - Show when idle or loading */}
          {(searchState === 'idle' || searchState === 'loading') && (
            <motion.form
              key="search-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSearch}
              className="space-y-6"
            >
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('sections.seat.searchPlaceholder')}
                  className="w-full py-8 px-6 text-xl md:text-2xl font-body bg-background border-2 border-border focus:border-primary rounded-2xl text-center placeholder:text-muted-foreground/50"
                  disabled={searchState === 'loading'}
                  autoComplete="off"
                />
              </div>

              <Button
                type="submit"
                disabled={!searchQuery.trim() || searchState === 'loading'}
                className="w-full py-7 text-lg font-body tracking-wide rounded-xl"
              >
                {searchState === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('sections.seat.searching')}
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    {t('sections.seat.searchButton')}
                  </>
                )}
              </Button>
            </motion.form>
          )}

          {/* Single Result - Found Guest */}
          {searchState === 'single' && selectedGuest && (
            <motion.div
              key="single-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
              className="text-center"
            >
              {/* Elegant result card */}
              <div className="bg-background rounded-3xl p-10 md:p-14 border-2 border-primary/20 shadow-lg">
                {/* Greeting */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-body italic text-xl text-muted-foreground mb-2"
                >
                  {t('sections.seat.greeting')}
                </motion.p>

                {/* Guest Name */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-script text-4xl md:text-5xl text-foreground mb-6"
                >
                  {selectedGuest.first_name}!
                </motion.h3>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="w-24 h-px bg-primary/40 mx-auto mb-6"
                />

                {/* Table message */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-body text-lg text-foreground/80 mb-4"
                >
                  {t('sections.seat.tableMessage')}
                </motion.p>

                {/* Table Number - BIG */}
                {selectedGuest.table_id ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
                    className="flex flex-col items-center"
                  >
                    <p className="font-serif text-lg uppercase tracking-[0.3em] text-primary mb-2">
                      {t('sections.seat.table')}
                    </p>
                    <div className="relative">
                      <span className="font-serif text-8xl md:text-9xl lg:text-[10rem] text-primary font-medium leading-none">
                        {selectedGuest.table_id}
                      </span>
                      {/* Decorative ornaments */}
                      <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-primary/30 text-2xl">
                        ❧
                      </div>
                      <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-primary/30 text-2xl scale-x-[-1]">
                        ❧
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="font-body text-muted-foreground italic"
                  >
                    {t('sections.seat.noTableAssigned')}
                  </motion.p>
                )}
              </div>

              {/* Search Again Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8"
              >
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {t('sections.seat.searchAgain')}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Multiple Results - Show list */}
          {searchState === 'multiple' && (
            <motion.div
              key="multiple-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <p className="font-body text-lg text-foreground mb-2">
                  {t('sections.seat.multipleResults')}
                </p>
                <p className="font-body text-muted-foreground italic">
                  {t('sections.seat.selectYourself')}
                </p>
              </div>

              <div className="space-y-3">
                {results.map((guest, index) => (
                  <motion.button
                    key={guest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSelectGuest(guest)}
                    className="w-full p-5 bg-background rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center gap-4 text-left group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-lg text-foreground">
                        {guest.first_name} {guest.last_name}
                      </p>
                      {guest.table_id && (
                        <p className="font-body text-sm text-muted-foreground">
                          {t('sections.seat.table')} {guest.table_id}
                        </p>
                      )}
                    </div>
                    <MapPin className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>

              {/* Back button */}
              <div className="text-center pt-4">
                <Button variant="ghost" onClick={handleReset} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {t('sections.seat.searchAgain')}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Not Found */}
          {searchState === 'notFound' && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center"
              >
                <Search className="w-10 h-10 text-muted-foreground" />
              </motion.div>

              <h3 className="font-serif text-2xl text-foreground mb-3">
                {t('sections.seat.notFound')}
              </h3>
              <p className="font-body text-muted-foreground mb-8">
                {t('sections.seat.notFoundMessage')}
              </p>

              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {t('sections.seat.searchAgain')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SeatFinderSection;
