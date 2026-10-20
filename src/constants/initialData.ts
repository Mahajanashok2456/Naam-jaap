import { Mantra, UserPreferences, UserSadhanaStats } from '../types';

// The 3 Free Tier Built-in Mantras with zero counts for new users
export const FREE_TIER_MANTRAS: Mantra[] = [
  {
    id: 'om-namah-shivaya',
    title: 'Om Namah Shivaya',
    transliteration: 'Oṃ Namaḥ Śivāya',
    scriptText: {
      en: 'Om Namah Shivaya',
      hi: 'ॐ नमः शिवाय',
      te: 'ఓం నమః శివాయ',
    },
    category: 'daily',
    tagLabel: 'Active Daily Chanting',
    totalChanted: 0,
    goal: 0,
    roundsPerSession: 5,
    isFavorite: true,
    isActiveDaily: true,
    meaning: 'I bow to the Auspicious One, the innermost divine consciousness within all existence.',
  },
  {
    id: 'gayatri-mantra',
    title: 'Gayatri Mantra',
    transliteration: 'Oṃ Bhūr Bhuvaḥ Svaḥ Tat Savitur Vareṇyaṃ',
    scriptText: {
      en: 'Om Bhur Bhuvah Svah Tat Savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yo Nah Prachodayat',
      hi: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
      te: 'ఓం భూర్భువః స్వః తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి ధియో యో నః ప్రచోదయాత్',
    },
    category: 'vedic',
    tagLabel: 'Vedic Chhanda',
    totalChanted: 0,
    goal: 0,
    roundsPerSession: 3,
    isFavorite: false,
    isActiveDaily: false,
    meaning: 'We meditate on the transcendent splendor of the divine Sun; may that illuminate our minds and guide our intellect.',
  },
  {
    id: 'maha-mrityunjaya',
    title: 'Maha Mrityunjaya Mantra',
    transliteration: 'Oṃ Tryambakaṃ Yajāmahe Sugandhiṃ Puṣṭi-vardhanam',
    scriptText: {
      en: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Mamritat',
      hi: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्',
      te: 'ఓం త్ర్యంబకం యజామహే సుగంధిం పుష్టివర్ధనం ఉర్వారుకమివ బంధనాన్ మృత్యోర్ముక్షీయ మామృతాత్',
    },
    category: 'healing',
    tagLabel: 'Healing & Protection',
    totalChanted: 0,
    goal: 0,
    roundsPerSession: 1,
    isFavorite: false,
    isActiveDaily: false,
    meaning: 'We worship the Three-Eyed Lord who is fragrant and nourishes all beings. May He liberate us from death and bondages unto immortality.',
  },
];

// Additional Catalog Mantras available to add or unlocked with Japam Divine
export const ADDITIONAL_CATALOG_MANTRAS: Mantra[] = [
  {
    id: 'hare-krishna',
    title: 'Hare Krishna Maha Mantra',
    transliteration: 'Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare',
    scriptText: {
      en: 'Hare Krishna Hare Krishna Krishna Krishna Hare Hare, Hare Rama Hare Rama Rama Rama Hare Hare',
      hi: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे, हरे राम हरे राम राम राम हरे हरे',
      te: 'హరే కృష్ణ హరే కృష్ణ కృష్ణ కృష్ణ హరే హరే, హరే రామ హరే రామ రామ రామ హరే హరే',
    },
    category: 'bhakti',
    tagLabel: 'Bhakti Yoga',
    totalChanted: 0,
    goal: 0,
    roundsPerSession: 4,
    isFavorite: false,
    isActiveDaily: false,
    meaning: 'O Divine Energy of the Lord, O all-attractive Supreme Lord, please engage me in Your transcendental loving service.',
  },
  {
    id: 'ganesha-moola',
    title: 'Ganesha Moola Mantra',
    transliteration: 'Oṃ Gaṃ Gaṇapataye Namaḥ',
    scriptText: {
      en: 'Om Gam Ganapataye Namaha',
      hi: 'ॐ गं गणपतये नमः',
      te: 'ఓం గం గణపతయే నమః',
    },
    category: 'traditional',
    tagLabel: 'Obstacle Remover',
    totalChanted: 0,
    goal: 0,
    roundsPerSession: 2,
    isFavorite: false,
    isActiveDaily: false,
    meaning: 'Salutations unto Lord Ganesha, the remover of all obstacles and harbinger of auspicious beginnings.',
  },
];

export const INITIAL_PREFERENCES: UserPreferences = {
  language: 'en',
  atmosphere: 'dawn',
  malaSize: 108,
  dailyReminderEnabled: true,
  dailyReminderTime: '04:30 AM',
  soundEnabled: true, // v1: Bell only
  tactilePulseEnabled: true,
  hasCompletedOnboarding: false,
  isPremium: false,
};

// Clean initial stats for new users: zero counts, zero streak, no active goal
export const INITIAL_STATS: UserSadhanaStats = {
  todayChants: 0,
  todayTarget: 500,
  completedMalasToday: 0,
  currentStreakDays: 0,
  lifetimeChants: 0,
  lifetimeMalas: 0,
  activeSankalpaTitle: '',
  activeSankalpaProgress: 0,
  activeSankalpaGoal: 0,
  weeklyRecords: [
    { day: 'M', dayName: 'Monday', count: 0 },
    { day: 'T', dayName: 'Tuesday', count: 0 },
    { day: 'W', dayName: 'Wednesday', count: 0 },
    { day: 'T', dayName: 'Thursday', count: 0 },
    { day: 'F', dayName: 'Friday', count: 0 },
    { day: 'S', dayName: 'Saturday', count: 0 },
    { day: 'S', dayName: 'Sunday', count: 0 },
  ],
};
