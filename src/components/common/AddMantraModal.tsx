import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii } from '../../constants/theme';
import { Mantra } from '../../types';

interface AddMantraModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMantra: (mantra: Mantra) => void;
  onOpenPaywall?: () => void;
}

export const AddMantraModal: React.FC<AddMantraModalProps> = ({
  visible,
  onClose,
  onAddMantra,
}) => {
  const [title, setTitle] = useState('');
  const [sanskritText, setSanskritText] = useState('');
  const [teluguText, setTeluguText] = useState('');
  const [goal, setGoal] = useState<number>(10000);
  const [category, setCategory] = useState<Mantra['category']>('sankalpa');
  const [meaning, setMeaning] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newMantra: Mantra = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      transliteration: title.trim(),
      scriptText: {
        en: title.trim(),
        hi: sanskritText.trim() || title.trim(),
        te: teluguText.trim() || sanskritText.trim() || title.trim(),
      },
      category,
      tagLabel: category === 'sankalpa' ? 'Personal Sankalpa' : 'Family Ishta-Devata',
      totalChanted: 0,
      goal: goal || 10000,
      roundsPerSession: 5,
      isFavorite: true,
      meaning: meaning.trim(),
    };

    onAddMantra(newMantra);
    setTitle('');
    setSanskritText('');
    setTeluguText('');
    setMeaning('');
    onClose();
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="fire" size={22} color={Colors.primary} />
              <Text style={styles.headerTitle}>Add Sacred Mantra</Text>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.formContent}>
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mantra Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Om Gam Ganapataye Namaha"
                placeholderTextColor={Colors.textTertiary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Devanagari Sanskrit Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sanskrit / Devanagari Script</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. ॐ गं गणपतये नमः"
                placeholderTextColor={Colors.textTertiary}
                value={sanskritText}
                onChangeText={setSanskritText}
              />
            </View>

            {/* Telugu Script Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telugu Script (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. ఓం గం గణపతయే నమః"
                placeholderTextColor={Colors.textTertiary}
                value={teluguText}
                onChangeText={setTeluguText}
              />
            </View>

            {/* Sankalpa Goal Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sankalpa Chant Goal</Text>
              <View style={styles.goalRow}>
                {[1008, 10000, 50000, 100000].map((val) => {
                  const isSelected = goal === val;
                  const label =
                    val === 1008
                      ? '1,008'
                      : val === 10000
                      ? '10,000'
                      : val === 50000
                      ? '50,000'
                      : '1 Lakh';
                  return (
                    <Pressable
                      key={val}
                      onPress={() => setGoal(val)}
                      style={[styles.goalPill, isSelected && styles.goalPillSelected]}
                    >
                      <Text
                        style={[
                          styles.goalPillText,
                          isSelected && styles.goalPillTextSelected,
                        ]}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.catRow}>
                <Pressable
                  onPress={() => setCategory('sankalpa')}
                  style={[
                    styles.catBtn,
                    category === 'sankalpa' && styles.catBtnSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.catBtnText,
                      category === 'sankalpa' && styles.catBtnTextSelected,
                    ]}
                  >
                    Personal Sankalpa
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setCategory('bhakti')}
                  style={[
                    styles.catBtn,
                    category === 'bhakti' && styles.catBtnSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.catBtnText,
                      category === 'bhakti' && styles.catBtnTextSelected,
                    ]}
                  >
                    Ishta Devata
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={!title.trim()}
              style={({ pressed }) => [
                styles.submitBtn,
                !title.trim() && { opacity: 0.5 },
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.submitBtnText}>Consecrate Mantra</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colors.surfaceIvory,
    borderRadius: Radii.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 12,
    color: Colors.textMuted,
  },
  input: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.6)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    fontFamily: Typography.fontSans,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  goalRow: {
    flexDirection: 'row',
    gap: 6,
  },
  goalPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
    alignItems: 'center',
  },
  goalPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  goalPillText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    color: Colors.textMuted,
  },
  goalPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  catRow: {
    flexDirection: 'row',
    gap: 8,
  },
  catBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
    alignItems: 'center',
  },
  catBtnSelected: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderColor: Colors.primary,
  },
  catBtnText: {
    fontFamily: Typography.fontSans,
    fontSize: 11,
    color: Colors.textMuted,
  },
  catBtnTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  submitBtn: {
    marginTop: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
