import { Mantra, UserSadhanaStats } from '../types';

/**
 * Seeded sample data for development and visual testing.
 * Only loaded when explicitly opted in via __DEV__ configuration.
 */
export const USE_DEV_SAMPLE_DATA = false; // Set to true during dev testing if needed

export const DEV_SAMPLE_MANTRAS: Mantra[] = [
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
    totalChanted: 24840,
    goal: 100000,
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
    totalChanted: 10800,
    goal: 50000,
    roundsPerSession: 3,
    isFavorite: true,
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
      te: 'ఓం త్ర్యంబకం యజామహే సుగంధిం పుష్టివర్ధనం ఉర్వారుకమివ బంధనాన్ మృత్యోర్ముक्षీయ మామృతాత్',
    },
    category: 'healing',
    tagLabel: 'Healing & Protection',
    totalChanted: 5400,
    goal: 10000,
    roundsPerSession: 1,
    isFavorite: false,
    isActiveDaily: false,
    meaning: 'We worship the Three-Eyed Lord who is fragrant and nourishes all beings. May He liberate us from death and bondages unto immortality.',
  },
];

export const DEV_SAMPLE_STATS: UserSadhanaStats = {
  todayChants: 540,
  todayTarget: 500,
  completedMalasToday: 5,
  currentStreakDays: 14,
  lifetimeChants: 54280,
  lifetimeMalas: 502,
  activeSankalpaTitle: '1 Lakh Chants for Peace & Clarity',
  activeSankalpaProgress: 54280,
  activeSankalpaGoal: 100000,
  weeklyRecords: [
    { day: 'M', dayName: 'Monday', count: 540 },
    { day: 'T', dayName: 'Tuesday', count: 432 },
    { day: 'W', dayName: 'Wednesday', count: 864 },
    { day: 'T', dayName: 'Thursday', count: 540 },
    { day: 'F', dayName: 'Friday', count: 1080, isPeak: true },
    { day: 'S', dayName: 'Saturday', count: 756 },
    { day: 'S', dayName: 'Sunday', count: 540 },
  ],
};
