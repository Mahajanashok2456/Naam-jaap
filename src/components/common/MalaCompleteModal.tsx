import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii } from '../../constants/theme';

interface MalaCompleteModalProps {
  visible: boolean;
  round: number;
  totalRounds: number;
  mantraTitle: string;
  onContinue: () => void;
}

export const MalaCompleteModal: React.FC<MalaCompleteModalProps> = ({
  visible,
  round,
  totalRounds,
  mantraTitle,
  onContinue,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onContinue}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Glowing Aura Ring */}
          <View style={styles.glowCircle}>
            <MaterialCommunityIcons name="bell-ring" size={44} color={Colors.primary} />
          </View>

          <View style={styles.consecrationBadge}>
            <Text style={styles.consecrationBadgeText}>108 CHANTS CONSECRATED</Text>
          </View>

          <Text style={styles.title}>Mala Consecrated!</Text>
          <Text style={styles.subtitle}>
            You have completed Round {round} of {totalRounds} for {mantraTitle}.
          </Text>

          <View style={styles.statBox}>
            <Text style={styles.statBoxNum}>108</Text>
            <Text style={styles.statBoxLabel}>Sacred Chants Offered to the Divine</Text>
          </View>

          <Pressable
            onPress={onContinue}
            style={({ pressed }) => [styles.continueBtn, pressed && styles.pressed]}
          >
            <Text style={styles.continueBtnText}>
              {round < totalRounds ? `Begin Round ${round + 1}` : 'Complete Sadhana'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </Pressable>
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
    padding: Spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surfaceIvory,
    borderRadius: Radii.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 166, 74, 0.5)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  glowCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8F0',
    borderWidth: 2,
    borderColor: 'rgba(232, 117, 26, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: Spacing.md,
  },
  consecrationBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: Radii.full,
    backgroundColor: '#FFDBC8',
    marginBottom: Spacing.xs,
  },
  consecrationBadgeText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 10,
    fontWeight: '700',
    color: '#321300',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Typography.fontSans,
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  statBox: {
    width: '100%',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statBoxNum: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  statBoxLabel: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  continueBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  continueBtnText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
