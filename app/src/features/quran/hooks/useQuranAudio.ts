import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export const useQuranAudio = () => {
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [playingAyahId, setPlayingAyahId] = useState<number | null>(null);
  
  const soundRef = useRef<Audio.Sound | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const cleanup = async () => {
    if (soundRef.current) {
      try {
        const soundStatus = await soundRef.current.getStatusAsync();
        if (soundStatus.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }
      } catch (e) {
        console.error("Audio cleanup error", e);
      }
      soundRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const playAyah = async (ayahId: number, audioUrl: string, onComplete?: () => void) => {
    try {
      await cleanup();
      setPlayingAyahId(ayahId);
      setStatus('loading');
      onCompleteRef.current = onComplete || null;

      // Ensure audio plays even if silent switch is on (iOS)
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (playbackStatus) => {
          if (playbackStatus.isLoaded) {
            if (playbackStatus.isPlaying) {
              setStatus('playing');
            } else if (!playbackStatus.isPlaying && playbackStatus.positionMillis !== playbackStatus.durationMillis) {
              setStatus('paused');
            }
            
            if (playbackStatus.didJustFinish) {
               if (onCompleteRef.current) onCompleteRef.current();
            }
          } else if (playbackStatus.error) {
             setStatus('error');
          }
        }
      );
      soundRef.current = sound;
    } catch (e) {
      console.error("Audio playback error", e);
      setStatus('error');
    }
  };

  const pause = async () => {
    if (soundRef.current) {
      const soundStatus = await soundRef.current.getStatusAsync();
      if (soundStatus.isLoaded && soundStatus.isPlaying) {
        await soundRef.current.pauseAsync();
        setStatus('paused');
      }
    }
  };

  const resume = async () => {
    if (soundRef.current) {
      const soundStatus = await soundRef.current.getStatusAsync();
      if (soundStatus.isLoaded && !soundStatus.isPlaying) {
        await soundRef.current.playAsync();
        setStatus('playing');
      }
    }
  };
  
  const stop = async () => {
     await cleanup();
     setStatus('idle');
     setPlayingAyahId(null);
  };

  return { status, playingAyahId, playAyah, pause, resume, stop };
};
