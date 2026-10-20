import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, getFont } from '../constants/theme';
import { useSadhana } from '../context/SadhanaContext';
import { AnimatedDiya } from '../components/common/AnimatedDiya';
import { Language } from '../types';
import { hapticService } from '../services/hapticService';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { preferences, updatePreferences, completeOnboarding } = useSadhana();

  // Steps: 0 = Splash, 1 = Language Selection, 2 = Tap to Chant, 3 = Complete Mala, 4 = Goals & Streak
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [demoCount, setDemoCount] = useState<number>(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Splash auto-advance after 2 seconds
  useEffect(() => {
    if (currentStep === 0) {
      timerRef.current = setTimeout(() => {
        setCurrentStep(1);
      }, 2000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      hapticService.triggerSelection(preferences.tactilePulseEnabled);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    hapticService.triggerMalaComplete(preferences.tactilePulseEnabled);
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSkip = async () => {
    hapticService.triggerSelection(preferences.tactilePulseEnabled);
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const selectLanguage = (lang: Language) => {
    updatePreferences({ language: lang });
    hapticService.triggerSelection(preferences.tactilePulseEnabled);
  };

  const headingFont = getFont(preferences.language, 'heading');
  const bodyFont = getFont(preferences.language, 'body');

  /* ========================================================================
   * STEP 0: SPLASH SCREEN (Auto-advances after 2 seconds)
   * ======================================================================== */
  if (currentStep === 0) {
    return (
      <Pressable
        style={styles.splashContainer}
        onPress={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          setCurrentStep(1);
        }}
      >
        <SafeAreaView style={styles.splashInner}>
          {/* Top Decorative Line with Jewel */}
          <View style={styles.topAccentRow}>
            <View style={styles.accentLine} />
            <View style={styles.accentDot} />
            <View style={styles.accentLine} />
          </View>

          {/* Central Sacred Diya Composition */}
          <View style={styles.splashCenter}>
            {/* Sacred Om Symbol above Diya */}
            <View style={styles.omBadgeWrap}>
              <FontAwesome5 name="om" size={38} color={Colors.textPrimary} />
            </View>

            {/* Reusable Animated Diya (Brass Lamp + Lotus Base + Flickering Flame) */}
            <View style={styles.diyaWrap}>
              <AnimatedDiya size={180} showGlow />
            </View>

            {/* Title & Tagline */}
            <Text style={[styles.splashTitle, { fontFamily: Typography.fontPlayfair }]}>
              Japam
            </Text>
            <Text style={[styles.splashTagline, { fontFamily: bodyFont }]}>
              {t('onboarding.splashTagline', 'Chant. Count. Grow.')}
            </Text>
          </View>

          {/* Bottom Accent */}
          <View style={styles.splashBottom}>
            <View style={styles.miniDot} />
            <Text style={[styles.sadhanaSub, { fontFamily: bodyFont }]}>
              {t('onboarding.morningSadhana', 'Morning Sadhana')}
            </Text>
            <Text style={[styles.tapHint, { fontFamily: bodyFont }]}>
              {t('onboarding.tapToEnter', 'Tap anywhere to enter sanctuary')}
            </Text>
          </View>
        </SafeAreaView>
      </Pressable>
    );
  }

  /* ========================================================================
   * STEP 1: LANGUAGE SELECTION SCREEN
   * ======================================================================== */
  if (currentStep === 1) {
    return (
      <SafeAreaView style={styles.screenContainer}>
        {/* Header */}
        <View style={styles.stepHeader}>
          <Pressable
            onPress={() => setCurrentStep(0)}
            style={styles.headerIconButton}
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textSecondary} />
          </Pressable>
          <Text style={[styles.headerBrandTitle, { fontFamily: Typography.fontPlayfair }]}>
            Japam
          </Text>
          <Pressable onPress={handleSkip} style={styles.skipButton} hitSlop={12}>
            <Text style={[styles.skipButtonText, { fontFamily: bodyFont }]}>
              {t('onboarding.skip', 'Skip')}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          {/* Title and Icon */}
          <View style={styles.langHeaderSection}>
            <View style={styles.langFireIconContainer}>
              <MaterialCommunityIcons name="fire" size={30} color={Colors.primary} />
            </View>
            <Text
              style={[
                styles.stepMainTitle,
                { fontFamily: headingFont },
              ]}
            >
              {t('onboarding.chooseLanguage', 'Choose Your Language')}
            </Text>
            <Text
              style={[
                styles.stepSubtitle,
                { fontFamily: bodyFont },
              ]}
            >
              {t(
                'onboarding.chooseLanguageSubtitle',
                'Select preferred language for chanting and mantras'
              )}
            </Text>
          </View>

          {/* 3 Large Language Cards */}
          <View style={styles.languageCardsList}>
            {/* Card 1: Telugu */}
            <Pressable
              onPress={() => selectLanguage('te')}
              style={({ pressed }) => [
                styles.langCard,
                preferences.language === 'te' && styles.langCardSelected,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.langCardLeft}>
                <View
                  style={[
                    styles.langIconCircle,
                    preferences.language === 'te' && styles.langIconCircleActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="flower-tulip-outline"
                    size={24}
                    color={preferences.language === 'te' ? Colors.primary : Colors.primaryDark}
                  />
                </View>
                <View style={styles.langCardTextCol}>
                  <Text
                    style={[
                      styles.langCardName,
                      { fontFamily: Typography.fontTeluguBold },
                    ]}
                  >
                    తెలుగు
                  </Text>
                  <Text
                    style={[
                      styles.langCardSub,
                      { fontFamily: Typography.fontTeluguRegular },
                    ]}
                  >
                    తెలుగులో జపం చేయండి
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.radioCircle,
                  preferences.language === 'te' && styles.radioCircleActive,
                ]}
              >
                {preferences.language === 'te' && (
                  <Ionicons name="checkmark" size={16} color={Colors.onPrimary} />
                )}
              </View>
            </Pressable>

            {/* Card 2: Hindi */}
            <Pressable
              onPress={() => selectLanguage('hi')}
              style={({ pressed }) => [
                styles.langCard,
                preferences.language === 'hi' && styles.langCardSelected,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.langCardLeft}>
                <View
                  style={[
                    styles.langIconCircle,
                    preferences.language === 'hi' && styles.langIconCircleActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="fire"
                    size={24}
                    color={preferences.language === 'hi' ? Colors.primary : Colors.primaryDark}
                  />
                </View>
                <View style={styles.langCardTextCol}>
                  <Text
                    style={[
                      styles.langCardName,
                      { fontFamily: Typography.fontDevanagariSansSemiBold },
                    ]}
                  >
                    हिन्दी
                  </Text>
                  <Text
                    style={[
                      styles.langCardSub,
                      { fontFamily: Typography.fontDevanagariSansRegular },
                    ]}
                  >
                    हिन्दी में जाप और मंत्र
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.radioCircle,
                  preferences.language === 'hi' && styles.radioCircleActive,
                ]}
              >
                {preferences.language === 'hi' && (
                  <Ionicons name="checkmark" size={16} color={Colors.onPrimary} />
                )}
              </View>
            </Pressable>

            {/* Card 3: English */}
            <Pressable
              onPress={() => selectLanguage('en')}
              style={({ pressed }) => [
                styles.langCard,
                preferences.language === 'en' && styles.langCardSelected,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.langCardLeft}>
                <View
                  style={[
                    styles.langIconCircle,
                    preferences.language === 'en' && styles.langIconCircleActive,
                  ]}
                >
                  <Ionicons
                    name="sunny-outline"
                    size={24}
                    color={preferences.language === 'en' ? Colors.primary : Colors.primaryDark}
                  />
                </View>
                <View style={styles.langCardTextCol}>
                  <Text
                    style={[
                      styles.langCardName,
                      { fontFamily: Typography.fontJakartaSemiBold },
                    ]}
                  >
                    English
                  </Text>
                  <Text
                    style={[
                      styles.langCardSub,
                      { fontFamily: Typography.fontJakartaRegular },
                    ]}
                  >
                    Continue in English
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.radioCircle,
                  preferences.language === 'en' && styles.radioCircleActive,
                ]}
              >
                {preferences.language === 'en' && (
                  <Ionicons name="checkmark" size={16} color={Colors.onPrimary} />
                )}
              </View>
            </Pressable>
          </View>

          {/* Hint */}
          <View style={styles.settingsHintRow}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.goldDark} />
            <Text style={[styles.settingsHintText, { fontFamily: bodyFont }]}>
              {t('onboarding.languageHint', 'You can change language anytime in Settings')}
            </Text>
          </View>
        </ScrollView>

        {/* Continue Action */}
        <View style={styles.bottomBar}>
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.primaryCtaButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.primaryCtaText, { fontFamily: bodyFont }]}>
              {t('onboarding.continue', 'Continue')}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.onPrimary} />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /* ========================================================================
   * STEPS 2-4: 3 ONBOARDING SCREENS
   * Step 2: Tap to Chant
   * Step 3: Complete Your Mala (108 chants = 1 round)
   * Step 4: Goals & Streak
   * ======================================================================== */
  const activeDotIndex = currentStep - 2; // 0, 1, or 2

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* Top Header */}
      <View style={styles.stepHeader}>
        <Text style={[styles.headerBrandTitle, { fontFamily: Typography.fontPlayfair }]}>
          Japam
        </Text>
        <Pressable onPress={handleSkip} style={styles.skipButton} hitSlop={12}>
          <Text style={[styles.skipButtonText, { fontFamily: bodyFont }]}>
            {t('onboarding.skip', 'Skip')}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollBodyCenter}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= STEP 2: TAP TO CHANT ================= */}
        {currentStep === 2 && (
          <View style={styles.onboardingStepWrap}>
            {/* Interactive Bead Illustration */}
            <Pressable
              onPress={() => {
                setDemoCount((prev) => (prev >= 108 ? 1 : prev + 1));
                hapticService.triggerBeadTap(preferences.tactilePulseEnabled);
              }}
              style={({ pressed }) => [
                styles.beadDemoCircleOuter,
                pressed && { transform: [{ scale: 0.97 }] },
              ]}
            >
              <View style={styles.beadDemoCircleInner}>
                <Text style={[styles.beadDemoNumber, { fontFamily: Typography.fontPlayfair }]}>
                  {demoCount}
                </Text>
                <Text style={[styles.beadDemoLabel, { fontFamily: bodyFont }]}>
                  {t('tabs.chant', 'Chant')}
                </Text>
              </View>

              {/* Glowing Tap Indicator Badge */}
              <View style={styles.touchIndicatorBadge}>
                <Ionicons name="finger-print-outline" size={18} color={Colors.onPrimary} />
                <Text style={[styles.touchIndicatorText, { fontFamily: bodyFont }]}>
                  Tap: {demoCount}
                </Text>
              </View>
            </Pressable>

            {/* Sensory feedback badge */}
            <View style={styles.featureBadge}>
              <MaterialCommunityIcons name="vibrate" size={16} color={Colors.goldDark} />
              <Text style={[styles.featureBadgeText, { fontFamily: bodyFont }]}>
                {t('onboarding.hapticPulse', 'Haptic pulse confirmation')}
              </Text>
            </View>

            {/* Text Narrative */}
            <Text
              style={[
                styles.stepMainTitle,
                { fontFamily: headingFont, marginTop: Spacing.md },
              ]}
            >
              {t('onboarding.step1Title', 'Tap to Chant')}
            </Text>
            <Text
              style={[
                styles.stepBodyText,
                { fontFamily: bodyFont },
              ]}
            >
              {t(
                'onboarding.step1Desc',
                'Tap anywhere on the screen for every chant. Feel a gentle vibration with each count.'
              )}
            </Text>

            <View style={[styles.subBadge, { marginTop: Spacing.md }]}>
              <Ionicons name="sparkles-outline" size={14} color={Colors.primaryDark} />
              <Text style={[styles.subBadgeText, { fontFamily: bodyFont }]}>
                {t('onboarding.step1Badge', 'Eyes-closed prayer ergonomics')}
              </Text>
            </View>
          </View>
        )}

        {/* ================= STEP 3: COMPLETE YOUR MALA ================= */}
        {currentStep === 3 && (
          <View style={styles.onboardingStepWrap}>
            {/* Mala Complete Illustration */}
            <View style={styles.malaIllustrationWrap}>
              <View style={styles.malaRingGraphic}>
                {/* 108 Bead Ring Dots Pattern */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                  <View
                    key={i}
                    style={[
                      styles.malaRingBeadDot,
                      {
                        transform: [
                          { rotate: `${deg}deg` },
                          { translateY: -70 },
                        ],
                      },
                    ]}
                  />
                ))}

                {/* Central Temple Bell & Chime Waves */}
                <View style={styles.bellCenterCircle}>
                  <MaterialCommunityIcons
                    name="bell-ring-outline"
                    size={46}
                    color={Colors.primary}
                  />
                  <Text
                    style={[
                      styles.mala108BadgeLabel,
                      { fontFamily: Typography.fontJakartaSemiBold },
                    ]}
                  >
                    108
                  </Text>
                </View>

                {/* Crown Meru Bead */}
                <View style={styles.meruBeadHighlight}>
                  <View style={styles.meruInnerDot} />
                </View>
              </View>
            </View>

            {/* Badge: 108 chants = 1 round */}
            <View style={styles.featureBadge}>
              <MaterialCommunityIcons
                name="check-decagram-outline"
                size={16}
                color={Colors.goldDark}
              />
              <Text style={[styles.featureBadgeText, { fontFamily: bodyFont }]}>
                {t('onboarding.step2Badge', '108 chants = 1 round')}
              </Text>
            </View>

            {/* Text Narrative */}
            <Text
              style={[
                styles.stepMainTitle,
                { fontFamily: headingFont, marginTop: Spacing.md },
              ]}
            >
              {t('onboarding.step2Title', 'Complete Your Mala')}
            </Text>
            <Text
              style={[
                styles.stepBodyText,
                { fontFamily: bodyFont },
              ]}
            >
              {t(
                'onboarding.step2Desc',
                '108 chants complete one sacred round. A resonant bell and distinct pulse mark the Meru bead.'
              )}
            </Text>

            <View style={[styles.subBadge, { marginTop: Spacing.md }]}>
              <Ionicons name="volume-medium-outline" size={15} color={Colors.primaryDark} />
              <Text style={[styles.subBadgeText, { fontFamily: bodyFont }]}>
                {t('onboarding.bellBadge', 'Temple bell chime on completion')}
              </Text>
            </View>
          </View>
        )}

        {/* ================= STEP 4: GOALS & STREAK ================= */}
        {currentStep === 4 && (
          <View style={styles.onboardingStepWrap}>
            {/* Visual Diya & Sankalpa Card */}
            <View style={styles.streakVisualContainer}>
              <View style={styles.miniDiyaWrap}>
                <AnimatedDiya size={110} showGlow={false} />
              </View>

              {/* Floating Streak Pill */}
              <View style={styles.streakFloatingPill}>
                <MaterialCommunityIcons name="fire" size={18} color={Colors.primary} />
                <Text style={[styles.streakPillText, { fontFamily: bodyFont }]}>
                  {t('onboarding.streakDays', '14 Day Streak')}
                </Text>
                <View style={styles.streakLiveDot} />
              </View>
            </View>

            {/* Dedicated Sankalpa Card */}
            <View style={styles.sankalpaDemoCard}>
              <View style={styles.sankalpaTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sankalpaTag, { fontFamily: bodyFont }]}>
                    {t('onboarding.dedicatedSankalpa', 'Dedicated Sankalpa')}
                  </Text>
                  <Text
                    style={[
                      styles.sankalpaTitleText,
                      { fontFamily: headingFont },
                    ]}
                  >
                    1,00,000 Chants
                  </Text>
                </View>
                <View style={styles.sankalpaGoalPill}>
                  <Ionicons name="star" size={13} color={Colors.primaryDark} />
                  <Text style={[styles.sankalpaGoalText, { fontFamily: bodyFont }]}>
                    {t('onboarding.goalSample', '1 Lakh Goal')}
                  </Text>
                </View>
              </View>

              {/* Progress Line */}
              <View style={styles.progressBarWrap}>
                <View style={[styles.progressBarFill, { width: '21.6%' }]} />
              </View>

              <View style={styles.progressStatsRow}>
                <Text style={[styles.progressChantsCount, { fontFamily: bodyFont }]}>
                  <Text style={{ fontWeight: '700', color: Colors.primaryDark }}>21,600</Text>
                  {' / 1,00,000'}
                </Text>
                <Text style={[styles.progressPercent, { fontFamily: bodyFont }]}>21.6%</Text>
              </View>

              {/* Projected Completion */}
              <View style={styles.projectedFooterRow}>
                <View style={styles.projectedLabelWrap}>
                  <Ionicons name="calendar-outline" size={13} color={Colors.goldDark} />
                  <Text style={[styles.projectedLabel, { fontFamily: bodyFont }]}>
                    {t('onboarding.projectedCompletion', 'Projected Completion')}
                  </Text>
                </View>
                <Text style={[styles.projectedVal, { fontFamily: bodyFont }]}>
                  {t('onboarding.projectedTime', '78 Days at 1,000/day')}
                </Text>
              </View>
            </View>

            {/* Text Narrative */}
            <Text
              style={[
                styles.stepMainTitle,
                { fontFamily: headingFont, marginTop: Spacing.md },
              ]}
            >
              {t('onboarding.step3Title', 'Goals & Streak')}
            </Text>
            <Text
              style={[
                styles.stepBodyText,
                { fontFamily: bodyFont },
              ]}
            >
              {t(
                'onboarding.step3Desc',
                'Set your daily sankalpa, maintain your sacred streak, and watch your spiritual discipline grow.'
              )}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Navigation Bar */}
      <View style={styles.bottomBar}>
        {/* Pagination Dots (3 screens) */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((idx) => {
            const isActive = idx === activeDotIndex;
            return (
              <View
                key={idx}
                style={[
                  styles.dot,
                  isActive && styles.dotActive,
                ]}
              />
            );
          })}
        </View>

        {/* Primary Action Button (Next or Get Started) */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.primaryCtaButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.primaryCtaText, { fontFamily: bodyFont }]}>
            {currentStep === 4
              ? t('onboarding.getStarted', 'Get Started')
              : t('onboarding.next', 'Next')}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.onPrimary} />
        </Pressable>

        {/* Skip text on step 2 & 3 */}
        {currentStep < 4 && (
          <Pressable onPress={handleSkip} style={styles.skipTutorialLink} hitSlop={12}>
            <Text style={[styles.skipTutorialText, { fontFamily: bodyFont }]}>
              {t('onboarding.skip', 'Skip tutorial')}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* Splash Screen Styles */
  splashContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundWarm,
  },
  splashInner: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  topAccentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
  },
  accentLine: {
    width: 48,
    height: 1,
    backgroundColor: Colors.border,
  },
  accentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  splashCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 'auto',
  },
  omBadgeWrap: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  diyaWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    fontSize: 42,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.lg,
    letterSpacing: 1,
  },
  splashTagline: {
    fontSize: 13,
    color: Colors.goldDark,
    marginTop: Spacing.xs,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  splashBottom: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginBottom: Spacing.xs,
  },
  sadhanaSub: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tapHint: {
    fontSize: 11,
    color: Colors.border,
    marginTop: 4,
  },

  /* Standard Onboarding Container */
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBrandTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  skipButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  skipButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textTertiary,
  },

  /* Scrollable Content */
  scrollBody: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  scrollBodyCenter: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxl,
  },
  onboardingStepWrap: {
    alignItems: 'center',
    marginVertical: 'auto',
  },

  /* Language Selection Styles */
  langHeaderSection: {
    alignItems: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  langFireIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  stepMainTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  stepSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
    maxWidth: 290,
    lineHeight: 18,
  },
  stepBodyText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
    maxWidth: 290,
    lineHeight: 19,
  },

  languageCardsList: {
    gap: Spacing.md,
    marginVertical: Spacing.sm,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 96,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    backgroundColor: Colors.surfaceIvory,
    borderWidth: 1,
    borderColor: 'rgba(212, 166, 74, 0.3)',
    shadowColor: '#5A1A12',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 2,
  },
  langCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 4,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  langCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  langIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(212, 166, 74, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  langIconCircleActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  langCardTextCol: {
    flex: 1,
  },
  langCardName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  langCardSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  radioCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  radioCircleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  settingsHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.lg,
  },
  settingsHintText: {
    fontSize: 11,
    color: Colors.goldDark,
    textAlign: 'center',
  },

  /* Step 2: Interactive Bead Demo */
  beadDemoCircleOuter: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: Spacing.lg,
  },
  beadDemoCircleInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  beadDemoNumber: {
    fontSize: 44,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  beadDemoLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  touchIndicatorBadge: {
    position: 'absolute',
    bottom: -8,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  touchIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: Spacing.sm,
  },
  featureBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.goldDark,
  },
  subBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(252, 243, 226, 0.7)',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 14,
  },
  subBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.primaryDark,
  },

  /* Step 3: Mala Ring Graphic */
  malaIllustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.lg,
  },
  malaRingGraphic: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  malaRingBeadDot: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.gold,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bellCenterCircle: {
    width: 115,
    height: 115,
    borderRadius: 58,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  mala108BadgeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginTop: 2,
  },
  meruBeadHighlight: {
    position: 'absolute',
    top: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meruInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  /* Step 4: Goals & Streak */
  streakVisualContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  miniDiyaWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -Spacing.xs,
  },
  streakFloatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  streakPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  streakLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  sankalpaDemoCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: Spacing.sm,
  },
  sankalpaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  sankalpaTag: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sankalpaTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sankalpaGoalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sankalpaGoalText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  progressBarWrap: {
    width: '100%',
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.surfaceWarm,
    overflow: 'hidden',
    marginTop: Spacing.xs,
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4.5,
    backgroundColor: Colors.primary,
  },
  progressStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressChantsCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  projectedFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  projectedLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  projectedLabel: {
    fontSize: 11,
    color: Colors.goldDark,
  },
  projectedVal: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  /* Bottom Actions & Dots */
  bottomBar: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.xs,
    alignItems: 'center',
    gap: Spacing.md,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(222, 193, 177, 0.6)',
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  primaryCtaButton: {
    width: '100%',
    height: 56,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: '#E8751A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 5,
  },
  primaryCtaText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onPrimary,
    letterSpacing: 0.3,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  skipTutorialLink: {
    paddingVertical: 4,
  },
  skipTutorialText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
