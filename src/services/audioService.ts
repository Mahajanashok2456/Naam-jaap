import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';

class AudioService {
  private bellPlayer: AudioPlayer | null = null;
  private clickPlayer: AudioPlayer | null = null;
  private isConfigured = false;

  private async configureAudio() {
    if (this.isConfigured || Platform.OS === 'web') return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: 'mixWithOthers',
      });
      this.isConfigured = true;
    } catch {
      // Audio session setup fallback
    }
  }

  /**
   * Preload sounds for zero-latency response using expo-audio
   */
  async preloadSounds(): Promise<void> {
    try {
      await this.configureAudio();

      if (!this.bellPlayer) {
        this.bellPlayer = createAudioPlayer(require('../../assets/sounds/bell.wav'));
        this.bellPlayer.volume = 0.9;
      }

      if (!this.clickPlayer) {
        this.clickPlayer = createAudioPlayer(require('../../assets/sounds/click.wav'));
        this.clickPlayer.volume = 0.4;
      }
    } catch {
      // Fallback if audio hardware is unavailable
    }
  }

  /**
   * Play the resonant 432Hz temple bell tone (for mala completion and audio preview)
   */
  async playTempleBell(soundEnabled = true): Promise<void> {
    if (!soundEnabled) return;
    try {
      await this.configureAudio();
      if (!this.bellPlayer) {
        await this.preloadSounds();
      }
      if (this.bellPlayer) {
        await this.bellPlayer.seekTo(0);
        this.bellPlayer.play();
      }
    } catch {
      // ignore
    }
  }

  /**
   * Play subtle wooden bead click on each chant tap
   */
  async playBeadTap(soundEnabled = true): Promise<void> {
    if (!soundEnabled) return;
    try {
      await this.configureAudio();
      if (!this.clickPlayer) {
        await this.preloadSounds();
      }
      if (this.clickPlayer) {
        await this.clickPlayer.seekTo(0);
        this.clickPlayer.play();
      }
    } catch {
      // ignore
    }
  }

  /**
   * Release resources
   */
  unload(): void {
    try {
      if (this.bellPlayer) {
        this.bellPlayer.pause();
        this.bellPlayer = null;
      }
      if (this.clickPlayer) {
        this.clickPlayer.pause();
        this.clickPlayer = null;
      }
    } catch {
      // ignore
    }
  }
}

export const audioService = new AudioService();
