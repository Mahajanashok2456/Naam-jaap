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
import { JapamDivineModal } from '../../components/common/JapamDivineModal';

export default function ProgressScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { stats, isPaywallVisible, setPaywallVisible } = useSadhana();

  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);

  const titleFont = getFont('en', 'heading');

  const sankalpaPercent = stats.activeSankalpaGoal > 0
    ? ((stats.activeSankalpaProgress / stats.activeSankalpaGoal) * 100).toFixed(1)
    : '0.0';
  const remainingChants = Math.max(0, stats.activeSankalpaGoal - stats.activeSankalpaProgress);
  const avgChantsPerDay = 691;
  const daysToFinish = Math.ceil(remainingChants / avgChantsPerDay);

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
          <Text style={[styles.topBarTitle, { fontFamily: titleFont }]}>
            Your Sadhana Progress
          </Text>
          <Text style={styles.topBarSubtitle}>SACRED JOURNEY</Text>
        </View>

        <View style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={22} color={Colors.primaryDark} />
          <View style={styles.notifDot} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Summary Hero Card */}
        <View style={styles.summaryCard}>
          {/* Left: Today's Chants */}
          <View style={styles.summaryHalf}>
            <View style={styles.summaryHeaderRow}>
              <MaterialCommunityIcons name="fire" size={18} color={Colors.primary} />
              <Text style={styles.summaryHeaderLabel}>TODAY'S CHANTS</Text>
            </View>
            <View style={styles.summaryValueRow}>
              <Text style={[styles.summaryMainValue, { fontFamily: titleFont }]}>
                {stats.todayChants}
              </Text>
              <Text style={styles.summaryTargetText}>/ {stats.todayTarget}</Text>
            </View>
            <View style={styles.malasDoneRow}>
              <Ionicons name="checkmark-circle" size={13} color={Colors.primary} />
              <Text style={styles.malasDoneText}>
                {stats.completedMalasToday} Malas complete
              </Text>
            </View>
          </View>

          <View style={styles.verticalDivider} />

          {/* Right: Current Streak */}
          <View style={[styles.summaryHalf, { paddingLeft: Spacing.md }]}>
            <View style={styles.summaryHeaderRow}>
              <Ionicons name="sunny" size={18} color={Colors.goldDark} />
              <Text style={styles.summaryHeaderLabel}>CURRENT STREAK</Text>
            </View>
            <View style={styles.summaryValueRow}>
              <Text style={[styles.summaryMainValue, { fontFamily: titleFont }]}>
                {stats.currentStreakDays}
              </Text>
              <Text style={styles.summaryTargetText}>Days</Text>
            </View>
            <Text style={styles.streakStatusText}>Daily Practice Kept</Text>
          </View>
        </View>

        {/* 7-Day Activity Bar Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={[styles.chartTitle, { fontFamily: titleFont }]}>
                This Week's Chanting
              </Text>
              <Text style={styles.chartSubtitle}>
                Daily target: {stats.todayTarget} chants
              </Text>
            </View>
            <View style={styles.avgBadge}>
              <Text style={styles.avgBadgeText}>Avg {avgChantsPerDay} / day</Text>
            </View>
          </View>

          {/* Visual Bars Container */}
          <View style={styles.barsContainer}>
            {/* Target 500 Reference Line */}
            <View style={styles.targetDashedLine}>
              <Text style={styles.targetLineLabel}>Target 500</Text>
            </View>

            {/* Individual Bars */}
            <View style={styles.barsRow}>
              {stats.weeklyRecords.map((record, idx) => {
                const isTargetExceeded = record.count >= 500;
                const isPeak = record.isPeak;
                const isToday = idx === stats.weeklyRecords.length - 1;
                const barHeight = Math.min(130, Math.max(24, Math.round((record.count / 1100) * 130)));

                return (
                  <Pressable
                    key={idx}
                    onPress={() => setSelectedDayIdx(selectedDayIdx === idx ? null : idx)}
                    style={styles.barCol}
                  >
                    {/* Floating Count Label */}
                    <Text
                      style={[
                        styles.barCountLabel,
                        isPeak && styles.barCountLabelPeak,
                        isTargetExceeded && !isPeak && styles.barCountLabelExceeded,
                      ]}
                    >
                      {record.count.toLocaleString()}
                    </Text>

                    {/* Bar Pill */}
                    <View
                      style={[
                        styles.barPill,
                        { height: barHeight },
                        isPeak && styles.barPillPeak,
                        isTargetExceeded && !isPeak && styles.barPillExceeded,
                        isToday && styles.barPillToday,
                      ]}
                    >
                      <View
                        style={[
                          styles.barPillTopCap,
                          isTargetExceeded && styles.barPillTopCapActive,
                        ]}
                      />
                      {isPeak && (
                        <View style={styles.peakStarWrap}>
                          <Ionicons name="star" size={11} color={Colors.primary} />
                        </View>
                      )}
                    </View>

                    {/* Day letter */}
                    <Text
                      style={[
                        styles.barDayText,
                        isToday && styles.barDayTextToday,
                        isPeak && styles.barDayTextPeak,
                      ]}
                    >
                      {record.day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Tooltip for Selected Day */}
          {selectedDayIdx !== null && (
            <View style={styles.tooltipBox}>
              <Text style={styles.tooltipText}>
                <Text style={{ fontWeight: '700' }}>
                  {stats.weeklyRecords[selectedDayIdx].dayName}:
                </Text>{' '}
                {stats.weeklyRecords[selectedDayIdx].count} chants recited (
                {Math.round(stats.weeklyRecords[selectedDayIdx].count / 108)} Malas)
              </Text>
            </View>
          )}

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>Target Exceeded</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EAE2D1' }]} />
              <Text style={styles.legendText}>Reflective Pace</Text>
            </View>
          </View>
        </View>

        {/* Active Sankalpa Goal Card */}
        <View style={styles.sankalpaCard}>
          <View style={styles.sankalpaCardHeader}>
            <View>
              <View style={styles.sankalpaLabelRow}>
                <Ionicons name="flag-outline" size={14} color={Colors.primary} />
                <Text style={styles.sankalpaLabel}>ACTIVE SANKALPA</Text>
              </View>
              <Text style={[styles.sankalpaTitle, { fontFamily: titleFont }]}>
                {stats.activeSankalpaTitle}
              </Text>
            </View>
            <View style={styles.percentBadge}>
              <Text style={styles.percentBadgeText}>{sankalpaPercent}%</Text>
            </View>
          </View>

          {/* Counts */}
          <View style={styles.sankalpaCountsRow}>
            <Text style={[styles.sankalpaProgressNum, { fontFamily: titleFont }]}>
              {stats.activeSankalpaProgress.toLocaleString()}
            </Text>
            <Text style={styles.sankalpaGoalNum}>
              Goal: {stats.activeSankalpaGoal.toLocaleString()}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.sankalpaTrack}>
            <View
              style={[
                styles.sankalpaFill,
                { width: `${Math.min(100, parseFloat(sankalpaPercent))}%` },
              ]}
            >
              <View style={styles.sankalpaTip} />
            </View>
          </View>

          {/* Estimated Completion Badge */}
          <View style={styles.estimateBadge}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
            <Text style={styles.estimateText}>
              <Text style={{ fontWeight: '700', color: Colors.textSecondary }}>
                Estimated Completion:
              </Text>{' '}
              October 24 ({daysToFinish} days at current pace)
            </Text>
          </View>
        </View>

        {/* Lifetime Sadhana Milestone Card */}
        <View style={styles.lifetimeCard}>
          <Text style={styles.infinityWatermark}>∞</Text>

          <View>
            <View style={styles.lifetimeHeaderRow}>
              <Ionicons name="ribbon-outline" size={16} color={Colors.goldDark} />
              <Text style={styles.lifetimeLabel}>LIFETIME SADHANA</Text>
            </View>
            <Text style={[styles.lifetimeMainValue, { fontFamily: titleFont }]}>
              {stats.lifetimeChants.toLocaleString()} Chants
            </Text>
            <Text style={styles.lifetimeSubtext}>
              Equal to{' '}
              <Text style={{ fontWeight: '700', color: Colors.primaryDark }}>
                {stats.lifetimeMalas} Complete Malas
              </Text>{' '}
              consecrated
            </Text>
          </View>

          <View style={styles.lifetimeCircle}>
            <MaterialCommunityIcons name="all-inclusive" size={24} color={Colors.primary} />
          </View>
        </View>

        {/* Devotional Rudraksha Darshan Card */}
        <View style={styles.darshanCard}>
          <View style={styles.darshanContent}>
            <Text style={styles.darshanLabel}>RUDRAKSHA DARSHAN</Text>
            <Text style={styles.darshanQuote}>
              "Through regular japa, the mind becomes calm, the breath synchronizes, and inner silence dawns."
            </Text>
          </View>
        </View>

        {/* Deepen Sadhana Invitation Banner */}
        <Pressable
          onPress={() => setPaywallVisible(true)}
          style={({ pressed }) => [styles.paywallBanner, pressed && styles.pressed]}
        >
          <View style={styles.paywallBannerLeft}>
            <View style={styles.paywallIconWrap}>
              <Ionicons name="flower-outline" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={[styles.paywallTitle, { fontFamily: titleFont }]}>
                Deepen Your Sadhana
              </Text>
              <Text style={styles.paywallSub}>
                Unlimited mantras, backup & divine themes
              </Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={18} color={Colors.primaryDark} />
        </Pressable>
      </ScrollView>

      {/* Paywall Modal */}
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
  topBarCenter: {
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  topBarSubtitle: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 1.2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceIvory,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.45)',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryHalf: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: 'rgba(222, 193, 177, 0.4)',
    marginVertical: 2,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  summaryHeaderLabel: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.6,
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  summaryMainValue: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  summaryTargetText: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textTertiary,
  },
  malasDoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  malasDoneText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.goldDark,
  },
  streakStatusText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.primary,
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: Colors.surfaceIvory,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.45)',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chartSubtitle: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  avgBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
  },
  avgBadgeText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    color: Colors.goldDark,
  },
  barsContainer: {
    height: 160,
    justifyContent: 'flex-end',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(222, 193, 177, 0.4)',
    paddingBottom: 4,
  },
  targetDashedLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 74,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: 'rgba(185, 142, 52, 0.4)',
    alignItems: 'flex-end',
  },
  targetLineLabel: {
    fontFamily: Typography.fontSans,
    fontSize: 9,
    color: Colors.textTertiary,
    backgroundColor: Colors.surfaceIvory,
    paddingHorizontal: 4,
    marginBottom: -6,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 10,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barCountLabel: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 9,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  barCountLabelPeak: {
    color: Colors.primary,
    fontWeight: '700',
  },
  barCountLabelExceeded: {
    color: Colors.primaryDark,
  },
  barPill: {
    width: 24,
    borderRadius: Radii.sm,
    backgroundColor: '#EAE2D1',
    position: 'relative',
  },
  barPillExceeded: {
    backgroundColor: Colors.primary,
  },
  barPillPeak: {
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: '#FFDBC8',
  },
  barPillToday: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  barPillTopCap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(222, 193, 177, 0.6)',
    borderTopLeftRadius: Radii.sm,
    borderTopRightRadius: Radii.sm,
  },
  barPillTopCapActive: {
    backgroundColor: '#FFDEA5',
  },
  peakStarWrap: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
  },
  barDayText: {
    fontFamily: Typography.fontSans,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 6,
  },
  barDayTextToday: {
    color: Colors.primary,
    fontWeight: '700',
  },
  barDayTextPeak: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  tooltipBox: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
  },
  tooltipText: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.primaryDark,
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  sankalpaCard: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
  },
  sankalpaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sankalpaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  sankalpaLabel: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 0.8,
  },
  sankalpaTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  percentBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryLight,
  },
  percentBadgeText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    fontWeight: '700',
    color: '#321300',
  },
  sankalpaCountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: Spacing.md,
  },
  sankalpaProgressNum: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  sankalpaGoalNum: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textMuted,
  },
  sankalpaTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EAE2D1',
    marginTop: 6,
    overflow: 'hidden',
  },
  sankalpaFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    position: 'relative',
  },
  sankalpaTip: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FFDEA5',
  },
  estimateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
  },
  estimateText: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 16,
  },
  lifetimeCard: {
    backgroundColor: Colors.surfaceIvory,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.45)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  infinityWatermark: {
    position: 'absolute',
    right: -10,
    bottom: -20,
    fontSize: 90,
    color: 'rgba(212, 166, 74, 0.08)',
  },
  lifetimeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  lifetimeLabel: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 0.8,
  },
  lifetimeMainValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  lifetimeSubtext: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  lifetimeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darshanCard: {
    borderRadius: Radii.xl,
    backgroundColor: '#34261B',
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.3)',
  },
  darshanContent: {
    gap: 4,
  },
  darshanLabel: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFDEA5',
    letterSpacing: 1.2,
  },
  darshanQuote: {
    fontFamily: Typography.fontSans,
    fontStyle: 'italic',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: 18,
  },
  paywallBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(232, 117, 26, 0.35)',
  },
  paywallBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  paywallIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paywallTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  paywallSub: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});
