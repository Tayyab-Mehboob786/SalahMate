import { useState } from 'react';

export const useQuranAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const playAyah = async (ayahKey: string) => {
    // Architecture placeholder
  };

  const stop = () => {
    setIsPlaying(false);
  };

  return { isPlaying, playAyah, stop };
};
