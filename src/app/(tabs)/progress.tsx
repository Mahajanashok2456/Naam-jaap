import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useSadhana } from '../../context/SadhanaContext';

export default function ProgressPlaceholderScreen() {
  const { t } = useTranslation();
  const { stats } = useSadhana();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('progress.title', 'Your Sadhana Progress')}</Text>
          <Text style={styles.screenSubtitle}>
            {t('progress.sacredJourney', 'Sacred Journey')}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryCol}>
            <Text style={styles.colLabel}>{t('progress.todaysChants')}</Text>
            <Text style={styles.colValue}>{stats.todayChants}</Text>
            <Text style={styles.colSub}>
              {t('progress.malasCompleteToday', { count: stats.completedMalasToday })}
            </Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.summaryCol}>
            <Text style={styles.colLabel}>{t('progress.currentStreak')}</Text>
            <Text style={styles.colValue}>
              {stats.currentStreakDays} {t('progress.days')}
            </Text>
            <Text style={styles.colSub}>{t('progress.dailyPracticeKept')}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('progress.thisWeeksChanting')}</Text>
          <Text style={styles.cardSubtitle}>
            {t('progress.dailyTarget', { target: stats.todayTarget })}
          </Text>
          <View style={styles.weekChartPlaceholder}>
            {stats.weeklyRecords.map((record, index) => (
              <View key={index} style={styles.barCol}>
                <Text style={styles.barCount}>{record.count}</Text>
                <View
                  style={[
                    styles.barPill,
                    { height: Math.max(12, Math.min(80, (record.count / 500) * 80)) },
                    record.count >= 500 && styles.barPillTarget,
                  ]}
                />
                <Text style={styles.barDay}>{record.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('progress.lifetimeSadhana')}</Text>
          <Text style={styles.lifetimeValue}>
            {stats.lifetimeChants.toLocaleString()} chants
          </Text>
          <Text style={styles.lifetimeSub}>
            {t('progress.consecratedMalas', { count: stats.lifetimeMalas })}
          </Text>
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
    textTransform: 'uppercase',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  dividerVertical: {
    width: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.sm,
  },
  colLabel: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  colValue: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 28,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  colSub: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.goldDark,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardTitle: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  weekChartPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    marginTop: Spacing.lg,
    paddingTop: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barCount: {
    fontFamily: Typography.fontSans,
    fontSize: 9,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  barPill: {
    width: 16,
    borderRadius: 8,
    backgroundColor: Colors.borderLight,
  },
  barPillTarget: {
    backgroundColor: Colors.primary,
  },
  barDay: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 6,
  },
  lifetimeValue: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 24,
    color: Colors.primaryDark,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  lifetimeSub: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
