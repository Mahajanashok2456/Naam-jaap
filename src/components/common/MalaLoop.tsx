import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography, Spacing } from '../../constants/theme';

interface MalaLoopProps {
  currentBead: number;
  totalBeads: number;
  currentRound: number;
  totalRounds: number;
  scriptText: string;
  scriptFont?: string;
  isEyesClosed?: boolean;
  size?: number;
  onTap: () => void;
}

export const MalaLoop: React.FC<MalaLoopProps> = ({
  currentBead,
  totalBeads = 108,
  currentRound = 1,
  totalRounds = 5,
  scriptText,
  scriptFont,
  isEyesClosed = false,
  size = 320,
  onTap,
}) => {
  const centerCoord = size / 2;
  const circleRadius = size * 0.42; // ~134px on 320px
  const innerDiskDiameter = size * 0.68; // ~218px on 320px

  // Number of visual bead markers around the circumference
  const totalDisplayBeads = totalBeads <= 54 ? totalBeads : 36;
  const progressRatio = totalBeads > 0 ? Math.min(1, currentBead / totalBeads) : 0;

  // Circumference for SVG stroke progress
  const strokeRadius = circleRadius;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Generate bead positions along the circle
  const beadMarkers = useMemo(() => {
    return Array.from({ length: totalDisplayBeads }).map((_, index) => {
      // Index 0 starts at top (12 o'clock = -PI/2)
      const angle = (index / totalDisplayBeads) * 2 * Math.PI - Math.PI / 2;
      const x = centerCoord + circleRadius * Math.cos(angle);
      const y = centerCoord + circleRadius * Math.sin(angle);

      // Equivalent bead count for this visual marker
      const beadValue = Math.round((index / totalDisplayBeads) * totalBeads);
      const isCompleted = currentBead > 0 && beadValue <= currentBead;
      const isCurrent =
        currentBead > 0 &&
        Math.abs(beadValue - currentBead) <= Math.ceil(totalBeads / totalDisplayBeads / 2);
      const isGuruBead = index === 0;

      return {
        index,
        x,
        y,
        isCompleted,
        isCurrent,
        isGuruBead,
      };
    });
  }, [totalDisplayBeads, totalBeads, currentBead, centerCoord, circleRadius]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer subtle mandala rings */}
      <View
        style={[
          styles.outerMandalaRing,
          { width: size, height: size, borderRadius: size / 2 },
          isEyesClosed && styles.outerMandalaRingDark,
        ]}
      />
      <View
        style={[
          styles.innerMandalaRing,
          {
            width: size - 16,
            height: size - 16,
            borderRadius: (size - 16) / 2,
            top: 8,
            left: 8,
          },
          isEyesClosed && styles.innerMandalaRingDark,
        ]}
      />

      {/* SVG Circular Progress Track */}
      <Svg
        width={size}
        height={size}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        {/* Background track */}
        <Circle
          cx={centerCoord}
          cy={centerCoord}
          r={strokeRadius}
          fill="none"
          stroke={isEyesClosed ? '#343025' : '#FCF3E2'}
          strokeWidth={5}
        />

        {/* Active glowing saffron progress arc */}
        {progressRatio > 0 && (
          <Circle
            cx={centerCoord}
            cy={centerCoord}
            r={strokeRadius}
            fill="none"
            stroke={Colors.primary}
            strokeWidth={5.5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${centerCoord} ${centerCoord})`}
          />
        )}
      </Svg>

      {/* Render individual Mala Beads along the track */}
      {beadMarkers.map((b) => {
        const beadSize = b.isGuruBead ? 14 : b.isCompleted ? 10 : 8;
        return (
          <View
            key={b.index}
            style={[
              styles.bead,
              {
                left: b.x - beadSize / 2,
                top: b.y - beadSize / 2,
                width: beadSize,
                height: beadSize,
                borderRadius: beadSize / 2,
              },
              b.isGuruBead && styles.guruBead,
              b.isCompleted && styles.completedBead,
              b.isCurrent && styles.currentBeadGlow,
              isEyesClosed && !b.isCompleted && styles.beadDark,
            ]}
          >
            {b.isGuruBead && <View style={styles.guruPinnacle} />}
          </View>
        );
      })}

      {/* Central Interactive Disk */}
      <Pressable
        onPress={onTap}
        style={({ pressed }) => [
          styles.centerDisk,
          {
            width: innerDiskDiameter,
            height: innerDiskDiameter,
            borderRadius: innerDiskDiameter / 2,
          },
          isEyesClosed ? styles.centerDiskEyesClosed : styles.centerDiskDawn,
          pressed && styles.centerDiskPressed,
        ]}
      >
        {/* Mantra Script Line */}
        <Text
          numberOfLines={1}
          style={[
            styles.scriptText,
            scriptFont ? { fontFamily: scriptFont } : undefined,
            isEyesClosed && styles.scriptTextEyesClosed,
          ]}
        >
          {scriptText}
        </Text>

        {/* Main Tabular Counter Number */}
        <Text
          style={[
            styles.beadCounterNumber,
            isEyesClosed && styles.beadCounterNumberEyesClosed,
          ]}
        >
          {currentBead}
        </Text>

        {/* Total Chants Label */}
        <Text
          style={[
            styles.totalChantsLabel,
            isEyesClosed && styles.totalChantsLabelEyesClosed,
          ]}
        >
          of {totalBeads} Chants
        </Text>

        {/* Round Indicator Badge */}
        <View
          style={[
            styles.roundBadge,
            isEyesClosed && styles.roundBadgeEyesClosed,
          ]}
        >
          <Text
            style={[
              styles.roundBadgeText,
              isEyesClosed && styles.roundBadgeTextEyesClosed,
            ]}
          >
            Round {currentRound} of {totalRounds}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerMandalaRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(212, 166, 74, 0.25)',
  },
  outerMandalaRingDark: {
    borderColor: 'rgba(212, 166, 74, 0.12)',
  },
  innerMandalaRing: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(222, 193, 177, 0.35)',
  },
  innerMandalaRingDark: {
    borderColor: 'rgba(87, 66, 55, 0.35)',
  },
  bead: {
    position: 'absolute',
    backgroundColor: '#EAD5A8',
  },
  beadDark: {
    backgroundColor: 'rgba(87, 66, 55, 0.6)',
  },
  completedBead: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 3,
  },
  currentBeadGlow: {
    borderWidth: 2,
    borderColor: '#FFDEA5',
    transform: [{ scale: 1.25 }],
  },
  guruBead: {
    backgroundColor: Colors.goldDark,
    borderWidth: 2,
    borderColor: Colors.primary,
    zIndex: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  guruPinnacle: {
    position: 'absolute',
    top: -5,
    alignSelf: 'center',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  centerDisk: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1.5,
  },
  centerDiskDawn: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(222, 193, 177, 0.45)',
    shadowColor: '#5A1A12',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
  centerDiskEyesClosed: {
    backgroundColor: 'rgba(31, 27, 17, 0.95)',
    borderColor: 'rgba(87, 66, 55, 0.4)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  centerDiskPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },
  scriptText: {
    fontFamily: Typography.fontDevanagariSerifSemiBold,
    fontSize: 14,
    color: '#7B5800',
    letterSpacing: 0.5,
    marginBottom: 2,
    textAlign: 'center',
  },
  scriptTextEyesClosed: {
    color: Colors.goldLight,
  },
  beadCounterNumber: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 60,
    fontWeight: '600',
    color: Colors.textSecondary,
    lineHeight: 66,
    textAlign: 'center',
  },
  beadCounterNumberEyesClosed: {
    color: Colors.primaryLight,
  },
  totalChantsLabel: {
    fontFamily: Typography.fontSans,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  totalChantsLabelEyesClosed: {
    color: Colors.eyesClosedTextMuted,
  },
  roundBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: Colors.surfaceWarm,
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
  },
  roundBadgeEyesClosed: {
    backgroundColor: Colors.eyesClosedBorder,
    borderColor: 'rgba(212, 166, 74, 0.3)',
  },
  roundBadgeText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    fontWeight: '600',
    color: '#7B5800',
    letterSpacing: 0.4,
  },
  roundBadgeTextEyesClosed: {
    color: Colors.goldLight,
  },
});
