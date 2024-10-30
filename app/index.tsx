import { Redirect, useRouter } from 'expo-router';

import React from 'react';
import { Image, StyleSheet, Platform } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router  = useRouter();

  const { hasPermission } = useCameraPermission();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  const redirectToPermissions = !hasPermission || microphonePermission === 'not-determined';
  const device = useCameraDevice('back');

  if (redirectToPermissions) return <Redirect href={'/permissions'} />;

  if (!device) return <></>

  return (
    <ThemedText type='title'>Hello World!</ThemedText>
  );
}

const styles = StyleSheet.create({

});
