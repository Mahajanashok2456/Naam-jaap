import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, Typography, getFont, Radii } from '../../constants/theme';
import { useSadhana } from '../../context/SadhanaContext';
import { MalaLoop } from '../../components/common/MalaLoop';
import { MalaCompleteModal } from '../../components/common/MalaCompleteModal';
import { JapamDivineModal } from '../../components/common/JapamDivineModal';

export default function ChantScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();

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
    updatePreferences,
    isEyesClosedMode,
    toggleEyesClosed,
    isMalaCompleteModalVisible,
    dismissMalaCompleteModal,
    isPaywallVisible,
    setPaywallVisible,
  } = useSadhana();

  // Pick script representation based on user's language preference
  const scriptText =
    preferences.language === 'te'
      ? activeMantra.scriptText.te
      : preferences.language === 'hi'
      ? activeMantra.scriptText.hi
      : activeMantra.scriptText.hi || activeMantra.scriptText.en;

  const scriptFont = getFont(preferences.language, 'heading');
  const titleFont = getFont('en', 'heading');

  // Mala loop diameter responsive to screen width
  const malaSize = Math.min(350, Math.max(280, width - 48));

  const toggleSound = () => {
    updatePreferences({ soundEnabled: !preferences.soundEnabled });
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isEyesClosedMode && styles.safeAreaEyesClosed,
      ]}
    >
      {/* Full screen tap zone */}
      <Pressable
        onPress={incrementBead}
        style={styles.fullScreenPressable}
      >
        {/* Top Header Bar */}
        <View style={styles.header}>
          {/* Mantras Switch Button */}
          <Pressable
            onPress={() => router.push('/(tabs)/mantras')}
            style={({ pressed }) => [
              styles.headerBtnPill,
              isEyesClosedMode && styles.headerBtnPillDark,
              pressed && styles.pressed,
            ]}
            hitSlop={8}
          >
            <Ionicons
              name="book-outline"
              size={15}
              color={isEyesClosedMode ? Colors.goldLight : Colors.primaryDark}
            />
            <Text
              style={[
                styles.headerBtnPillText,
                isEyesClosedMode && styles.headerBtnPillTextDark,
              ]}
            >
              Mantras
            </Text>
          </Pressable>

          {/* Center Mantra Title */}
          <View style={styles.headerTitleWrap}>
            <Text
              numberOfLines={1}
              style={[
                styles.headerTitle,
                { fontFamily: titleFont },
                isEyesClosedMode && styles.headerTitleDark,
              ]}
            >
              {activeMantra.title}
            </Text>
          </View>

          {/* Quick Controls: Sound & Eyes-Closed */}
          <View style={styles.headerActions}>
            <Pressable
              onPress={toggleSound}
              style={({ pressed }) => [
                styles.iconBtn,
                isEyesClosedMode && styles.iconBtnDark,
                pressed && styles.pressed,
              ]}
              hitSlop={8}
            >
              <Ionicons
                name={preferences.soundEnabled ? 'volume-high-outline' : 'volume-mute-outline'}
                size={20}
                color={isEyesClosedMode ? Colors.eyesClosedTextMuted : Colors.textMuted}
              />
            </Pressable>

            <Pressable
              onPress={toggleEyesClosed}
              style={({ pressed }) => [
                styles.iconBtn,
                isEyesClosedMode && styles.iconBtnActive,
                pressed && styles.pressed,
              ]}
              hitSlop={8}
            >
              <Ionicons
                name={isEyesClosedMode ? 'eye-off' : 'eye-outline'}
                size={20}
                color={isEyesClosedMode ? '#FFFFFF' : Colors.textMuted}
              />
            </Pressable>
          </View>
        </View>

        {/* Center Mala Loop Canvas */}
        <View style={styles.canvas}>
          <MalaLoop
            currentBead={currentBead}
            totalBeads={malaTotal}
            currentRound={currentRound}
            totalRounds={totalRounds}
            scriptText={scriptText}
            scriptFont={scriptFont}
            isEyesClosed={isEyesClosedMode}
            size={malaSize}
            onTap={incrementBead}
          />

          {/* Tap Prompt Subtext */}
          <Text
            style={[
              styles.promptSubtext,
              isEyesClosedMode && styles.promptSubtextDark,
            ]}
          >
            {isEyesClosedMode
              ? 'Eyes-closed mode active • Tap anywhere to chant'
              : 'Tap anywhere on screen to count • Pure sacred stillness'}
          </Text>
        </View>

        {/* Bottom Auxiliary Controls */}
        <View style={styles.bottomBar}>
          {/* Undo Bead */}
          <Pressable
            onPress={undoBead}
            disabled={currentBead <= 0}
            style={({ pressed }) => [
              styles.controlBtn,
              isEyesClosedMode && styles.controlBtnDark,
              currentBead <= 0 && styles.controlBtnDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="arrow-undo-outline"
              size={15}
              color={isEyesClosedMode ? Colors.eyesClosedTextMuted : Colors.textMuted}
            />
            <Text
              style={[
                styles.controlBtnText,
                isEyesClosedMode && styles.controlBtnTextDark,
              ]}
            >
              {t('counter.undo', 'Undo Bead')}
            </Text>
          </Pressable>

          {/* Reset Mala */}
          <Pressable
            onPress={resetRound}
            style={({ pressed }) => [
              styles.controlBtn,
              isEyesClosedMode && styles.controlBtnDark,
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="restore"
              size={16}
              color={isEyesClosedMode ? Colors.eyesClosedTextMuted : Colors.textMuted}
            />
            <Text
              style={[
                styles.controlBtnText,
                isEyesClosedMode && styles.controlBtnTextDark,
              ]}
            >
              {t('counter.reset', 'Reset Mala')}
            </Text>
          </Pressable>
        </View>
      </Pressable>

      {/* Completion Modal */}
      <MalaCompleteModal
        visible={isMalaCompleteModalVisible}
        round={currentRound}
        totalRounds={totalRounds}
        mantraTitle={activeMantra.title}
        onContinue={dismissMalaCompleteModal}
      />

      {/* Japam Divine Paywall Modal */}
      <JapamDivineModal
        visible={isPaywallVisible}
        onClose={() => setPaywallVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeAreaEyesClosed: {
    backgroundColor: Colors.eyesClosedBg,
  },
  fullScreenPressable: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    zIndex: 20,
  },
  headerBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
  },
  headerBtnPillDark: {
    backgroundColor: Colors.eyesClosedSurface,
    borderColor: 'rgba(87, 66, 55, 0.6)',
  },
  headerBtnPillText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  headerBtnPillTextDark: {
    color: Colors.goldLight,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  headerTitleDark: {
    color: Colors.primaryLight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnDark: {
    backgroundColor: Colors.eyesClosedSurface,
    borderColor: 'rgba(87, 66, 55, 0.5)',
  },
  iconBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  canvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  promptSubtext: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  promptSubtextDark: {
    color: 'rgba(222, 193, 177, 0.45)',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    zIndex: 20,
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
  },
  controlBtnDark: {
    backgroundColor: Colors.eyesClosedSurface,
    borderColor: 'rgba(87, 66, 55, 0.5)',
  },
  controlBtnDisabled: {
    opacity: 0.4,
  },
  controlBtnText: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  controlBtnTextDark: {
    color: Colors.eyesClosedTextMuted,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
