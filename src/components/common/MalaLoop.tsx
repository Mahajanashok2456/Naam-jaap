import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Path,
  Rect,
  Ellipse,
  Line,
} from 'react-native-svg';
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

// Exact 24 bead coordinates from Stitch Japam Counter Screen (based on 320x320 viewport)
const STITCH_BEAD_COORDS = [
  { cx: 160.0, cy: 24.0 },
  { cx: 194.2, cy: 28.4 },
  { cx: 226.3, cy: 41.3 },
  { cx: 254.2, cy: 62.0 },
  { cx: 276.0, cy: 89.4 },
  { cx: 289.9, cy: 121.9 },
  { cx: 294.9, cy: 157.0 },
  { cx: 290.7, cy: 192.2 },
  { cx: 277.6, cy: 225.0 },
  { cx: 256.4, cy: 253.0 },
  { cx: 228.9, cy: 274.5 },
  { cx: 197.0, cy: 288.3 },
  { cx: 162.8, cy: 293.9 },
  { cx: 128.0, cy: 290.4 },
  { cx: 95.3, cy: 278.4 },
  { cx: 66.8, cy: 258.1 },
  { cx: 44.5, cy: 231.0 },
  { cx: 30.0, cy: 198.8 },
  { cx: 24.1, cy: 163.6 },
  { cx: 27.2, cy: 128.4 },
  { cx: 39.2, cy: 95.3 },
  { cx: 59.8, cy: 66.9 },
  { cx: 87.6, cy: 45.2 },
  { cx: 120.9, cy: 31.2 },
];

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
  const innerDiskDiameter = size * 0.69; // ~220px on 320px
  const scale = size / 320;
  const activeBeadsCount = Math.min(24, Math.floor((currentBead / totalBeads) * 24));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background Multi-layered Sacred Warm Ambient Lighting */}
      <View
        style={[
          styles.ambientHalo,
          {
            width: size * 1.15,
            height: size * 1.15,
            borderRadius: (size * 1.15) / 2,
          },
          isEyesClosed && styles.ambientHaloDark,
        ]}
      />

      {/* SVG Mala Ring with Beads & Sacred Geometry matching Stitch */}
      <Svg
        width={size}
        height={size}
        viewBox="0 0 320 320"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="sutraCordGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#D99636" />
            <Stop offset="50%" stopColor="#AA621A" />
            <Stop offset="100%" stopColor="#6B3808" />
          </LinearGradient>

          <RadialGradient id="beadActive3D" cx="36%" cy="32%" rx="68%" ry="68%">
            <Stop offset="0%" stopColor="#FFF6E5" />
            <Stop offset="22%" stopColor="#FFB74D" />
            <Stop offset="65%" stopColor="#BD4D00" />
            <Stop offset="90%" stopColor="#782900" />
            <Stop offset="100%" stopColor="#421200" />
          </RadialGradient>

          <RadialGradient id="beadPending3D" cx="35%" cy="30%" rx="70%" ry="70%">
            <Stop offset="0%" stopColor="#FFF0D6" />
            <Stop offset="25%" stopColor="#D6A974" />
            <Stop offset="65%" stopColor="#96663E" />
            <Stop offset="92%" stopColor="#613D21" />
            <Stop offset="100%" stopColor="#3A2110" />
          </RadialGradient>

          <RadialGradient id="guruBead3D" cx="32%" cy="28%" rx="72%" ry="72%">
            <Stop offset="0%" stopColor="#FFFDF5" />
            <Stop offset="20%" stopColor="#FFE082" />
            <Stop offset="55%" stopColor="#D48B17" />
            <Stop offset="85%" stopColor="#8C4F00" />
            <Stop offset="100%" stopColor="#4E2800" />
          </RadialGradient>

          <RadialGradient id="binduCapGrad" cx="35%" cy="35%" rx="65%" ry="65%">
            <Stop offset="0%" stopColor="#FFE082" />
            <Stop offset="70%" stopColor="#C87D17" />
            <Stop offset="100%" stopColor="#5D3300" />
          </RadialGradient>
        </Defs>

        {/* Sutra Cord Base and Braided Texture */}
        <Circle cx={160} cy={160} r={136} fill="none" stroke="#F3DEC4" strokeWidth={1} opacity={0.4} />
        <Circle
          cx={160}
          cy={160}
          r={136}
          fill="none"
          stroke="url(#sutraCordGrad)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="3.5 1.5"
        />

        {/* 24 Realistic 3D Beads around perimeter */}
        <G id="malaBeadsReal">
          {STITCH_BEAD_COORDS.map((coord, i) => {
            const isActive = i <= activeBeadsCount;
            const isCurrentLead = i === activeBeadsCount;

            if (isActive) {
              return (
                <G key={i}>
                  <Circle
                    cx={coord.cx}
                    cy={coord.cy}
                    r={isCurrentLead ? 8.0 : 7.2}
                    fill="url(#beadActive3D)"
                    stroke={isCurrentLead ? '#FFF8EE' : undefined}
                    strokeWidth={isCurrentLead ? 1.5 : undefined}
                  />
                  <Ellipse
                    cx={coord.cx - 2.2}
                    cy={coord.cy - 2.4}
                    rx={isCurrentLead ? 2.8 : 2.4}
                    ry={isCurrentLead ? 1.9 : 1.6}
                    fill="#FFF9F0"
                    opacity={isCurrentLead ? 0.8 : 0.65}
                  />
                </G>
              );
            } else {
              return (
                <G key={i}>
                  <Circle cx={coord.cx} cy={coord.cy} r={6.8} fill="url(#beadPending3D)" />
                  <Ellipse
                    cx={coord.cx - 2.0}
                    cy={coord.cy - 2.2}
                    rx={2.0}
                    ry={1.3}
                    fill="#FFF7EB"
                    opacity={0.4}
                  />
                </G>
              );
            }
          })}
        </G>

        {/* Guru Meru Bead & Sacred Tassel at the Top */}
        <G id="guruMeruBead">
          <Path d="M154,6 C155,-5 165,-5 166,6 L164,12 L156,12 Z" fill="url(#sutraCordGrad)" />
          <Path d="M154,-3 L147,-16 L173,-16 L166,-3 Z" fill="#E27814" />
          <Path d="M147,-16 Q160,-20 173,-16 L177,-24 Q160,-28 143,-24 Z" fill="#BD5700" />
          <Line x1={148} y1={-2} x2={142} y2={-18} stroke="#F5A623" strokeWidth={0.8} />
          <Line x1={153} y1={-2} x2={150} y2={-22} stroke="#FFD066" strokeWidth={1} />
          <Line x1={160} y1={-2} x2={160} y2={-24} stroke="#FFE499" strokeWidth={1.2} />
          <Line x1={167} y1={-2} x2={170} y2={-22} stroke="#FFD066" strokeWidth={1} />
          <Line x1={172} y1={-2} x2={178} y2={-18} stroke="#F5A623" strokeWidth={0.8} />
          <Rect x={153} y={-5} width={14} height={3.5} rx={1.7} fill="#FFDB7A" stroke="#A45700" strokeWidth={0.5} />
          <Ellipse cx={160} cy={15} rx={5} ry={3} fill="url(#binduCapGrad)" stroke="#FFE8B3" strokeWidth={0.7} />
          <Circle cx={160} cy={24} r={11} fill="url(#guruBead3D)" stroke="#FFF4DC" strokeWidth={1.6} />
          <Ellipse cx={156.8} cy={20.4} rx={3.8} ry={2.3} fill="#FFFFFF" opacity={0.85} />
          <Circle cx={160} cy={24} r={3.8} fill="none" stroke="#9B5706" strokeWidth={0.9} strokeDasharray="1.5 1.5" />
        </G>
      </Svg>

      {/* Central Interactive Disk - Exact Stitch Parchment Disc */}
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
        {/* Inset Border */}
        <View
          style={[
            styles.insetBorder,
            {
              width: innerDiskDiameter - 20,
              height: innerDiskDiameter - 20,
              borderRadius: (innerDiskDiameter - 20) / 2,
            },
          ]}
        />

        {/* Mantra Script Line Flanked by Saffron Dots */}
        <View style={styles.scriptRow}>
          <View style={styles.scriptDot} />
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
          <View style={styles.scriptDot} />
        </View>

        {/* Main Tabular Counter Number */}
        <Text
          style={[
            styles.beadCounterNumber,
            isEyesClosed && styles.beadCounterNumberEyesClosed,
          ]}
        >
          {currentBead}
        </Text>

        {/* of 108 Chants */}
        <Text
          style={[
            styles.totalChantsLabel,
            isEyesClosed && styles.totalChantsLabelEyesClosed,
          ]}
        >
          of {totalBeads} Chants
        </Text>

        {/* Round Indicator Badge with Individual Round Dots */}
        <View
          style={[
            styles.roundBadge,
            isEyesClosed && styles.roundBadgeEyesClosed,
          ]}
        >
          <View style={styles.roundDotsRow}>
            {Array.from({ length: totalRounds }).map((_, rIdx) => (
              <View
                key={rIdx}
                style={[
                  styles.roundDot,
                  rIdx < currentRound ? styles.roundDotFilled : styles.roundDotEmpty,
                ]}
              />
            ))}
          </View>
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
  ambientHalo: {
    position: 'absolute',
    backgroundColor: 'rgba(232, 117, 26, 0.08)',
  },
  ambientHaloDark: {
    backgroundColor: 'rgba(232, 117, 26, 0.04)',
  },
  centerDisk: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    position: 'relative',
  },
  centerDiskDawn: {
    backgroundColor: '#FFFDF9',
    borderColor: 'rgba(222, 193, 177, 0.45)',
    shadowColor: '#5A1A12',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  centerDiskEyesClosed: {
    backgroundColor: '#1F1B11',
    borderColor: 'rgba(87, 66, 55, 0.4)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  centerDiskPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },
  insetBorder: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.25)',
  },
  scriptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
    zIndex: 10,
  },
  scriptDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(152, 71, 0, 0.45)',
  },
  scriptText: {
    fontFamily: Typography.fontDevanagariSerifSemiBold,
    fontSize: 13,
    color: 'rgba(150, 71, 59, 0.85)',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  scriptTextEyesClosed: {
    color: Colors.goldLight,
  },
  beadCounterNumber: {
    fontFamily: Typography.fontPlayfair,
    fontSize: 50,
    fontWeight: '600',
    color: '#96473b',
    lineHeight: 56,
    textAlign: 'center',
    zIndex: 10,
  },
  beadCounterNumberEyesClosed: {
    color: '#FFB68A',
  },
  totalChantsLabel: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(150, 71, 59, 0.65)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 2,
    textAlign: 'center',
    zIndex: 10,
  },
  totalChantsLabelEyesClosed: {
    color: Colors.eyesClosedTextMuted,
  },
  roundBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(246, 237, 220, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 177, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  roundBadgeEyesClosed: {
    backgroundColor: Colors.eyesClosedBorder,
    borderColor: 'rgba(212, 166, 74, 0.3)',
  },
  roundDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roundDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  roundDotFilled: {
    backgroundColor: '#984700',
  },
  roundDotEmpty: {
    backgroundColor: 'rgba(222, 193, 177, 0.55)',
  },
  roundBadgeText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(150, 71, 59, 0.9)',
    letterSpacing: 0.4,
  },
  roundBadgeTextEyesClosed: {
    color: Colors.goldLight,
  },
});
