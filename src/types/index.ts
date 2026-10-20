export type Language = 'en' | 'te' | 'hi';

export type SanctuaryAtmosphere = 'dawn' | 'ratri';

export type MalaSize = 108 | 54 | 27 | number;

export type ChimeSound = 'bell' | 'tanpura' | 'shankha' | 'silent';

export interface Mantra {
  id: string;
  title: string;
  transliteration: string;
  scriptText: {
    en: string;
    hi: string;
    te: string;
  };
  category: 'daily' | 'vedic' | 'healing' | 'bhakti' | 'sankalpa' | 'traditional';
  tagLabel: string;
  totalChanted: number;
  goal: number;
  roundsPerSession: number;
  isFavorite: boolean;
  isActiveDaily?: boolean;
  meaning?: string;
}

export interface DayChantRecord {
  day: string; // 'M' | 'T' | 'W' | 'T' | 'F' | 'S' | 'S'
  dayName: string;
  count: number;
  isPeak?: boolean;
}

export interface UserPreferences {
  language: Language;
  atmosphere: SanctuaryAtmosphere;
  malaSize: MalaSize;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  soundEnabled: boolean; // v1: Bell only
  chimeSound?: ChimeSound;
  tactilePulseEnabled: boolean;
  hasCompletedOnboarding: boolean;
  isPremium: boolean; // Free vs Japam Divine Premium
  lastExportedAt?: string;
}

export interface UserSadhanaStats {
  todayChants: number;
  todayTarget: number;
  completedMalasToday: number;
  currentStreakDays: number;
  lifetimeChants: number;
  lifetimeMalas: number;
  activeSankalpaTitle: string;
  activeSankalpaProgress: number;
  activeSankalpaGoal: number;
  weeklyRecords: DayChantRecord[];
}

export interface ExportArchiveData {
  app: string;
  exportDate: string;
  version: string;
  stats: UserSadhanaStats;
  mantras: Mantra[];
  preferences: UserPreferences;
}

export const TIER_LIMITS = {
  FREE: {
    MAX_MANTRAS: 3,
    MAX_ACTIVE_GOALS: 1,
    CAN_EXPORT: false,
    CAN_CUSTOM_THEMES: false,
  },
  PREMIUM: {
    MAX_MANTRAS: Infinity,
    MAX_ACTIVE_GOALS: Infinity,
    CAN_EXPORT: true,
    CAN_CUSTOM_THEMES: true,
  },
} as const;
