import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, Typography, getFont, Radii } from '../../constants/theme';
import { useSadhana } from '../../context/SadhanaContext';
import { AddMantraModal } from '../../components/common/AddMantraModal';
import { JapamDivineModal } from '../../components/common/JapamDivineModal';
import { Mantra } from '../../types';

type FilterTab = 'all' | 'sankalpas' | 'traditional' | 'favorites';

export default function MantrasScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    mantras,
    activeMantraId,
    selectMantra,
    toggleFavorite,
    addMantra,
    preferences,
    canAddMoreMantras,
    isPaywallVisible,
    setPaywallVisible,
  } = useSadhana();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const titleFont = getFont('en', 'heading');

  const filteredMantras = mantras.filter((m) => {
    if (activeFilter === 'favorites') return m.isFavorite;
    if (activeFilter === 'sankalpas') return m.category === 'sankalpa' || m.goal >= 50000;
    if (activeFilter === 'traditional')
      return m.category === 'vedic' || m.category === 'healing' || m.category === 'bhakti';
    return true;
  });

  const handleChantNow = (mantra: Mantra) => {
    selectMantra(mantra.id);
    router.push('/(tabs)');
  };

  const handleOpenAdd = () => {
    if (!canAddMoreMantras && !preferences.isPremium) {
      setPaywallVisible(true);
    } else {
      setIsAddModalVisible(true);
    }
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

        <Text style={[styles.brandTitle, { fontFamily: titleFont }]}>Japam</Text>

        <View style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={22} color={Colors.primaryDark} />
          <View style={styles.notifDot} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Screen Header Description */}
        <View style={styles.headerSection}>
          <View style={styles.pradakshinaPill}>
            <View style={styles.saffronDot} />
            <Text style={styles.pradakshinaText}>PRADAKSHINA</Text>
          </View>
          <Text style={[styles.screenHeadline, { fontFamily: titleFont }]}>
            Sacred Mantras
          </Text>
          <Text style={styles.screenSubtitle}>
            Select mantra to begin your sadhana
          </Text>
        </View>

        {/* Filter Quick Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {(
            [
              { id: 'all', label: 'All Mantras' },
              { id: 'sankalpas', label: 'My Sankalpas' },
              { id: 'traditional', label: 'Traditional' },
              { id: 'favorites', label: 'Favorites' },
            ] as const
          ).map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveFilter(tab.id)}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Mantras List */}
        <View style={styles.cardsList}>
          {filteredMantras.map((mantra) => {
            const isCurrentlyActive = mantra.id === activeMantraId;
            const progressPercent = Math.min(
              100,
              parseFloat(((mantra.totalChanted / (mantra.goal || 10000)) * 100).toFixed(1))
            );
            const remainingChants = Math.max(0, mantra.goal - mantra.totalChanted);
            const estDays = Math.ceil(remainingChants / 500);

            // Featured Card: Active Daily Chanting
            if (mantra.isActiveDaily || isCurrentlyActive) {
              return (
                <View key={mantra.id} style={styles.activeMantraCard}>
                  {/* Decorative Watermark */}
                  <Text style={styles.cardWatermark}>ॐ</Text>

                  {/* Top Row: Active Badge & Favorite Star */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.activeTagPill}>
                      <View style={styles.pulseDot} />
                      <Text style={styles.activeTagText}>Active Daily Chanting</Text>
                    </View>

                    <Pressable
                      onPress={() => toggleFavorite(mantra.id)}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={mantra.isFavorite ? 'star' : 'star-outline'}
                        size={20}
                        color={Colors.primary}
                      />
                    </Pressable>
                  </View>

                  {/* Title & Script text */}
                  <Text style={[styles.activeCardTitle, { fontFamily: titleFont }]}>
                    {mantra.title}
                  </Text>
                  <Text style={styles.scriptSubtext}>
                    {mantra.scriptText.hi} • {mantra.scriptText.te}
                  </Text>

                  {/* Metrics Box */}
                  <View style={styles.metricsBox}>
                    <View style={styles.metricRow}>
                      <View>
                        <Text style={styles.metricLabel}>Total Chanted</Text>
                        <Text style={styles.metricValue}>
                          {mantra.totalChanted.toLocaleString()}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.metricLabel}>Goal</Text>
                        <Text style={styles.goalValue}>
                          {mantra.goal.toLocaleString()} ({mantra.goal >= 100000 ? '1 Lakh' : 'Sankalpa'})
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${progressPercent}%` },
                        ]}
                      />
                    </View>

                    <View style={styles.progressSubRow}>
                      <Text style={styles.percentText}>{progressPercent}% Complete</Text>
                      <Text style={styles.daysText}>Finish in ~{estDays} days</Text>
                    </View>
                  </View>

                  {/* Chant Now CTA */}
                  <View style={styles.ctaRow}>
                    <Pressable
                      onPress={() => handleChantNow(mantra)}
                      style={({ pressed }) => [styles.chantNowBtn, pressed && styles.pressed]}
                    >
                      <Text style={styles.chantNowText}>Chant Now</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </Pressable>
                  </View>
                </View>
              );
            }

            // Standard Mantra Card
            return (
              <Pressable
                key={mantra.id}
                onPress={() => selectMantra(mantra.id)}
                style={({ pressed }) => [styles.standardCard, pressed && styles.pressed]}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.standardTagPill}>
                    <Text style={styles.standardTagText}>{mantra.tagLabel}</Text>
                  </View>

                  <Pressable
                    onPress={() => toggleFavorite(mantra.id)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={mantra.isFavorite ? 'star' : 'star-outline'}
                      size={18}
                      color={mantra.isFavorite ? Colors.primary : Colors.textTertiary}
                    />
                  </Pressable>
                </View>

                <Text style={[styles.standardTitle, { fontFamily: titleFont }]}>
                  {mantra.title}
                </Text>
                <Text style={styles.standardScript}>
                  {preferences.language === 'te'
                    ? mantra.scriptText.te
                    : preferences.language === 'hi'
                    ? mantra.scriptText.hi
                    : mantra.transliteration}
                </Text>

                <View style={styles.standardFooter}>
                  <Text style={styles.standardChanted}>
                    {mantra.totalChanted.toLocaleString()} chants consecrated
                  </Text>
                  <Text style={styles.tapToSelect}>Tap to Select</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Add Mantra Action Button */}
        <Pressable
          onPress={handleOpenAdd}
          style={({ pressed }) => [styles.addMantraBtn, pressed && styles.pressed]}
        >
          <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.addMantraBtnText}>Add Custom Mantra</Text>
        </Pressable>
      </ScrollView>

      {/* Add Mantra Modal */}
      <AddMantraModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddMantra={(newMantra) => addMantra(newMantra)}
      />

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
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  headerSection: {
    marginBottom: Spacing.md,
  },
  pradakshinaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  saffronDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  pradakshinaText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.goldDark,
    letterSpacing: 1,
  },
  screenHeadline: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: -0.2,
  },
  screenSubtitle: {
    fontFamily: Typography.fontSans,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: Spacing.md,
  },
  filterPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 7,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    color: Colors.textMuted,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cardsList: {
    gap: Spacing.md,
  },
  activeMantraCard: {
    backgroundColor: Colors.surfaceIvory,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 117, 26, 0.45)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  cardWatermark: {
    position: 'absolute',
    right: -10,
    bottom: -15,
    fontSize: 88,
    color: 'rgba(152, 71, 0, 0.04)',
    fontFamily: Typography.fontPlayfair,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  activeTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryLight,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  activeTagText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    fontWeight: '700',
    color: '#321300',
  },
  activeCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scriptSubtext: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  metricsBox: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.35)',
    marginBottom: Spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  metricLabel: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textMuted,
  },
  metricValue: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  goalValue: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    color: Colors.textPrimary,
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(222, 193, 177, 0.4)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  percentText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.primaryDark,
  },
  daysText: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.goldDark,
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  chantNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  chantNowText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  standardCard: {
    backgroundColor: Colors.surfaceIvory,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  standardTagPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  standardTagText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    color: Colors.textMuted,
  },
  standardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  standardScript: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  standardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(222, 193, 177, 0.2)',
  },
  standardChanted: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  tapToSelect: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.goldDark,
  },
  addMantraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  addMantraBtnText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});
