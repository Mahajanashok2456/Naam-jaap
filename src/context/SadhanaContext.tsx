import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  FREE_TIER_MANTRAS,
  INITIAL_PREFERENCES,
  INITIAL_STATS,
} from '../constants/initialData';
import {
  USE_DEV_SAMPLE_DATA,
  DEV_SAMPLE_MANTRAS,
  DEV_SAMPLE_STATS,
} from '../constants/devSampleData';
import { audioService } from '../services/audioService';
import { exportSadhanaArchive } from '../services/exportService';
import { hapticService } from '../services/hapticService';
import { changeAppLanguage } from '../i18n';
import {
  Mantra,
  TIER_LIMITS,
  UserPreferences,
  UserSadhanaStats,
} from '../types';

const STORAGE_KEYS = {
  MANTRAS: '@japam_mantras_v1',
  ACTIVE_MANTRA_ID: '@japam_active_mantra_id_v1',
  PREFERENCES: '@japam_preferences_v1',
  STATS: '@japam_stats_v1',
  LAUNCHED_BEFORE: '@japam_launched_before_v1',
  HAS_ONBOARDED: '@japam_has_onboarded_v1',
};

interface SadhanaContextType {
  // Counting State
  currentBead: number;
  currentRound: number;
  totalRounds: number;
  malaTotal: number;
  activeMantra: Mantra;
  activeMantraId: string;
  mantras: Mantra[];

  // App & User Preferences
  preferences: UserPreferences;
  stats: UserSadhanaStats;
  isEyesClosedMode: boolean;
  isMalaCompleteModalVisible: boolean;
  isPaywallVisible: boolean;
  isInitialized: boolean;
  hasLaunchedBefore: boolean;
  hasOnboarded: boolean;

  // Actions
  incrementBead: () => void;
  undoBead: () => void;
  resetRound: () => void;
  selectMantra: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addMantra: (mantra: Mantra) => { success: boolean; requiresPremium: boolean };
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  updateStats: (newStats: UserSadhanaStats) => void;
  toggleEyesClosed: () => void;
  setPaywallVisible: (visible: boolean) => void;
  dismissMalaCompleteModal: () => void;
  exportCounts: () => Promise<{ success: boolean; message?: string }>;
  unlockPremiumSimulation: () => void;
  completeOnboarding: () => void;
  canAddMoreMantras: boolean;
}

const SadhanaContext = createContext<SadhanaContextType | undefined>(undefined);

export const SadhanaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasLaunchedBefore, setHasLaunchedBefore] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // Initial state uses clean zero stats unless __DEV__ opted into dev sample data
  const defaultMantras = __DEV__ && USE_DEV_SAMPLE_DATA ? DEV_SAMPLE_MANTRAS : FREE_TIER_MANTRAS;
  const defaultStats = __DEV__ && USE_DEV_SAMPLE_DATA ? DEV_SAMPLE_STATS : INITIAL_STATS;

  const [mantras, setMantras] = useState<Mantra[]>(defaultMantras);
  const [activeMantraId, setActiveMantraId] = useState<string>('om-namah-shivaya');
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);
  const [stats, setStats] = useState<UserSadhanaStats>(defaultStats);

  // Counter UI State kept in fast memory: fresh install starts at 0 beads
  const [currentBead, setCurrentBead] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [isEyesClosedMode, setIsEyesClosedMode] = useState<boolean>(false);
  const [isMalaCompleteModalVisible, setIsMalaCompleteModalVisible] = useState<boolean>(false);
  const [isPaywallVisible, setIsPaywallVisible] = useState<boolean>(false);

  const malaTotal = preferences.malaSize || 108;

  // Debounce saving timer ref (1 second debounce)
  const saveDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ref tracking latest data for debounced & background saves
  const latestDataRef = useRef({
    mantras,
    stats,
    preferences,
    activeMantraId,
  });

  useEffect(() => {
    latestDataRef.current = {
      mantras,
      stats,
      preferences,
      activeMantraId,
    };
  }, [mantras, stats, preferences, activeMantraId]);

  // Active mantra resolution
  const activeMantra = useMemo(() => {
    return mantras.find((m) => m.id === activeMantraId) || mantras[0] || FREE_TIER_MANTRAS[0];
  }, [mantras, activeMantraId]);

  const totalRounds = activeMantra.roundsPerSession || 5;

  /**
   * Save all in-memory data to AsyncStorage immediately (used on mala completion & app background)
   */
  const saveAllDataImmediately = useCallback(async () => {
    if (saveDebounceTimerRef.current) {
      clearTimeout(saveDebounceTimerRef.current);
      saveDebounceTimerRef.current = null;
    }
    const { mantras: m, stats: s, preferences: p, activeMantraId: id } = latestDataRef.current;
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.MANTRAS, JSON.stringify(m)),
        AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(s)),
        AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(p)),
        AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_MANTRA_ID, id),
      ]);
    } catch {
      // ignore
    }
  }, []);

  /**
   * Schedule debounced save of counts (1 second delay)
   */
  const scheduleDebouncedSave = useCallback(() => {
    if (saveDebounceTimerRef.current) {
      clearTimeout(saveDebounceTimerRef.current);
    }
    saveDebounceTimerRef.current = setTimeout(() => {
      saveAllDataImmediately();
    }, 1000);
  }, [saveAllDataImmediately]);

  // Listen for AppState changes to save on app background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState.match(/inactive|background/)) {
        saveAllDataImmediately();
      }
    });

    return () => {
      subscription.remove();
      if (saveDebounceTimerRef.current) {
        clearTimeout(saveDebounceTimerRef.current);
      }
    };
  }, [saveAllDataImmediately]);

  // Load persisted state on startup
  useEffect(() => {
    async function loadStoredData() {
      try {
        const [storedMantras, storedActiveId, storedPrefs, storedStats, launched, onboarded] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.MANTRAS),
            AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_MANTRA_ID),
            AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES),
            AsyncStorage.getItem(STORAGE_KEYS.STATS),
            AsyncStorage.getItem(STORAGE_KEYS.LAUNCHED_BEFORE),
            AsyncStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED),
          ]);

        if (storedMantras) {
          setMantras(JSON.parse(storedMantras));
        }
        if (storedActiveId) {
          setActiveMantraId(storedActiveId);
        }
        if (storedPrefs) {
          const parsedPrefs = JSON.parse(storedPrefs);
          setPreferences({ ...INITIAL_PREFERENCES, ...parsedPrefs });
          if (parsedPrefs.language) {
            changeAppLanguage(parsedPrefs.language);
          }
        }
        if (storedStats) {
          setStats({ ...INITIAL_STATS, ...JSON.parse(storedStats) });
        }
        if (launched) {
          setHasLaunchedBefore(true);
        }
        if (onboarded === 'true') {
          setHasOnboarded(true);
        }

        // Preload sounds
        audioService.preloadSounds();
      } catch {
        // Fallback to initial defaults
      } finally {
        setIsInitialized(true);
      }
    }

    loadStoredData();

    return () => {
      audioService.unload();
    };
  }, []);

  // Counting Action: increment bead
  const incrementBead = () => {
    const nextBead = currentBead + 1;

    if (nextBead >= malaTotal) {
      // Completed one full Mala round (e.g. 108 beads)
      hapticService.triggerMalaComplete(preferences.tactilePulseEnabled);
      audioService.playTempleBell(preferences.soundEnabled);

      const nextRound = currentRound + 1;
      setCurrentBead(0);
      setCurrentRound(nextRound);

      const updatedTodayChants = stats.todayChants + 1;
      const updatedLifetimeChants = stats.lifetimeChants + 1;
      const updatedMalasToday = stats.completedMalasToday + 1;
      const updatedLifetimeMalas = stats.lifetimeMalas + 1;
      const updatedSankalpaProgress = stats.activeSankalpaProgress + 1;

      // Update weekly record for today (last entry)
      const updatedWeekly = stats.weeklyRecords.map((r, i) =>
        i === stats.weeklyRecords.length - 1 ? { ...r, count: r.count + 1 } : r
      );

      const newStats: UserSadhanaStats = {
        ...stats,
        todayChants: updatedTodayChants,
        completedMalasToday: updatedMalasToday,
        lifetimeChants: updatedLifetimeChants,
        lifetimeMalas: updatedLifetimeMalas,
        activeSankalpaProgress: updatedSankalpaProgress,
        weeklyRecords: updatedWeekly,
      };

      setStats(newStats);

      const updatedMantras = mantras.map((m) =>
        m.id === activeMantra.id ? { ...m, totalChanted: m.totalChanted + 1 } : m
      );
      setMantras(updatedMantras);

      // Save to storage IMMEDIATELY on mala completion
      latestDataRef.current.stats = newStats;
      latestDataRef.current.mantras = updatedMantras;
      saveAllDataImmediately();

      setIsMalaCompleteModalVisible(true);
    } else {
      // Normal single bead increment: keep counts in memory and save with debounce
      setCurrentBead(nextBead);
      hapticService.triggerBeadTap(preferences.tactilePulseEnabled);
      audioService.playBeadTap(preferences.soundEnabled);

      const updatedTodayChants = stats.todayChants + 1;
      const updatedLifetimeChants = stats.lifetimeChants + 1;
      const updatedSankalpaProgress = stats.activeSankalpaProgress + 1;

      const updatedWeekly = stats.weeklyRecords.map((r, i) =>
        i === stats.weeklyRecords.length - 1 ? { ...r, count: r.count + 1 } : r
      );

      const newStats: UserSadhanaStats = {
        ...stats,
        todayChants: updatedTodayChants,
        lifetimeChants: updatedLifetimeChants,
        activeSankalpaProgress: updatedSankalpaProgress,
        weeklyRecords: updatedWeekly,
      };

      setStats(newStats);

      const updatedMantras = mantras.map((m) =>
        m.id === activeMantra.id ? { ...m, totalChanted: m.totalChanted + 1 } : m
      );
      setMantras(updatedMantras);

      latestDataRef.current.stats = newStats;
      latestDataRef.current.mantras = updatedMantras;

      // Debounce saving by 1 second instead of disk writes on every single tap
      scheduleDebouncedSave();
    }
  };

  // Undo bead
  const undoBead = () => {
    if (currentBead > 0) {
      setCurrentBead((prev) => prev - 1);
      hapticService.triggerSelection(preferences.tactilePulseEnabled);

      const newStats: UserSadhanaStats = {
        ...stats,
        todayChants: Math.max(0, stats.todayChants - 1),
        lifetimeChants: Math.max(0, stats.lifetimeChants - 1),
        activeSankalpaProgress: Math.max(0, stats.activeSankalpaProgress - 1),
      };
      setStats(newStats);

      const updatedMantras = mantras.map((m) =>
        m.id === activeMantra.id
          ? { ...m, totalChanted: Math.max(0, m.totalChanted - 1) }
          : m
      );
      setMantras(updatedMantras);

      latestDataRef.current.stats = newStats;
      latestDataRef.current.mantras = updatedMantras;
      scheduleDebouncedSave();
    }
  };

  // Reset current round back to bead 0
  const resetRound = () => {
    setCurrentBead(0);
    hapticService.triggerSelection(preferences.tactilePulseEnabled);
  };

  // Select active mantra
  const selectMantra = (id: string) => {
    setActiveMantraId(id);
    setCurrentBead(0);
    setCurrentRound(1);
    hapticService.triggerSelection(preferences.tactilePulseEnabled);
    latestDataRef.current.activeMantraId = id;
    scheduleDebouncedSave();
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    const updated = mantras.map((m) =>
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    );
    setMantras(updated);
    latestDataRef.current.mantras = updated;
    hapticService.triggerSelection(preferences.tactilePulseEnabled);
    scheduleDebouncedSave();
  };

  // Free Tier constraint check
  const canAddMoreMantras =
    preferences.isPremium || mantras.length < TIER_LIMITS.FREE.MAX_MANTRAS;

  // Add mantra (enforces Free vs Premium limit)
  const addMantra = (newMantra: Mantra): { success: boolean; requiresPremium: boolean } => {
    if (!canAddMoreMantras) {
      setIsPaywallVisible(true);
      return { success: false, requiresPremium: true };
    }

    const updated = [newMantra, ...mantras];
    setMantras(updated);
    latestDataRef.current.mantras = updated;
    selectMantra(newMantra.id);
    saveAllDataImmediately();
    return { success: true, requiresPremium: false };
  };

  const updatePreferences = (partial: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...partial };
    setPreferences(updated);
    latestDataRef.current.preferences = updated;
    if (partial.language) {
      changeAppLanguage(partial.language);
    }
    saveAllDataImmediately();
  };

  const updateStats = (newStats: UserSadhanaStats) => {
    setStats(newStats);
    latestDataRef.current.stats = newStats;
    scheduleDebouncedSave();
  };

  const toggleEyesClosed = () => {
    setIsEyesClosedMode((prev) => !prev);
    hapticService.triggerSelection(preferences.tactilePulseEnabled);
  };

  const exportCounts = async () => {
    const result = await exportSadhanaArchive(stats, mantras, preferences);
    if (result.success) {
      updatePreferences({
        lastExportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
    return result;
  };

  const unlockPremiumSimulation = () => {
    updatePreferences({ isPremium: true });
    setIsPaywallVisible(false);
    hapticService.triggerMalaComplete(preferences.tactilePulseEnabled);
  };

  const completeOnboarding = async () => {
    setHasOnboarded(true);
    setHasLaunchedBefore(true);
    updatePreferences({ hasCompletedOnboarding: true });
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true'),
        AsyncStorage.setItem(STORAGE_KEYS.LAUNCHED_BEFORE, 'true'),
      ]);
    } catch {
      // ignore
    }
  };

  const value = {
    currentBead,
    currentRound,
    totalRounds,
    malaTotal,
    activeMantra,
    activeMantraId,
    mantras,
    preferences,
    stats,
    isEyesClosedMode,
    isMalaCompleteModalVisible,
    isPaywallVisible,
    isInitialized,
    hasLaunchedBefore,
    hasOnboarded,
    incrementBead,
    undoBead,
    resetRound,
    selectMantra,
    toggleFavorite,
    addMantra,
    updatePreferences,
    updateStats,
    toggleEyesClosed,
    setPaywallVisible: setIsPaywallVisible,
    dismissMalaCompleteModal: () => setIsMalaCompleteModalVisible(false),
    exportCounts,
    unlockPremiumSimulation,
    completeOnboarding,
    canAddMoreMantras,
  };

  return <SadhanaContext.Provider value={value}>{children}</SadhanaContext.Provider>;
};

export const useSadhana = (): SadhanaContextType => {
  const context = useContext(SadhanaContext);
  if (!context) {
    throw new Error('useSadhana must be used within a SadhanaProvider');
  }
  return context;
};
