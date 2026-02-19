import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Pressable,
  useWindowDimensions,
  Animated,
  Easing,
  Platform,
  Share,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootRouteRegistry } from '../routes/RouteRegistry';

import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getPlace } from '../hiddenRoutesData';
import { placeImages } from '../placesImages';

type Props = NativeStackScreenProps<RootRouteRegistry, 'HiddenRouteDetail'>;

const BG = require('../media/entry_p_bg.png');
const HEADER_BADGE = require('../media/entry_portal_logo.png');
const FALLBACK_IMG = require('../media/guide_frame_01.png');

const STORAGE_KEY = 'memory_shelf_places_v1';

type SavedPlace = {
  id: string;
  categoryId: string;
  title: string;
  coordsText: string;
  short: string;
  latitude: number;
  longitude: number;
  imageKey: string;
  savedAt: number;
};

async function loadSaved(): Promise<SavedPlace[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveSaved(items: SavedPlace[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export default function HiddenRouteDetail({ navigation, route }: Props) {
  const { width, height } = useWindowDimensions();

  const isMicro = height < 600; 
  const isMini = height < 680 || width < 350;

  const { categoryId, placeId } = route.params;
  const place = getPlace(categoryId, placeId);
  const imgSrc = place ? (placeImages[place.imageKey] ?? FALLBACK_IMG) : FALLBACK_IMG;

  const [saved, setSaved] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [a]);

  const headerH = isMicro ? 60 : isMini ? 70 : 86;
  const badgeSize = isMicro ? 44 : isMini ? 50 : 58;
  const topPad = Platform.OS === 'ios' ? (isMicro ? 4 : isMini ? 8 : 14) : (isMicro ? 2 : 6);
  const sidePad = isMicro ? 10 : isMini ? 14 : 18;
  const cardW = Math.min(width - sidePad * 2, 560);
  const heroH = isMicro ? 130 : isMini ? 160 : 200;
  const mapH = isMicro ? 140 : isMini ? 170 : 200;

  const actionSize = isMicro ? 40 : isMini ? 46 : 50;
  const actionR = isMicro ? 10 : 14;
  const gap = isMicro ? 6 : 10;

  const androidHeaderOffset = Platform.OS === 'android' ? 50 : 0;

  const region = useMemo<Region | null>(() => {
    if (!place) return null;
    return {
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  }, [place]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!place) return;
      const items = await loadSaved();
      const exists = items.some((x) => x.id === place.id);
      if (alive) setSaved(exists);
    })();
    return () => { alive = false; };
  }, [place?.id]);

  const onShare = async () => {
    if (!place) return;
    try {
      await Share.share({ message: `${place.title}\n${place.coordsText}\n\n${place.short}` });
    } catch {}
  };

  const toggleSave = async () => {
    if (!place) return;
    const items = await loadSaved();
    const exists = items.some((x) => x.id === place.id);
    if (exists) {
      const next = items.filter((x) => x.id !== place.id);
      await saveSaved(next);
      setSaved(false);
      return;
    }
    const newItem: SavedPlace = {
      id: place.id,
      categoryId: place.categoryId,
      title: place.title,
      coordsText: place.coordsText,
      short: place.short,
      latitude: place.latitude,
      longitude: place.longitude,
      imageKey: place.imageKey,
      savedAt: Date.now(),
    };
    await saveSaved([newItem, ...items]);
    setSaved(true);
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <View style={[styles.wrap, { paddingTop: topPad, paddingHorizontal: sidePad }]}>
            
            <Animated.View style={{ opacity: a }}>
              <View style={[styles.header, { height: headerH, marginTop: androidHeaderOffset }]}>
                <View style={styles.headerGlowA} />
                <View style={styles.headerGlowB} />
                <Pressable onPress={() => navigation.navigate('CrossroadsHub')} style={[styles.menuBtn, { width: badgeSize, height: badgeSize, borderRadius: actionR }]}>
                  <Text style={[styles.menuIcon, { fontSize: isMicro ? 20 : 26 }]}>≡</Text>
                </Pressable>
                <Text style={[styles.headerTitle, { fontSize: isMicro ? 14 : isMini ? 16 : 20, lineHeight: isMicro ? 16 : 20 }]}>
                  Recommended{'\n'}places
                </Text>
                <View style={[styles.badgeWrap, { width: badgeSize, height: badgeSize, borderRadius: actionR }]}>
                  <Image source={HEADER_BADGE} style={styles.badgeImg} resizeMode="cover" />
                </View>
              </View>
            </Animated.View>

            <Animated.View style={{ opacity: a, flex: 1, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }] }}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 25 }}>
                
                <View style={[styles.heroFrame, { width: cardW, height: heroH, marginTop: isMicro ? 10 : 18 }]}>
                  <Image source={imgSrc} style={styles.heroImg} resizeMode="cover" />
                </View>

    
                <View style={[styles.redCard, { width: cardW, padding: isMicro ? 10 : 16 }]}>
                  <Text style={[styles.placeTitle, { fontSize: isMicro ? 18 : isMini ? 22 : 26 }]} numberOfLines={2}>
                    {place?.title ?? 'Place'}
                  </Text>
                  <Text style={[styles.coords, { fontSize: isMicro ? 10 : 12 }]} numberOfLines={1}>
                    📍 {place?.coordsText ?? ''}
                  </Text>

                  {showMap && !!region ? (
                    <View style={[styles.inlineMapFrame, { height: mapH, marginTop: 10 }]}>
                      <MapView
                        style={StyleSheet.absoluteFill}
                        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                        initialRegion={region}
                      >
                        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title={place?.title} />
                      </MapView>
                    </View>
                  ) : (
                    <>
                      <Text style={[styles.longText, { fontSize: isMicro ? 11 : 13, lineHeight: isMicro ? 15 : 18 }]}>
                        {place?.long ?? ''}
                      </Text>

                      {!!place?.facts?.length && (
                        <View style={{ marginTop: 10 }}>
                          <Text style={[styles.factsTitle, { fontSize: isMicro ? 12 : 14 }]}>Interesting facts</Text>
                          {place.facts.map((f, idx) => (
                            <Text key={idx} style={[styles.factLine, { fontSize: isMicro ? 10 : 12 }]}>• {f}</Text>
                          ))}
                        </View>
                      )}
                    </>
                  )}
                </View>

                <View style={[styles.actionsWrap, { width: cardW, gap }]}>
                  <Pressable onPress={() => navigation.goBack()} style={[styles.iconBtn, { width: actionSize, height: actionSize, borderRadius: actionR }]}>
                    <Text style={[styles.iconTxt, { fontSize: isMicro ? 16 : 20 }]}>←</Text>
                  </Pressable>

                  <Pressable onPress={() => setShowMap(!showMap)} style={[styles.mapBtn, { height: actionSize, borderRadius: actionR, flex: 1 }]}>
                    <Text style={[styles.mapTxt, { fontSize: isMicro ? 16 : 18 }]}>{showMap ? 'Close' : 'Map'}</Text>
                  </Pressable>

                  <Pressable onPress={toggleSave} style={[styles.iconBtn, { width: actionSize, height: actionSize, borderRadius: actionR }, saved && styles.iconBtnSaved]}>
                    <Text style={[styles.iconTxt, { fontSize: isMicro ? 16 : 20 }]}>{saved ? '★' : '☆'}</Text>
                  </Pressable>

                  <Pressable onPress={onShare} style={[styles.iconBtn, { width: actionSize, height: actionSize, borderRadius: actionR }]}>
                    <Text style={[styles.iconTxt, { fontSize: isMicro ? 16 : 20 }]}>⤴︎</Text>
                  </Pressable>
                </View>

              </ScrollView>
            </Animated.View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { flex: 1 },
  safe: { flex: 1 },
  wrap: { flex: 1 },
  header: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
  headerGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#8f1010', opacity: 0.9 },
  headerGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#5b0b0b', opacity: 0.4 },
  menuBtn: {
    position: 'absolute',
    left: 10,
    backgroundColor: 'rgba(35,0,70,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: { color: '#fff', fontWeight: '900' },
  headerTitle: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  badgeWrap: {
    position: 'absolute',
    right: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  badgeImg: { width: '100%', height: '100%' },
  heroFrame: {
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'rgba(176,22,22,0.4)',
  },
  heroImg: { width: '100%', height: '100%' },
  redCard: {
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(139,16,16,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  placeTitle: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  coords: { color: '#ffaaaa', marginTop: 4, fontWeight: '800', textAlign: 'center' },
  longText: { color: '#eee', marginTop: 10, textAlign: 'center' },
  factsTitle: { color: '#fff', fontWeight: '900', textAlign: 'center', marginBottom: 6 },
  factLine: { color: '#ddd', marginBottom: 2 },
  inlineMapFrame: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(176,22,22,0.5)',
  },
  actionsWrap: {
    alignSelf: 'center',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: { backgroundColor: '#b01616', alignItems: 'center', justifyContent: 'center' },
  iconBtnSaved: { backgroundColor: '#7c24ff' },
  iconTxt: { color: '#fff', fontWeight: '900' },
  mapBtn: { backgroundColor: '#7c24ff', alignItems: 'center', justifyContent: 'center' },
  mapTxt: { color: '#fff', fontWeight: '900' },
});