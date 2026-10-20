import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, Typography, getFont, Radii } from '../../constants/theme';
import { useSadhana } from '../../context/SadhanaContext';
import { audioService } from '../../services/audioService';
import { JapamDivineModal } from '../../components/common/JapamDivineModal';
import { MalaSize, ChimeSound, Language } from '../../types';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    preferences,
    updatePreferences,
    exportCounts,
    isPaywallVisible,
    setPaywallVisible,
    isEyesClosedMode,
    toggleEyesClosed,
  } = useSadhana();

  const [exportMessage, setExportMessage] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customBeadInput, setCustomBeadInput] = useState<string>('21');

  const titleFont = getFont('en', 'heading');

  const handleMalaSizeChange = (size: MalaSize) => {
    updatePreferences({ malaSize: size });
  };

  const handleSaveCustomMala = () => {
    const num = parseInt(customBeadInput, 10);
    if (!isNaN(num) && num > 0) {
      updatePreferences({ malaSize: num as MalaSize });
      setShowCustomModal(false);
    }
  };

  const handleTestBell = async () => {
    await audioService.playTempleBell(true);
  };

  const handleExport = async () => {
    setExportMessage('Generating Sacred Archive...');
    const result = await exportCounts();
    setExportMessage(result.message || (result.success ? 'Archive Exported Successfully' : 'Export Failed'));
    setTimeout(() => setExportMessage(''), 4000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.push('/(tabs)')}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.primaryDark} />
        </Pressable>

        <View style={styles.topBarCenter}>
          <View style={styles.omTitleRow}>
            <Text style={styles.omPrefix}>ॐ</Text>
            <Text style={[styles.topBarTitle, { fontFamily: titleFont }]}>
              Settings
            </Text>
          </View>
          <Text style={styles.topBarSubtitle}>SADHANA PREFERENCES</Text>
        </View>

        <Pressable
          onPress={() => router.push('/onboarding')}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Ionicons name="help-circle-outline" size={22} color={Colors.primaryDark} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Devotional Sanctuary Greeting Card */}
        <View style={styles.greetingCard}>
          <View style={styles.greetingCardContent}>
            <View style={styles.stillnessPill}>
              <Ionicons name="sunny" size={13} color={Colors.primary} />
              <Text style={styles.stillnessPillText}>Sanctuary Stillness</Text>
            </View>
            <Text style={[styles.greetingTitle, { fontFamily: titleFont }]}>
              Discipline of the Spirit
            </Text>
            <Text style={styles.greetingSub}>
              Attune your sacred counting, bells, and dawn reminders for uninterrupted meditation.
            </Text>
          </View>
          <View style={styles.lotusIconBox}>
            <Ionicons name="flower-outline" size={24} color={Colors.primaryDark} />
          </View>
        </View>

        {/* Section 1: Sacred Chanting Preferences */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons
              name="radiobox-marked"
              size={18}
              color={Colors.primaryDark}
            />
            <Text style={[styles.sectionHeading, { fontFamily: titleFont }]}>
              Sacred Chanting Preferences
            </Text>
          </View>

          <View style={styles.cardContainer}>
            {/* Mala Size */}
            <View style={styles.cardBlock}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardLabel}>
                  Mala Size{' '}
                  <Text style={styles.cardLabelSub}>(Beads per round)</Text>
                </Text>
                <Text style={styles.currentMalaBadge}>
                  ● {preferences.malaSize} Sacred
                </Text>
              </View>

              {/* 4-Option Segmented Selector */}
              <View style={styles.segmentGrid}>
                {/* 108 Beads */}
                <Pressable
                  onPress={() => handleMalaSizeChange(108)}
                  style={[
                    styles.segmentOption,
                    preferences.malaSize === 108 && styles.segmentOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentNum,
                      preferences.malaSize === 108 && styles.segmentTextSelected,
                    ]}
                  >
                    108
                  </Text>
                  <Text
                    style={[
                      styles.segmentSub,
                      preferences.malaSize === 108 && styles.segmentTextSelected,
                    ]}
                  >
                    Full Mala
                  </Text>
                </Pressable>

                {/* 54 Beads */}
                <Pressable
                  onPress={() => handleMalaSizeChange(54)}
                  style={[
                    styles.segmentOption,
                    preferences.malaSize === 54 && styles.segmentOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentNum,
                      preferences.malaSize === 54 && styles.segmentTextSelected,
                    ]}
                  >
                    54
                  </Text>
                  <Text
                    style={[
                      styles.segmentSub,
                      preferences.malaSize === 54 && styles.segmentTextSelected,
                    ]}
                  >
                    Half Mala
                  </Text>
                </Pressable>

                {/* 27 Beads */}
                <Pressable
                  onPress={() => handleMalaSizeChange(27)}
                  style={[
                    styles.segmentOption,
                    preferences.malaSize === 27 && styles.segmentOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentNum,
                      preferences.malaSize === 27 && styles.segmentTextSelected,
                    ]}
                  >
                    27
                  </Text>
                  <Text
                    style={[
                      styles.segmentSub,
                      preferences.malaSize === 27 && styles.segmentTextSelected,
                    ]}
                  >
                    Quarter
                  </Text>
                </Pressable>

                {/* Custom Count */}
                <Pressable
                  onPress={() => setShowCustomModal(true)}
                  style={[
                    styles.segmentOption,
                    ![108, 54, 27].includes(preferences.malaSize) && styles.segmentOptionSelected,
                  ]}
                >
                  <Ionicons
                    name="options-outline"
                    size={15}
                    color={
                      ![108, 54, 27].includes(preferences.malaSize)
                        ? '#FFFFFF'
                        : Colors.textMuted
                    }
                  />
                  <Text
                    style={[
                      styles.segmentSub,
                      ![108, 54, 27].includes(preferences.malaSize) && styles.segmentTextSelected,
                    ]}
                  >
                    {![108, 54, 27].includes(preferences.malaSize)
                      ? `${preferences.malaSize}`
                      : 'Custom'}
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.malaExplainer}>
                Traditional 108 beads represents cosmic wholeness and sacred breath cycles.
              </Text>
            </View>

            <View style={styles.cardDivider} />

            {/* Daily Sadhana Reminder */}
            <View style={styles.cardBlock}>
              <View style={styles.rowBetween}>
                <View style={styles.reminderLeft}>
                  <View style={styles.reminderIconBox}>
                    <Ionicons name="alarm-outline" size={20} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reminderTitle}>Daily Sadhana Reminder</Text>
                    <View style={styles.muhurtaRow}>
                      <Ionicons name="partly-sunny-outline" size={13} color={Colors.primary} />
                      <Text style={styles.muhurtaText}>
                        Brahma Muhurta ({preferences.dailyReminderTime})
                      </Text>
                    </View>
                    <Text style={styles.muhurtaSub}>
                      The sacred predawn window for highest spiritual clarity.
                    </Text>
                  </View>
                </View>

                <Switch
                  value={preferences.dailyReminderEnabled}
                  onValueChange={(val) =>
                    updatePreferences({ dailyReminderEnabled: val })
                  }
                  trackColor={{ false: '#EAE2D1', true: Colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Section 2: Sensory & Meditation Feedback */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="volume-medium-outline" size={18} color={Colors.primaryDark} />
            <Text style={[styles.sectionHeading, { fontFamily: titleFont }]}>
              Sensory & Meditation Feedback
            </Text>
          </View>

          <View style={styles.cardContainer}>
            {/* Chime Resonance */}
            <View style={styles.cardBlock}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardLabel}>Chime Resonance</Text>
                <Pressable onPress={handleTestBell} hitSlop={6}>
                  <Text style={styles.testBellLink}>🔔 Test Temple Bell</Text>
                </Pressable>
              </View>

              <View style={styles.chimesRow}>
                {[
                  { id: 'bell' as ChimeSound, label: 'Temple Bell (432Hz)' },
                  { id: 'tanpura' as ChimeSound, label: 'Tanpura Drone' },
                  { id: 'shankha' as ChimeSound, label: 'Shankha' },
                  { id: 'silent' as ChimeSound, label: 'Silent' },
                ].map((item) => {
                  const isSelected = preferences.chimeSound === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => updatePreferences({ chimeSound: item.id })}
                      style={[
                        styles.chimePill,
                        isSelected && styles.chimePillSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chimePillText,
                          isSelected && styles.chimePillTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.cardDivider} />

            {/* Tactile Pulse */}
            <View style={styles.cardBlock}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.cardLabel}>Tactile Vibration Feedback</Text>
                  <Text style={styles.malaExplainer}>
                    Gentle physical pulse confirming each counted bead.
                  </Text>
                </View>
                <Switch
                  value={preferences.tactilePulseEnabled}
                  onValueChange={(val) =>
                    updatePreferences({ tactilePulseEnabled: val })
                  }
                  trackColor={{ false: '#EAE2D1', true: Colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <View style={styles.cardDivider} />

            {/* Eyes-Closed Mode */}
            <View style={styles.cardBlock}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.cardLabel}>Eyes-Closed Prayer Ergonomics</Text>
                  <Text style={styles.malaExplainer}>
                    Full-screen tap zone with minimal light emission for deep absorption.
                  </Text>
                </View>
                <Switch
                  value={isEyesClosedMode}
                  onValueChange={toggleEyesClosed}
                  trackColor={{ false: '#EAE2D1', true: Colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Section 3: Sacred Language Selection */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="language-outline" size={18} color={Colors.primaryDark} />
            <Text style={[styles.sectionHeading, { fontFamily: titleFont }]}>
              Sacred Language
            </Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.cardBlock}>
              <View style={styles.langGrid}>
                {[
                  { id: 'te' as Language, title: 'తెలుగు', sub: 'Telugu' },
                  { id: 'hi' as Language, title: 'हिन्दी', sub: 'Hindi / Sanskrit' },
                  { id: 'en' as Language, title: 'English', sub: 'Transliteration' },
                ].map((item) => {
                  const isSelected = preferences.language === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => updatePreferences({ language: item.id })}
                      style={[
                        styles.langCard,
                        isSelected && styles.langCardSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.langTitle,
                          isSelected && styles.langTitleSelected,
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={[
                          styles.langSub,
                          isSelected && styles.langSubSelected,
                        ]}
                      >
                        {item.sub}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* Section 4: Sacred Archive & Export */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="archive-outline" size={18} color={Colors.primaryDark} />
            <Text style={[styles.sectionHeading, { fontFamily: titleFont }]}>
              Sacred Archive & Backup
            </Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.cardBlock}>
              <Text style={styles.cardLabel}>Export Counts to File</Text>
              <Text style={styles.malaExplainer}>
                Save your consecrated mantras, daily streak, and sadhana history to a JSON file.
              </Text>
              <Pressable
                onPress={handleExport}
                style={({ pressed }) => [styles.exportBtn, pressed && styles.pressed]}
              >
                <Ionicons name="download-outline" size={16} color="#FFFFFF" />
                <Text style={styles.exportBtnText}>Export Sadhana Archive</Text>
              </Pressable>
              {exportMessage ? (
                <Text style={styles.exportStatusText}>{exportMessage}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Japam Divine Upgrade Card */}
        <Pressable
          onPress={() => setPaywallVisible(true)}
          style={({ pressed }) => [styles.divineBanner, pressed && styles.pressed]}
        >
          <View style={styles.divineBannerLeft}>
            <View style={styles.divineIcon}>
              <Ionicons name="sparkles" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={[styles.divineTitle, { fontFamily: titleFont }]}>
                {preferences.isPremium ? 'Japam Divine Consecrated' : 'Upgrade to Japam Divine'}
              </Text>
              <Text style={styles.divineSub}>
                {preferences.isPremium
                  ? 'All sacred features and unlimited vows unlocked'
                  : 'Unlimited sankalpas, file backup & temple resonance'}
              </Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={18} color={Colors.primaryDark} />
        </Pressable>
      </ScrollView>

      {/* Custom Mala Size Modal */}
      <Modal
        visible={showCustomModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.customModalCard}>
            <Text style={[styles.customModalTitle, { fontFamily: titleFont }]}>
              Custom Mala Size
            </Text>
            <Text style={styles.customModalDesc}>
              Enter how many beads to count per completed round (e.g. 21, 33, 108):
            </Text>
            <TextInput
              style={styles.customInput}
              keyboardType="number-pad"
              value={customBeadInput}
              onChangeText={setCustomBeadInput}
              maxLength={4}
            />
            <View style={styles.modalBtnRow}>
              <Pressable
                onPress={() => setShowCustomModal(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveCustomMala}
                style={styles.modalSaveBtn}
              >
                <Text style={styles.modalSaveText}>Set Beads</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Japam Divine Paywall */}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(222, 193, 177, 0.25)',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarCenter: {
    alignItems: 'center',
  },
  omTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  omPrefix: {
    fontSize: 14,
    color: Colors.goldDark,
    fontWeight: '700',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  topBarSubtitle: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  greetingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.45)',
  },
  greetingCardContent: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  stillnessPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainer,
    marginBottom: Spacing.xs,
  },
  stillnessPillText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  greetingSub: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    marginTop: 2,
  },
  lotusIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionWrap: {
    gap: Spacing.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  cardContainer: {
    backgroundColor: Colors.surfaceIvory,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.45)',
  },
  cardBlock: {
    gap: Spacing.sm,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(222, 193, 177, 0.3)',
    marginVertical: Spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardLabelSub: {
    fontSize: 11,
    color: Colors.primaryDark,
    fontWeight: '400',
  },
  currentMalaBadge: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.primaryDark,
  },
  segmentGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radii.lg,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
  },
  segmentOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: Radii.md,
  },
  segmentOptionSelected: {
    backgroundColor: Colors.primary,
  },
  segmentNum: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  segmentSub: {
    fontFamily: Typography.fontSans,
    fontSize: 10,
    color: Colors.textMuted,
  },
  segmentTextSelected: {
    color: '#FFFFFF',
  },
  malaExplainer: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textTertiary,
    lineHeight: 16,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    flex: 1,
    paddingRight: Spacing.sm,
  },
  reminderIconBox: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderTitle: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  muhurtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  muhurtaText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  muhurtaSub: {
    fontFamily: Typography.fontSans,
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  testBellLink: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.primaryDark,
  },
  chimesRow: {
    gap: 6,
  },
  chimePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
  },
  chimePillSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chimePillText: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textMuted,
  },
  chimePillTextSelected: {
    fontFamily: Typography.fontSansSemiBold,
    fontWeight: '700',
    color: '#321300',
  },
  langGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  langCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: 4,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
  },
  langCardSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  langTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  langTitleSelected: {
    color: '#321300',
  },
  langSub: {
    fontFamily: Typography.fontSans,
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  langSubSelected: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingVertical: 9,
    marginTop: Spacing.xs,
  },
  exportBtnText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  exportStatusText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.primaryDark,
    textAlign: 'center',
    marginTop: 4,
  },
  divineBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 117, 26, 0.4)',
  },
  divineBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  divineIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  divineSub: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  customModalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.surfaceIvory,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  customModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  customModalDesc: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  customInput: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalCancelBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  modalCancelText: {
    fontFamily: Typography.fontSans,
    fontSize: 13,
    color: Colors.textMuted,
  },
  modalSaveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
  },
  modalSaveText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});
