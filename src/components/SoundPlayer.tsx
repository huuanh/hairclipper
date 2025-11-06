import { useEffect, useRef } from 'react';
import Sound from 'react-native-sound';
import { Vibration } from 'react-native';

interface SoundPlayerProps {
  soundFile: string; // Chỉ sử dụng string paths
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
    
    if (!soundFile) {
      console.log('No sound file provided');
      return;
    }

    try {
      // Đơn giản hóa - chỉ thử một cách
      console.log('Attempting to load sound:', soundFile);
      soundRef.current = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load sound:', soundFile);
          console.log('Error details:', error);
        } else {
          console.log('✅ Sound loaded successfully:', soundFile);
          console.log('Sound info:', {
            duration: soundRef.current?.getDuration(),
            loaded: soundRef.current?.isLoaded()
          });
        }
      });
    } catch (error) {
      console.log('❌ Exception while initializing sound:', error);
    }

    return () => {
      if (soundRef.current) {
        console.log('🧹 Cleaning up sound:', soundFile);
        soundRef.current.release();
        soundRef.current = null;
      }
    };
  }, [soundFile]);

  const playSound = () => {
    console.log('🎵 Attempting to play sound...');
    
    if (!soundRef.current) {
      console.log('❌ No sound reference available');
      return;
    }

    if (!soundRef.current.isLoaded()) {
      console.log('❌ Sound not loaded yet');
      return;
    }

    try {
      soundRef.current.play((success) => {
        if (success) {
          console.log('✅ Sound played successfully');
        } else {
          console.log('❌ Playback failed due to audio decoding errors');
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
    } catch (error) {
      console.log('❌ Exception during playSound:', error);
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