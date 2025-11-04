import { useEffect, useRef } from 'react';
import Sound from 'react-native-sound';
import { Vibration } from 'react-native';

interface SoundPlayerProps {
  soundFile: string;
  loop?: boolean;
  vibrate?: boolean;
  vibrationPattern?: number[];
}

export const useSoundPlayer = ({
  soundFile,
  loop = false,
  vibrate = false,
  vibrationPattern = [0, 1000, 500, 1000],
}: SoundPlayerProps) => {
  const soundRef = useRef<Sound | null>(null);

  useEffect(() => {
    // Initialize sound
    Sound.setCategory('Playback');
    
    soundRef.current = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
      }
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, [soundFile]);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.play((success) => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
      });

      if (loop) {
        soundRef.current.setNumberOfLoops(-1);
      }

      if (vibrate) {
        try {
          Vibration.vibrate(vibrationPattern, true);
        } catch (error) {
          console.warn('Vibration not available or permission denied:', error);
        }
      }
    }
  };

  const stopSound = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      try {
        Vibration.cancel();
      } catch (error) {
        console.warn('Failed to cancel vibration:', error);
      }
    }
  };

  const pauseSound = () => {
    if (soundRef.current) {
      soundRef.current.pause();
      try {
        Vibration.cancel();
      } catch (error) {
        console.warn('Failed to cancel vibration:', error);
      }
    }
  };

  return {
    playSound,
    stopSound,
    pauseSound,
  };
};