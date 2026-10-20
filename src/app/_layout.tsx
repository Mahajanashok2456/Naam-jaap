import { PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  NotoSansTelugu_400Regular,
  NotoSansTelugu_600SemiBold,
  NotoSansTelugu_700Bold,
} from '@expo-google-fonts/noto-sans-telugu';
import {
  NotoSansDevanagari_400Regular,
  NotoSansDevanagari_600SemiBold,
} from '@expo-google-fonts/noto-sans-devanagari';
import { NotoSerifDevanagari_600SemiBold } from '@expo-google-fonts/noto-serif-devanagari';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../i18n';
import { SadhanaProvider, useSadhana } from '../context/SadhanaContext';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isInitialized, hasOnboarded } = useSadhana();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    const currentSegment = segments[0] as string | undefined;

    if (hasOnboarded) {
      if (currentSegment === 'onboarding' || currentSegment === undefined) {
        router.replace('/(tabs)');
      }
    } else {
      if (currentSegment !== 'onboarding') {
        router.replace('/onboarding');
      }
    }
  }, [isInitialized, hasOnboarded, segments, router]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFF8F0' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_600SemiBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    NotoSansTelugu_400Regular,
    NotoSansTelugu_600SemiBold,
    NotoSansTelugu_700Bold,
    NotoSansDevanagari_400Regular,
    NotoSansDevanagari_600SemiBold,
    NotoSerifDevanagari_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SadhanaProvider>
        <RootNavigator />
      </SadhanaProvider>
    </SafeAreaProvider>
  );
}
