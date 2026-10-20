import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useSadhana } from '../../context/SadhanaContext';
import { audioService } from '../../services/audioService';
import { Language } from '../../types';

export default function SettingsPlaceholderScreen() {
  const { t } = useTranslation();
  const {
    preferences,
    updatePreferences,
    exportCounts,
    unlockPremiumSimulation,
  } = useSadhana();

  const [exportStatus, setExportStatus] = useState<string>('');

  const handleLanguageChange = (lang: Language) => {
    updatePreferences({ language: lang });
  };

  const handleTestBell = async () => {
    await audioService.playTempleBell(true);
  };

  const handleExport = async () => {
    setExportStatus('Exporting...');
    const result = await exportCounts();
    setExportStatus(result.message || (result.success ? 'Exported!' : 'Failed'));
    setTimeout(() => setExportStatus(''), 4000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('settings.title', 'Settings')}</Text>
          <Text style={styles.screenSubtitle}>
            {t('settings.preferences', 'Sadhana Preferences')}
          </Text>
        </View>

        {/* Language Selection Test Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings.language')}</Text>
          <View style={styles.segmentRow}>
            {(['en', 'te', 'hi'] as Language[]).map((lang) => {
              const isSelected = preferences.language === lang;
              const label = lang === 'en' ? 'English' : lang === 'te' ? 'తెలుగు' : 'हिन्दी';
              return (
                <Pressable
                  key={lang}
                  onPress={() => handleLanguageChange(lang)}
                  style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentBtnText, isSelected && styles.segmentBtnTextActive]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Audio & Haptic Test Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings.sensoryFeedback')}</Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('settings.bellChime')}</Text>
            <Switch
              value={preferences.soundEnabled}
              onValueChange={(val) => updatePreferences({ soundEnabled: val })}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.surface}
            />
          </View>

          <Pressable onPress={handleTestBell} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>🔔 Test Temple Bell</Text>
          </Pressable>

          <View style={[styles.switchRow, { marginTop: Spacing.md }]}>
            <Text style={styles.switchLabel}>{t('settings.tactileFeedback')}</Text>
            <Switch
              value={preferences.tactilePulseEnabled}
              onValueChange={(val) => updatePreferences({ tactilePulseEnabled: val })}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.surface}
            />
          </View>
        </View>

        {/* Mala Size */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings.malaSize')}</Text>
          <View style={styles.segmentRow}>
            {[108, 54, 27].map((size) => {
              const isSelected = preferences.malaSize === size;
              return (
                <Pressable
                  key={size}
                  onPress={() => updatePreferences({ malaSize: size })}
                  style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentBtnText, isSelected && styles.segmentBtnTextActive]}>
                    {size} Beads
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Export Counts to File (Replaced Cloud Sync) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings.exportCounts')}</Text>
          <Text style={styles.cardSubtitle}>{t('settings.exportSubtitle')}</Text>
          <Pressable onPress={handleExport} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📤 {t('settings.exportButton')}</Text>
          </Pressable>
          {exportStatus ? <Text style={styles.statusText}>{exportStatus}</Text> : null}
        </View>

        {/* Premium Simulation Tier Check */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {preferences.isPremium ? '★ Japam Divine Active' : 'Free Tier'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {preferences.isPremium
              ? 'All features unlocked: unlimited mantras, file export, sacred themes'
              : 'Free tier limit: 3 mantras, 1 active goal, basic stats'}
          </Text>
          {!preferences.isPremium && (
            <Pressable onPress={unlockPremiumSimulation} style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Unlock Japam Divine</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xs,
  },
  screenTitle: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 24,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  screenSubtitle: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  cardSubtitle: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: 11,
  },
  segmentBtnActive: {
    backgroundColor: Colors.primary,
  },
  segmentBtnText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    color: Colors.textMuted,
  },
  segmentBtnTextActive: {
    color: Colors.onPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLabel: {
    fontFamily: Typography.fontSans,
    fontSize: 13,
    color: Colors.textMuted,
  },
  actionButton: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 14,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionButtonText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 13,
    color: Colors.primaryDark,
  },
  statusText: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.success,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  premiumButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  premiumButtonText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    color: Colors.onPrimary,
  },
});
