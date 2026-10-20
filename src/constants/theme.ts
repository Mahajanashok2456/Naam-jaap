import { Platform } from 'react-native';

export const Colors = {
  // Sacred Saffron & Fire
  primary: '#E8751A',
  primaryDark: '#984700',
  primaryLight: '#FFDBC8',
  primaryContainer: '#F28C38',
  onPrimary: '#FFFFFF',

  // Temple Maroon & Aged Kumkum Typography
  textPrimary: '#5A1A12',
  textSecondary: '#96473b',
  textMuted: '#574237',
  textTertiary: '#8A7265',
  textInverse: '#F9F0DF',

  // Auspicious Brass & Bell Gold
  gold: '#D4A64A',
  goldDark: '#B98E34',
  goldLight: '#F0BF60',
  goldPale: '#FFDEA5',

  // Dawn Sanctum Surfaces
  background: '#FFF8F0',
  backgroundWarm: '#FFF6E5',
  surface: '#FFFFFF',
  surfaceIvory: '#FFFDF8',
  surfaceWarm: '#FCF3E2',
  surfaceContainer: '#F6EDDC',
  surfaceContainerHigh: '#F0E7D7',

  // Borders & Wireframes
  border: '#DEC1B1',
  borderLight: 'rgba(222, 193, 177, 0.4)',
  borderGold: 'rgba(212, 166, 74, 0.35)',
  borderActive: 'rgba(232, 117, 26, 0.55)',

  // Eyes-Closed Mode / Ratri Night Palettes
  eyesClosedBg: '#18150D',
  eyesClosedSurface: '#1F1B11',
  eyesClosedCard: '#242015',
  eyesClosedBorder: '#343025',
  eyesClosedText: '#F9F0DF',
  eyesClosedTextMuted: '#DEC1B1',

  // Status
  success: '#3B7A57',
  error: '#BA1A1A',
} as const;

import { Language } from '../types';

export const Typography = {
  // English Fonts
  fontPlayfair: 'PlayfairDisplay_600SemiBold',
  fontJakartaRegular: 'PlusJakartaSans_400Regular',
  fontJakartaSemiBold: 'PlusJakartaSans_600SemiBold',

  // Telugu Fonts
  fontTeluguRegular: 'NotoSansTelugu_400Regular',
  fontTeluguSemiBold: 'NotoSansTelugu_600SemiBold',
  fontTeluguBold: 'NotoSansTelugu_700Bold',

  // Devanagari (Hindi / Sanskrit) Fonts
  fontDevanagariSansRegular: 'NotoSansDevanagari_400Regular',
  fontDevanagariSansSemiBold: 'NotoSansDevanagari_600SemiBold',
  fontDevanagariSerifSemiBold: 'NotoSerifDevanagari_600SemiBold',

  // Legacy aliases
  fontSerif: 'PlayfairDisplay_600SemiBold',
  fontSans: 'PlusJakartaSans_400Regular',
  fontSansSemiBold: 'PlusJakartaSans_600SemiBold',
} as const;

/**
 * Helper to ensure Telugu, Hindi, and English text always use the authentic script font.
 * Playfair Display is kept strictly for English headings.
 */
export function getFont(
  language: Language = 'en',
  variant: 'heading' | 'body' | 'bold' = 'body'
): string {
  if (language === 'te') {
    if (variant === 'heading') return Typography.fontTeluguSemiBold;
    if (variant === 'bold') return Typography.fontTeluguBold;
    return Typography.fontTeluguRegular;
  }

  if (language === 'hi') {
    if (variant === 'heading') return Typography.fontDevanagariSerifSemiBold;
    if (variant === 'bold') return Typography.fontDevanagariSansSemiBold;
    return Typography.fontDevanagariSansRegular;
  }

  // English default
  if (variant === 'heading') return Typography.fontPlayfair;
  if (variant === 'bold') return Typography.fontJakartaSemiBold;
  return Typography.fontJakartaRegular;
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const Radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const Shadows = {
  diya: {
    shadowColor: '#5A1A12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  saffronGlow: {
    shadowColor: '#E8751A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 5,
  },
  subtle: {
    shadowColor: '#5A1A12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
} as const;
