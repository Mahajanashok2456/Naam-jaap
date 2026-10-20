import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, Typography, getFont } from '../../constants/theme';
import { useSadhana } from '../../context/SadhanaContext';

export default function ChantPlaceholderScreen() {
  const { t } = useTranslation();
  const {
    activeMantra,
    currentBead,
    currentRound,
    totalRounds,
    malaTotal,
    incrementBead,
    undoBead,
    resetRound,
    preferences,
    isEyesClosedMode,
    toggleEyesClosed,
  } = useSadhana();

  const titleFont = getFont(preferences.language, 'heading');

  return (
    <SafeAreaView
      style={[
        styles.container,
        isEyesClosedMode && { backgroundColor: Colors.eyesClosedBg },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.sacredSymbol, isEyesClosedMode && { color: Colors.goldLight }]}>
          ॐ
        </Text>
        <Text
          style={[
            styles.mantraTitle,
            { fontFamily: titleFont },
            isEyesClosedMode && { color: Colors.eyesClosedText },
          ]}
        >
          {activeMantra.title}
        </Text>
        <Text
          style={[
            styles.roundIndicator,
            isEyesClosedMode && { color: Colors.eyesClosedTextMuted },
          ]}
        >
          {t('counter.roundOf', { current: currentRound, total: totalRounds })}
        </Text>

        <Pressable
          onPress={incrementBead}
          style={({ pressed }) => [
            styles.beadCircle,
            pressed && styles.beadCirclePressed,
            isEyesClosedMode && styles.beadCircleEyesClosed,
          ]}
        >
          <Text
            style={[
              styles.beadNumber,
              isEyesClosedMode && { color: Colors.goldLight },
            ]}
          >
            {currentBead}
          </Text>
          <Text
            style={[
              styles.beadTotal,
              isEyesClosedMode && { color: Colors.eyesClosedTextMuted },
            ]}
          >
            {t('counter.ofChants', { total: malaTotal })}
          </Text>
          <Text style={styles.tapPrompt}>
            {isEyesClosedMode
              ? t('counter.eyesClosedHint')
              : t('counter.tapToChantHint')}
          </Text>
        </Pressable>

        <View style={styles.controlsRow}>
          <Pressable onPress={undoBead} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>{t('counter.undo', 'Undo')}</Text>
          </Pressable>

          <Pressable onPress={toggleEyesClosed} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>
              {isEyesClosedMode ? 'Dawn Mode' : 'Eyes-Closed'}
            </Text>
          </Pressable>

          <Pressable onPress={resetRound} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>{t('counter.reset', 'Reset')}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  sacredSymbol: {
    fontSize: 36,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  mantraTitle: {
    fontSize: 22,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  roundIndicator: {
    fontFamily: Typography.fontSans,
    fontSize: 13,
    color: Colors.goldDark,
    marginTop: 4,
    marginBottom: Spacing.xxl,
  },
  beadCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  beadCirclePressed: {
    transform: [{ scale: 0.97 }],
    borderColor: Colors.primary,
  },
  beadCircleEyesClosed: {
    backgroundColor: Colors.eyesClosedSurface,
    borderColor: Colors.eyesClosedBorder,
  },
  beadNumber: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 64,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  beadTotal: {
    fontFamily: Typography.fontSans,
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  tapPrompt: {
    fontFamily: Typography.fontSans,
    fontSize: 10,
    color: Colors.primaryDark,
    textAlign: 'center',
    marginTop: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xxl,
  },
  controlButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  controlButtonText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    color: Colors.textMuted,
  },
});
