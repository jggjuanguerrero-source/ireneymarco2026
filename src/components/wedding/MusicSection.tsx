import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Music, ExternalLink, Send, Loader2, Check } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// ============================================
// EDITABLE CONFIG - Spotify Playlist Link
// ============================================
const SPOTIFY_PLAYLIST_URL = 'https://open.spotify.com/playlist/YOUR_PLAYLIST_ID'; // Replace with your actual playlist URL

// Validation schema for song suggestion
const songSchema = z.object({
  song: z.string().trim().min(1).max(200),
});

const MusicSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { toast } = useToast();

  const [songInput, setSongInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSpotifyClick = () => {
    window.open(SPOTIFY_PLAYLIST_URL, '_blank');
  };

  const handleSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = songSchema.safeParse({ song: songInput });
    if (!result.success) return;

    setIsSubmitting(true);

    try {
      // We'll store the song suggestion in the guests table for guests who already submitted
      // or in a simpler way by adding to the song_request field
      // For simplicity, we'll create a minimal guest entry with just the song
      const { error } = await supabase.from('guests').insert({
        first_name: 'Anónimo',
        last_name: 'Sugerencia',
        email: `song_${Date.now()}@suggestion.local`,
        song_request: result.data.song,
        rsvp_status: null,
      });

      if (error) throw error;

      setIsSuccess(true);
      setSongInput('');
      toast({
        title: t('sections.music.thankYou'),
        description: t('sections.music.songAdded'),
      });

      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="music" ref={ref} className="section-padding bg-secondary/50">
      <div className="max-w-3xl mx-auto">
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
            {t('sections.music.title')}
          </h2>
          <p className="font-body italic text-lg md:text-xl text-muted-foreground">
            {t('sections.music.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Option A: Spotify */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-background rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Spotify Icon */}
            <div className="w-16 h-16 rounded-full bg-[#1DB954]/10 flex items-center justify-center mb-6">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-[#1DB954]"
                fill="currentColor"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>

            <h3 className="font-serif text-xl text-foreground mb-2">
              {t('sections.music.spotifyTitle')}
            </h3>
            <p className="font-body text-muted-foreground mb-6">
              {t('sections.music.spotifyDescription')}
            </p>

            <Button
              onClick={handleSpotifyClick}
              className="w-full gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white py-6"
            >
              <Music className="w-5 h-5" />
              {t('sections.music.spotifyButton')}
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>

          {/* Option B: Manual Suggestion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-background rounded-2xl p-8 border border-border shadow-sm"
          >
            {/* Music Icon */}
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Music className="w-8 h-8 text-primary" />
            </div>

            <h3 className="font-serif text-xl text-foreground mb-2">
              {t('sections.music.manualTitle')}
            </h3>
            <p className="font-body text-muted-foreground mb-6">
              {t('sections.music.manualDescription')}
            </p>

            <form onSubmit={handleSongSubmit} className="space-y-4">
              <Input
                value={songInput}
                onChange={(e) => setSongInput(e.target.value)}
                placeholder={t('sections.music.songPlaceholder')}
                className="bg-background/50 border-border focus:border-primary transition-colors font-body"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                variant="outline"
                disabled={!songInput.trim() || isSubmitting}
                className="w-full gap-2 py-6 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('sections.music.sending')}
                    </motion.span>
                  ) : isSuccess ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-primary"
                    >
                      <Check className="w-5 h-5" />
                      {t('sections.music.thankYou')}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      {t('sections.music.sendSuggestion')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
