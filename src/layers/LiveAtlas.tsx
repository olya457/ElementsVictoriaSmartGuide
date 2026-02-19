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
  Platform,
  Animated,
  Easing,
  Modal,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootRouteRegistry } from '../routes/RouteRegistry';

import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { routeCategories, getPlaces } from '../hiddenRoutesData';
import { placeImages } from '../placesImages';

type Props = NativeStackScreenProps<RootRouteRegistry, 'LiveAtlas'>;

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

function safeNum(v: any, fallback: number) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function extractLatLng(p: any): { latitude: number; longitude: number } | null {
  if (!p) return null;
  const lat1 = p.latitude ?? p.lat;
  const lng1 = p.longitude ?? p.lng ?? p.lon;
  if (lat1 != null && lng1 != null) {
    const latitude = safeNum(lat1, NaN);
    const longitude = safeNum(lng1, NaN);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { latitude, longitude };
  }
  const c = p.coords ?? p.coordinate ?? p.coordinates;
  if (c && typeof c === 'object') {
    const lat2 = c.latitude ?? c.lat;
    const lng2 = c.longitude ?? c.lng ?? c.lon;
    const latitude = safeNum(lat2, NaN);
    const longitude = safeNum(lng2, NaN);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { latitude, longitude };
  }
  const s: string | undefined = p.coordsText ?? p.coordinatesText ?? p.coordText ?? p.coordinates;
  if (typeof s === 'string') {
    const m = s.match(/(-?\d+(\.\d+)?)[^\d-]+(-?\d+(\.\d+)?)/);
    if (m) {
      const latitude = safeNum(m[1], NaN);
      const longitude = safeNum(m[3], NaN);
      if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { latitude, longitude };
    }
  }
  return null;
}

function getPlacesSafe(categoryId: string): any[] {
  try {
    const arr = (getPlaces as any)?.(categoryId);
    if (Array.isArray(arr)) return arr;
  } catch {}
  const cat: any = (routeCategories as any)?.find((c: any) => c.id === categoryId);
  const fromCat = cat?.places ?? cat?.items ?? cat?.data ?? [];
  return Array.isArray(fromCat) ? fromCat : [];
}

export default function LiveAtlas({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  const isTiny = height < 740 || width < 360;
  const isMini = height < 680 || width < 350;
  const isSE = height < 640 || width < 340;

  const sidePad = isSE ? 12 : isMini ? 14 : 18;
  const topPad = Platform.OS === 'ios' ? (isSE ? 6 : isTiny ? 8 : 14) : isSE ? 4 : isTiny ? 6 : 10;
  const androidHeaderOffset = Platform.OS === 'android' ? 50 : 0;

  const headerH = isSE ? 68 : isTiny ? 74 : 86;
  const badgeSize = isSE ? 46 : isTiny ? 52 : 58;

  const mapW = Math.min(width - sidePad * 2, 560);
  const mapH = isSE ? 360 : isTiny ? 420 : 470;

  const catH = isSE ? 46 : isTiny ? 52 : 56;
  const catFont = isSE ? 12 : isTiny ? 13 : 14;
  const catMinW = isSE ? 148 : isTiny ? 170 : 190;

  const modalW = Math.min(width - sidePad * 2, 520);
  const modalImgH = isSE ? 140 : isTiny ? 160 : 180;

  const mapRef = useRef<MapView | null>(null);

  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    a.setValue(0);
    Animated.timing(a, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [a]);

  const initialCategoryId = (routeCategories as any)?.[0]?.id ?? 'nature';
  const [categoryId, setCategoryId] = useState<string>(initialCategoryId);

  const categoryPlaces = useMemo(() => {
    const raw = getPlacesSafe(categoryId);
    const ten = (Array.isArray(raw) ? raw : []).slice(0, 10);
    return ten.map((p: any, idx: number) => {
      const ll = extractLatLng(p);
      if (!ll) return null;
      return {
        ...p,
        categoryId: p.categoryId ?? categoryId,
        id: p.id ?? `${categoryId}-${idx}`,
        title: p.title ?? p.name ?? 'Place',
        short: p.short ?? p.subtitle ?? p.descriptionShort ?? '',
        coordsText: p.coordsText ?? p.coordinatesText ?? `${ll.latitude.toFixed(4)}, ${ll.longitude.toFixed(4)}`,
        imageKey: p.imageKey ?? p.image ?? p.imageName ?? '',
        latitude: ll.latitude,
        longitude: ll.longitude,
      };
    }).filter(Boolean) as any[];
  }, [categoryId]);

  const initialRegion = useMemo<Region>(() => {
    const first = categoryPlaces?.[0];
    const lat = safeNum(first?.latitude, 48.4284);
    const lon = safeNum(first?.longitude, -123.3656);
    return { latitude: lat, longitude: lon, latitudeDelta: 0.085, longitudeDelta: 0.085 };
  }, [categoryPlaces]);

  const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);
  useEffect(() => {
    setCurrentRegion(initialRegion);
  }, [initialRegion.latitude, initialRegion.longitude]);

  const onRegionChangeComplete = (r: Region) => setCurrentRegion(r);

  useEffect(() => {
    if (!mapRef.current || !categoryPlaces.length) return;
    const coords = categoryPlaces.map((p: any) => ({ latitude: p.latitude, longitude: p.longitude }));
    const t = setTimeout(() => {
      try {
        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: isSE ? 60 : 70, right: 60, bottom: isSE ? 90 : 100, left: 60 },
          animated: true,
        });
      } catch {
        mapRef.current?.animateToRegion(initialRegion, 320);
      }
    }, 80);
    return () => clearTimeout(t);
  }, [categoryId, categoryPlaces.length, isSE, initialRegion]);

  const zoomIn = () => {
    const next: Region = { ...currentRegion, latitudeDelta: Math.max(0.003, currentRegion.latitudeDelta * 0.6), longitudeDelta: Math.max(0.003, currentRegion.longitudeDelta * 0.6) };
    setCurrentRegion(next);
    mapRef.current?.animateToRegion(next, 220);
  };

  const zoomOut = () => {
    const next: Region = { ...currentRegion, latitudeDelta: Math.min(2.0, currentRegion.latitudeDelta * 1.6), longitudeDelta: Math.min(2.0, currentRegion.longitudeDelta * 1.6) };
    setCurrentRegion(next);
    mapRef.current?.animateToRegion(next, 220);
  };

  const centerToCategory = () => {
    if (!categoryPlaces.length) {
      mapRef.current?.animateToRegion(initialRegion, 320);
      return;
    }
    const coords = categoryPlaces.map((p: any) => ({ latitude: p.latitude, longitude: p.longitude }));
    mapRef.current?.fitToCoordinates(coords, { edgePadding: { top: isSE ? 60 : 70, right: 60, bottom: isSE ? 90 : 100, left: 60 }, animated: true });
  };

  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const items = await loadSaved();
      const map: Record<string, boolean> = {};
      for (const it of items) map[it.id] = true;
      if (alive) setSavedIds(map);
    })();
    return () => { alive = false; };
  }, []);

  const imgFor = (p: any) => p ? (placeImages as any)?.[p.imageKey] ?? FALLBACK_IMG : FALLBACK_IMG;

  const toggleSave = async (place: any) => {
    if (!place) return;
    const items = await loadSaved();
    const exists = items.some((x) => x.id === place.id);
    if (exists) {
      const next = items.filter((x) => x.id !== place.id);
      await saveSaved(next);
      setSavedIds((m) => { const n = { ...m }; delete n[place.id]; return n; });
    } else {
      const newItem: SavedPlace = { id: place.id, categoryId: place.categoryId, title: place.title, coordsText: place.coordsText, short: place.short ?? '', latitude: safeNum(place.latitude, 48.4284), longitude: safeNum(place.longitude, -123.3656), imageKey: place.imageKey ?? '', savedAt: Date.now() };
      const next = [newItem, ...items];
      await saveSaved(next);
      setSavedIds((m) => ({ ...m, [place.id]: true }));
    }
  };

  const openMarkerPopup = (p: any) => { setSelectedPlace(p); setPopupOpen(true); };
  const closePopup = () => { setPopupOpen(false); setTimeout(() => setSelectedPlace(null), 120); };
  const openDetail = () => { if (!selectedPlace) return; closePopup(); navigation.navigate('HiddenRouteDetail', { categoryId: selectedPlace.categoryId, placeId: selectedPlace.id }); };
  const pickCategory = (id: string) => { closePopup(); setCategoryId(id); };

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <View style={[styles.wrap, { paddingTop: topPad, paddingHorizontal: sidePad }]}>
            <Animated.View style={{ opacity: a, marginTop: androidHeaderOffset }}>
              <View style={[styles.header, { height: headerH }]}>
                <View style={styles.headerGlowA} />
                <View style={styles.headerGlowB} />
                <Pressable onPress={() => navigation.navigate('CrossroadsHub')} style={styles.menuBtn}>
                  <Text style={[styles.menuIcon, { fontSize: isSE ? 24 : 26 }]}>≡</Text>
                </Pressable>
                <Text style={[styles.headerTitle, { fontSize: isSE ? 18 : isTiny ? 19 : 20 }]}>Interactive map</Text>
                <View style={[styles.badgeWrap, { width: badgeSize, height: badgeSize }]}>
                  <Image source={HEADER_BADGE} style={styles.badgeImg} resizeMode="cover" />
                </View>
              </View>
            </Animated.View>

            <View style={{ height: isSE ? 10 : isTiny ? 12 : 14 }} />

            <Animated.View style={{ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 2, gap: 12 }}>
                {(routeCategories as any).map((c: any) => (
                  <Pressable key={c.id} onPress={() => pickCategory(c.id)} style={({ pressed }) => [styles.catChip, { height: catH, minWidth: catMinW, borderRadius: 20, opacity: pressed ? 0.96 : 1 }, c.id === categoryId && styles.catChipActive]}>
                    <View style={styles.chipGlowA} /><View style={styles.chipGlowB} />
                    <Text style={[styles.catTxt, { fontSize: catFont }]} numberOfLines={1}>{c.icon ? `${c.icon} ` : ''}{c.title ?? 'Category'}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </Animated.View>

            <View style={{ height: isSE ? 10 : 12 }} />

            <Animated.View style={{ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }], flex: 1 }}>
              <View style={[styles.mapFrame, { width: mapW, height: mapH }]}>
                <MapView ref={mapRef} style={StyleSheet.absoluteFill} provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} initialRegion={initialRegion} onRegionChangeComplete={onRegionChangeComplete}>
                  {categoryPlaces.map((p: any) => (
                    <Marker key={`${p.categoryId}-${p.id}`} coordinate={{ latitude: p.latitude, longitude: p.longitude }} pinColor="#ff2d2d" onPress={() => setTimeout(() => openMarkerPopup(p), 0)} />
                  ))}
                </MapView>
                <View style={styles.mapShade} pointerEvents="none" />
                <View style={[styles.controls, { right: isSE ? 10 : 12, top: isSE ? 10 : 12 }]} pointerEvents="box-none">
                  <Pressable onPress={zoomIn} style={({ pressed }) => [styles.ctrlBtn, pressed && { opacity: 0.92 }]}><Text style={styles.ctrlTxt}>＋</Text></Pressable>
                  <View style={{ height: 10 }} />
                  <Pressable onPress={zoomOut} style={({ pressed }) => [styles.ctrlBtn, pressed && { opacity: 0.92 }]}><Text style={styles.ctrlTxt}>－</Text></Pressable>
                  <View style={{ height: 10 }} />
                  <Pressable onPress={centerToCategory} style={({ pressed }) => [styles.ctrlBtnWide, pressed && { opacity: 0.92 }]}><Text style={styles.ctrlTxtSmall}>Center</Text></Pressable>
                </View>
              </View>
              {categoryPlaces.length === 0 && (
                <View style={[styles.emptyHint, { width: mapW }]}>
                  <Text style={styles.emptyHintTxt}>No places found for this category.</Text>
                </View>
              )}
            </Animated.View>

            <Modal visible={popupOpen} transparent animationType="fade" onRequestClose={closePopup}>
              <View style={styles.modalWrap}>
                <Pressable style={StyleSheet.absoluteFill} onPress={closePopup} />
                <View style={[styles.centerCard, { width: modalW }]}>
                  <View style={styles.centerGlowA} /><View style={styles.centerGlowB} />
                  <View style={styles.centerTop}>
                    <Text style={[styles.centerTitle, { fontSize: isSE ? 14 : 15 }]} numberOfLines={1}>{selectedPlace?.title ?? 'Place'}</Text>
                    <Pressable onPress={closePopup} style={styles.centerX}><Text style={styles.centerXTxt}>×</Text></Pressable>
                  </View>
                  <View style={[styles.centerImgFrame, { height: modalImgH }]}>
                    <Image source={imgFor(selectedPlace)} style={styles.centerImg} resizeMode="cover" />
                  </View>
                  <Text style={[styles.centerCoords, { fontSize: isSE ? 10 : 11 }]} numberOfLines={1}>📍 {selectedPlace?.coordsText ?? ''}</Text>
                  {!!selectedPlace?.short && <Text style={[styles.centerShort, { fontSize: isSE ? 10 : 11, lineHeight: isSE ? 14 : 16 }]} numberOfLines={3}>{selectedPlace?.short}</Text>}
                  <View style={[styles.centerActions, { gap: isSE ? 10 : 12 }]}>
                    <Pressable onPress={() => toggleSave(selectedPlace)} style={[styles.centerIcon, savedIds[selectedPlace?.id] && styles.centerIconFav]}><Text style={styles.centerIconTxt}>{savedIds[selectedPlace?.id] ? '♥' : '♡'}</Text></Pressable>
                    <Pressable onPress={openDetail} style={styles.centerMore}><View style={styles.moreGlowA} /><View style={styles.moreGlowB} /><Text style={[styles.moreTxt, { fontSize: isSE ? 12 : 13 }]}>Open</Text></Pressable>
                  </View>
                </View>
              </View>
            </Modal>
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
  header: { width: '100%', borderRadius: 26, overflow: 'hidden', justifyContent: 'center', paddingLeft: 76, paddingRight: 86 },
  headerGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#8f1010', opacity: 0.92 },
  headerGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#5b0b0b', opacity: 0.42 },
  menuBtn: { position: 'absolute', left: 14, top: '50%', marginTop: -27, width: 54, height: 54, borderRadius: 16, backgroundColor: 'rgba(35,0,70,0.55)', alignItems: 'center', justifyContent: 'center' },
  menuIcon: { color: '#fff', fontWeight: '900' },
  headerTitle: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  badgeWrap: { position: 'absolute', right: 14, top: '50%', marginTop: -27, borderRadius: 16, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  badgeImg: { width: '100%', height: '100%' },
  catChip: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  catChipActive: { borderColor: 'rgba(255,255,255,0.24)' },
  chipGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#b01616', opacity: 0.9 },
  chipGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#3b0622', opacity: 0.45 },
  catTxt: { color: '#fff', fontWeight: '900' },
  mapFrame: { alignSelf: 'center', borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(176,22,22,0.60)', backgroundColor: 'rgba(0,0,0,0.35)' },
  mapShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.10)' },
  controls: { position: 'absolute', alignItems: 'center' },
  ctrlBtn: { width: 46, height: 46, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.45)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  ctrlBtnWide: { width: 78, height: 46, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.45)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  ctrlTxt: { color: '#fff', fontWeight: '900', fontSize: 22 },
  ctrlTxtSmall: { color: '#fff', fontWeight: '900', fontSize: 12 },
  emptyHint: { alignSelf: 'center', marginTop: 10, borderRadius: 16, padding: 12, backgroundColor: 'rgba(139,16,16,0.72)' },
  emptyHintTxt: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  centerCard: { borderRadius: 22, overflow: 'hidden', padding: 12 },
  centerGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(139,16,16,0.92)' },
  centerGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  centerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 },
  centerTitle: { color: '#fff', fontWeight: '900', flex: 1 },
  centerX: { width: 34, height: 34, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  centerXTxt: { color: '#fff', fontWeight: '900', fontSize: 18 },
  centerImgFrame: { borderRadius: 18, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)' },
  centerImg: { width: '100%', height: '100%' },
  centerCoords: { color: 'rgba(255,255,255,0.92)', fontWeight: '800', textAlign: 'center', marginTop: 10 },
  centerShort: { color: 'rgba(255,255,255,0.90)', marginTop: 8, textAlign: 'center' },
  centerActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  centerIcon: { width: 54, height: 44, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  centerIconFav: { backgroundColor: 'rgba(124,36,255,0.45)' },
  centerIconTxt: { color: '#fff', fontWeight: '900', fontSize: 18 },
  centerMore: { flex: 1, height: 44, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  moreGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#7c24ff', opacity: 0.92 },
  moreGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#3b0622', opacity: 0.22 },
  moreTxt: { color: '#fff', fontWeight: '900' },
});