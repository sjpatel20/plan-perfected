import { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface TextToSpeechProps {
  text: string;
  className?: string;
}

// Language code mapping for Web Speech Synthesis
const languageMap: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  mr: 'mr-IN',
};

export function TextToSpeech({ text, className }: TextToSpeechProps) {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setIsSupported(false);
    }

    // Cleanup on unmount
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Stop speaking when component unmounts or text changes
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    };
  }, [text]);

  const speak = useCallback(() => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1') // Remove code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/[-*]\s/g, '') // Remove list markers
      .replace(/\n+/g, '. '); // Replace newlines with pauses

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = languageMap[language] || 'en-IN';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;

    // Try to find a voice for the language
    const voices = window.speechSynthesis.getVoices();
    const targetLang = languageMap[language] || 'en-IN';
    const voice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [text, language]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    if (!window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {isSpeaking ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={togglePause}
            className="h-7 w-7"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? (
              <Play className="h-3.5 w-3.5" />
            ) : (
              <Pause className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={stop}
            className="h-7 w-7 text-destructive hover:text-destructive"
            aria-label="Stop"
          >
            <VolumeX className="h-3.5 w-3.5" />
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={speak}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          aria-label="Listen to this message"
        >
          <Volume2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
