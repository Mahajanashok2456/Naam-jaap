import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

class HapticService {
  /**
   * Subtle tactile feedback on each bead count
   */
  async triggerBeadTap(enabled = true): Promise<void> {
    if (!enabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics may fail if unsupported or permissions not granted
    }
  }

  /**
   * Distinct celebratory haptic pulse upon consecrating 108 beads (Meru completion)
   */
  async triggerMalaComplete(enabled = true): Promise<void> {
    if (!enabled || Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(async () => {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } catch {
          // ignore
        }
      }, 150);
    } catch {
      // ignore
    }
  }

  /**
   * Selection feedback for buttons and settings toggles
   */
  async triggerSelection(enabled = true): Promise<void> {
    if (!enabled || Platform.OS === 'web') return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // ignore
    }
  }
}

export const hapticService = new HapticService();
