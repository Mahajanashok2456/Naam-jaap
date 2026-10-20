import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { ExportArchiveData, Mantra, UserPreferences, UserSadhanaStats } from '../types';

export async function exportSadhanaArchive(
  stats: UserSadhanaStats,
  mantras: Mantra[],
  preferences: UserPreferences
): Promise<{ success: boolean; message?: string }> {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const fileName = `japam-sadhana-archive-${todayStr}.json`;

    const archiveData: ExportArchiveData = {
      app: 'Japam Sadhana Companion',
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      stats,
      mantras,
      preferences,
    };

    const jsonString = JSON.stringify(archiveData, null, 2);

    if (Platform.OS === 'web') {
      // Browser download fallback
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      return { success: true, message: 'Archive downloaded to device' };
    }

    // Native file system and sharing sheet
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Japam Sadhana Archive',
        UTI: 'public.json',
      });
      return { success: true, message: 'Sadhana counts safely exported' };
    } else {
      return { success: false, message: 'Sharing is not available on this device' };
    }
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Export failed';
    return { success: false, message: err };
  }
}
