import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Typography } from '../../constants/theme';
import { useSadhana } from '../../context/SadhanaContext';

export default function TabsLayout() {
  const { t } = useTranslation();
  const { isEyesClosedMode } = useSadhana();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isEyesClosedMode ? Colors.eyesClosedCard : Colors.surfaceWarm,
          borderTopColor: isEyesClosedMode ? Colors.eyesClosedBorder : Colors.borderLight,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: isEyesClosedMode ? Colors.eyesClosedTextMuted : Colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: Typography.fontSansSemiBold,
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.chant', 'Chant'),
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'radiobox-marked' : 'radiobox-blank'}
              size={size || 22}
              color={String(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mantras"
        options={{
          title: t('tabs.mantras', 'Mantras'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={size || 22}
              color={String(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t('tabs.progress', 'Progress'),
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'fire' : 'fire-circle'}
              size={size || 24}
              color={String(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings', 'Settings'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={size || 22}
              color={String(color)}
            />
          ),
        }}
      />
    </Tabs>
  );
}
