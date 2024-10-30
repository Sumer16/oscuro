import { BlurView } from 'expo-blur';
import { Redirect, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

import React, { useRef, useState } from 'react';
import { StyleSheet, Platform, View, StatusBar, SafeAreaView, Linking, TouchableHighlight } from 'react-native';
import { Camera, useCameraDevice, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';

import { ThemedText } from '@/components/ThemedText';
import OscuroButton from '@/components/OscuroButton';

export default function HomeScreen() {
  const router  = useRouter();

  const { hasPermission } = useCameraPermission();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  const redirectToPermissions = !hasPermission || microphonePermission === 'not-determined';

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();

  const [ cameraPosition, setCameraPosition ] = useState<'front' | 'back'>('back');
  const device = useCameraDevice(cameraPosition);
  const [ showZoomControls, setShowZoomControls ] = useState<boolean>(false);
  const [ showExposureControls, setShowExposureControls ] = useState<boolean>(false);

  const [ zoom, setZoom ] = useState<number | undefined>(device?.neutralZoom);
  const [ exposure, setExposure ] = useState<number>(0);
  const [ flash, setFlash ] = useState<'off' | 'on'>('off');
  const [ torch, setTorch ] = useState<'off' | 'on'>('off');

  if (redirectToPermissions) return <Redirect href={'/permissions'} />;

  if (!device) return <></>;

  const takePicture = async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');
      console.log('Taking photo...');

      const photo = await camera.current.takePhoto({
        flash: flash,
        enableShutterSound: false,
      });
      router.push({
        pathname: '/media',
        params: { media: photo.path, type: 'photo' },
      });

      // const video = await camera.current.startRecording({
      //   onRecordingFinished: (video) => console.log(video),
      //   onRecordingError: (error) => console.error(error), 
      // });
    } catch (error) {
      console.error('Failed to take a photo!', error);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Camera view */}
        <View style={{ flex: 2, borderRadius: 10, overflow: 'hidden' }}>
          <Camera
            ref={camera}
            style={{ flex: 1 }}
            device={device}
            isActive
            resizeMode='cover'
            exposure={exposure}
            torch={torch}
            zoom={zoom}
            photo={true}
            video={true}
          />
          <BlurView
            intensity={100}
            tint='default'
            style={{
              flex: 1,
              position: 'absolute',
              bottom: 0,
              right: 0,
              padding: 10,
            }}
            experimentalBlurMethod='dimezisBlurView'
          >
            <ThemedText style={{ fontSize: 14, lineHeight: 22 }}>
              Exposure: {exposure} | Zoom: x{zoom}
            </ThemedText>
          </BlurView>
        </View>

        {/* Camera Controls */}
        <View style={{ flex: 1 }}>
          {/* Top section */}
          <View style={{ flex: 0.7 }}>
            <ThemedText>Max FPS: {device.formats[0].maxFps}</ThemedText>
            <ThemedText>Width: {device.formats[0].photoWidth} Height: {device.formats[0].photoHeight}</ThemedText>
            <ThemedText>Camera: {device.name}</ThemedText>
          </View>
          
          {/* Middle section */}
          <View style={{ flex: 0.7, flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <OscuroButton
              iconName={torch === 'on' ? 'flashlight' : 'flashlight-outline'}
              onPress={() => setTorch((t) => (t === 'off' ? 'on' : 'off'))}
              containerStyle={{ alignSelf: 'center' }}
            />
            <OscuroButton
              iconName={flash === 'on' ? 'flash-outline' : 'flash-off-outline'}
              onPress={() => setFlash((f) => (f === 'off' ? 'on' : 'off'))}
              containerStyle={{ alignSelf: 'center' }}
            />
            <OscuroButton
              iconName='camera-reverse-outline'
              onPress={() => setCameraPosition((p) => (p === 'back' ? 'front' : 'back'))}
              containerStyle={{ alignSelf: 'center' }}
            />
            <OscuroButton
              iconName='image-outline'
              onPress={() => {
                const link = Platform.select({
                  ios: 'photos-redirect://',
                  android: 'content://media/external/images/media',
                });
                Linking.openURL(link!);
              }}
              containerStyle={{ alignSelf: 'center' }}
            />
            <OscuroButton
              iconName='settings-outline'
              onPress={() => router.push('/_sitemap')}
              containerStyle={{ alignSelf: 'center' }}
            />
          </View>

          {/* Bottom section */}
          <View
            style={{
              flex: 1.1,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            <OscuroButton
              iconSize={40}
              title='+/-'
              onPress={() => setShowZoomControls((s) => !s)}
              containerStyle={{ alignSelf: 'center' }}
            />

            <TouchableHighlight onPress={takePicture}>
              <FontAwesome5 name='dot-circle' size={55} color={'white'} />
            </TouchableHighlight>

            <OscuroButton
              iconSize={40}
              title='1x'
              onPress={() => setShowExposureControls((s) => !s)}
              containerStyle={{ alignSelf: 'center' }}
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
