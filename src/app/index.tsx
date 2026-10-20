import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSadhana } from '../context/SadhanaContext';
import { Colors } from '../constants/theme';

export default function Index() {
  const { isInitialized, hasOnboarded } = useSadhana();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    if (hasOnboarded) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  }, [isInitialized, hasOnboarded, router]);

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundWarm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
