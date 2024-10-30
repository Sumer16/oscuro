import { Redirect, useRouter } from 'expo-router';

import React, { useState } from 'react';
import { Image, StyleSheet, Platform, View, StatusBar, SafeAreaView } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

import { ThemedText } from '@/components/ThemedText';
import OscuroButton from '@/components/OscuroButton';

export default function HomeScreen() {
  const router  = useRouter();

  const { hasPermission } = useCameraPermission();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  const redirectToPermissions = !hasPermission || microphonePermission === 'not-determined';
  const device = useCameraDevice('back');

  const [ zoom, setZoom ] = useState<number | undefined>(device?.neutralZoom);
  const [ exposure, setExposure ] = useState<number>(0);
  const [ flash, setFlash ] = useState<'off' | 'on'>('off');
  const [ torch, setTorch ] = useState<'off' | 'on'>('off');

  if (redirectToPermissions) return <Redirect href={'/permissions'} />;

  if (!device) return <></>;

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Camera view */}
        <View style={{ flex: 2, borderRadius: 10, overflow: 'hidden' }}>
          <Camera
            style={{ flex: 1 }}
            device={device}
            isActive
            resizeMode='cover'
            exposure={exposure}
            torch={torch}
            zoom={zoom}
          />
        </View>

        {/* Camera Controls */}
        <View style={{ flex: 1 }}>
          {/* Top section */}
          <View style={{ flex: 0.7 }}>
            <ThemedText>Max FPS: {device.formats[0].maxFps}</ThemedText>
            <ThemedText>Width: {device.formats[0].photoWidth} Height: {device.formats[0].photoHeight}</ThemedText>
            <ThemedText>Camera: {device.name}</ThemedText>
          </View>
          
          {/* Bottom section */}
          <View style={{ flex: 0.7 }}>
            <OscuroButton
              iconName='flashlight'
              onPress={() => {}}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
