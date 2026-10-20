import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii } from '../../constants/theme';
import { useSadhana } from '../../context/SadhanaContext';

interface JapamDivineModalProps {
  visible: boolean;
  onClose: () => void;
}

type PlanType = 'yearly' | 'monthly' | 'lifetime';

export const JapamDivineModal: React.FC<JapamDivineModalProps> = ({ visible, onClose }) => {
  const { unlockPremiumSimulation } = useSadhana();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [blessingMessage, setBlessingMessage] = useState<string>('');

  const handleContinue = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBlessingMessage('Blessed! Japam Divine unlocked for your sacred sadhana.');
      unlockPremiumSimulation();
      setTimeout(() => {
        setBlessingMessage('');
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Top Bar with Sankalpa Access Pill and Close Button */}
          <View style={styles.topBar}>
            <View style={styles.sankalpaPill}>
              <View style={styles.pulseDot} />
              <Text style={styles.sankalpaPillText}>SANKALPA ACCESS</Text>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
              hitSlop={12}
            >
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Devotional Hero Motif */}
            <View style={styles.heroSection}>
              <View style={styles.diyaGlowCircle}>
                <MaterialCommunityIcons name="candle" size={36} color={Colors.primary} />
                <Text style={styles.omSubtext}>ॐ</Text>
              </View>

              <View style={styles.brandPill}>
                <Ionicons name="flower-outline" size={13} color={Colors.primaryDark} />
                <Text style={styles.brandPillText}>JAPAM DIVINE</Text>
              </View>

              <Text style={styles.heroTitle}>Deepen your sadhana</Text>
              <Text style={styles.heroSubtitle}>
                Enhance your daily devotional practice with sacred companion tools and unwavering discipline.
              </Text>
            </View>

            {/* Feature List */}
            <View style={styles.featuresCard}>
              <View style={styles.featureRow}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={12} color="#7B5800" />
                </View>
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>Unlimited custom mantras & sankalpas</Text>
                  <Text style={styles.featureDesc}>
                    Add your family ishta-devata hymns and personalized vows.
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={12} color="#7B5800" />
                </View>
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>Sacred archive backup & export</Text>
                  <Text style={styles.featureDesc}>
                    Safely export your lifelong consecrated counts to file.
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={12} color="#7B5800" />
                </View>
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>Dawn & Ratri sanctum themes</Text>
                  <Text style={styles.featureDesc}>
                    Reflective night modes tailored for deep twilight chanting.
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={12} color="#7B5800" />
                </View>
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>Brahma Muhurta reminder cues</Text>
                  <Text style={styles.featureDesc}>
                    Gentle dawn chimes aligned with ancient cosmic stillness.
                  </Text>
                </View>
              </View>

              <View style={styles.verifiedRow}>
                <Ionicons name="shield-checkmark" size={16} color={Colors.primaryDark} />
                <Text style={styles.verifiedText}>Chanting screen stays ad-free, always</Text>
              </View>
            </View>

            {/* Pricing Plans */}
            <View style={styles.plansSection}>
              {/* Annual Plan */}
              <Pressable
                onPress={() => setSelectedPlan('yearly')}
                style={[
                  styles.planCard,
                  selectedPlan === 'yearly' && styles.planCardSelected,
                ]}
              >
                <View style={styles.bestValueBadge}>
                  <Text style={styles.bestValueText}>BEST VALUE</Text>
                </View>

                <View style={styles.planCardLeft}>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedPlan === 'yearly' && styles.radioCircleSelected,
                    ]}
                  >
                    {selectedPlan === 'yearly' && <View style={styles.radioDot} />}
                  </View>
                  <View>
                    <Text style={styles.planName}>Annual Offering</Text>
                    <Text style={styles.planSub}>Full year access • ₹33 / month</Text>
                  </View>
                </View>

                <View style={styles.planCardRight}>
                  <Text style={styles.planPrice}>₹399</Text>
                  <Text style={styles.planPeriod}>/ year</Text>
                </View>
              </Pressable>

              {/* Monthly Plan */}
              <Pressable
                onPress={() => setSelectedPlan('monthly')}
                style={[
                  styles.planCard,
                  selectedPlan === 'monthly' && styles.planCardSelected,
                ]}
              >
                <View style={styles.planCardLeft}>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedPlan === 'monthly' && styles.radioCircleSelected,
                    ]}
                  >
                    {selectedPlan === 'monthly' && <View style={styles.radioDot} />}
                  </View>
                  <View>
                    <Text style={styles.planName}>Monthly Sadhana</Text>
                    <Text style={styles.planSub}>Flexible month-to-month</Text>
                  </View>
                </View>

                <View style={styles.planCardRight}>
                  <Text style={styles.planPrice}>₹49</Text>
                  <Text style={styles.planPeriod}>/ month</Text>
                </View>
              </Pressable>

              {/* Lifetime Plan */}
              <Pressable
                onPress={() => setSelectedPlan('lifetime')}
                style={[
                  styles.planCard,
                  selectedPlan === 'lifetime' && styles.planCardSelected,
                ]}
              >
                <View style={styles.planCardLeft}>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedPlan === 'lifetime' && styles.radioCircleSelected,
                    ]}
                  >
                    {selectedPlan === 'lifetime' && <View style={styles.radioDot} />}
                  </View>
                  <View>
                    <Text style={styles.planName}>Lifetime Offering</Text>
                    <Text style={styles.planSub}>One-time sacred blessing</Text>
                  </View>
                </View>

                <View style={styles.planCardRight}>
                  <Text style={styles.planPrice}>₹1,499</Text>
                  <Text style={styles.planPeriod}>forever</Text>
                </View>
              </Pressable>
            </View>

            {blessingMessage ? (
              <View style={styles.blessingBanner}>
                <Text style={styles.blessingText}>{blessingMessage}</Text>
              </View>
            ) : null}

            {/* CTA Button */}
            <Pressable
              onPress={handleContinue}
              disabled={isProcessing}
              style={({ pressed }) => [
                styles.ctaBtn,
                pressed && styles.pressed,
                isProcessing && { opacity: 0.7 },
              ]}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.ctaBtnContent}>
                  <Text style={styles.ctaBtnText}>Begin Divine Sadhana</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
              )}
            </Pressable>

            {/* Footer subtext */}
            <View style={styles.footerGuarantees}>
              <Text style={styles.guaranteeText}>Cancel anytime • 100% sacred guarantee</Text>
              <Pressable onPress={onClose}>
                <Text style={styles.restoreText}>Restore Purchase</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '92%',
    backgroundColor: Colors.background,
    borderRadius: Radii.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  sankalpaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  sankalpaPillText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  diyaGlowCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(212, 166, 74, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
  },
  omSubtext: {
    position: 'absolute',
    bottom: -2,
    right: 2,
    fontSize: 12,
    color: Colors.goldDark,
    fontWeight: '700',
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255, 219, 200, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
  },
  brandPillText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    fontWeight: '700',
    color: '#321300',
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 2,
    maxWidth: 290,
  },
  featuresCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.4)',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFDEA5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  featureDesc: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(222, 193, 177, 0.3)',
    marginTop: 2,
  },
  verifiedText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  plansSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.6)',
    position: 'relative',
  },
  planCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceWarm,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -9,
    right: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  bestValueText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  planCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  planName: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  planSub: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  planCardRight: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  planPeriod: {
    fontFamily: Typography.fontSans,
    fontSize: 10,
    color: Colors.textTertiary,
  },
  blessingBanner: {
    padding: Spacing.sm,
    borderRadius: Radii.md,
    backgroundColor: '#FFDBC8',
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  blessingText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    fontWeight: '600',
    color: '#321300',
    textAlign: 'center',
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaBtnText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  footerGuarantees: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: 4,
  },
  guaranteeText: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  restoreText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.goldDark,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
