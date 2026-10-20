import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, Typography, getFont } from '../../constants/theme';
import { useSadhana } from '../../context/SadhanaContext';

export default function MantrasPlaceholderScreen() {
  const { t } = useTranslation();
  const { mantras, activeMantraId, selectMantra, toggleFavorite, preferences } = useSadhana();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>{t('mantras.title', 'Sacred Mantras')}</Text>
        <Text style={styles.screenSubtitle}>
          {t('mantras.subtitle', 'Select mantra to begin your sadhana')}
        </Text>
      </View>

      <FlatList
        data={mantras}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isActive = item.id === activeMantraId;
          const itemTitleFont = getFont(preferences.language, 'heading');

          return (
            <Pressable
              onPress={() => selectMantra(item.id)}
              style={[styles.card, isActive && styles.activeCard]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.tagLabel}>{item.tagLabel}</Text>
                <Pressable onPress={() => toggleFavorite(item.id)}>
                  <Text style={styles.starIcon}>{item.isFavorite ? '★' : '☆'}</Text>
                </Pressable>
              </View>

              <Text style={[styles.mantraTitle, { fontFamily: itemTitleFont }]}>
                {item.title}
              </Text>
              <Text style={styles.scriptPreview}>
                {preferences.language === 'te'
                  ? item.scriptText.te
                  : preferences.language === 'hi'
                  ? item.scriptText.hi
                  : item.transliteration}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={styles.countText}>
                  {t('mantras.totalChanted')}: {item.totalChanted.toLocaleString()}
                </Text>
                <Text style={styles.selectPrompt}>
                  {isActive ? '● Currently Active' : 'Tap to Select'}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
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
  listContent: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activeCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.surfaceWarm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  tagLabel: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.goldDark,
    textTransform: 'uppercase',
  },
  starIcon: {
    fontSize: 18,
    color: Colors.primary,
  },
  mantraTitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  scriptPreview: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  countText: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  selectPrompt: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.primaryDark,
  },
});
