import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootRouteRegistry } from '../routes/RouteRegistry';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { placeImages } from '../placesImages';
import { routeCategories } from '../hiddenRoutesData';

const BG = require('../media/entry_p_bg.png');
const HEADER_BADGE = require('../media/entry_portal_logo.png');
const GUIDE = require('../media/guide_frame_01.png');
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

type Props = NativeStackScreenProps<RootRouteRegistry, 'MemoryShelf'>;

export default function MemoryShelf({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  const isTiny = height < 740 || width < 360;
  const isMini = height < 680 || width < 350;
  const isSE = height < 640 || width < 340;

  const sidePad = isSE ? 12 : isMini ? 14 : 18;
  const topPad = Platform.OS === 'ios' ? (isSE ? 6 : isTiny ? 8 : 14) : (isSE ? 4 : isTiny ? 6 : 10);

  const androidHeaderOffset = Platform.OS === 'android' ? 50 : 0;
  const androidScrollBottom = Platform.OS === 'android' ? 70 : 20;

  const headerH = isSE ? 70 : isTiny ? 76 : 86;
  const badgeSize = isSE ? 50 : isTiny ? 54 : 58;
  const cardW = Math.min(width - sidePad * 2, 560);

  const [items, setItems] = useState<SavedPlace[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('__all__');

  const refresh = async () => {
    const data = await loadSaved();
    data.sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
    setItems(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const categoriesInSaved = useMemo(() => {
    const set = new Set(items.map((x) => x.categoryId));
    return routeCategories.filter((c) => set.has(c.id));
  }, [items]);

  const activeCat = useMemo(() => {
    if (activeCategoryId === '__all__') return null;
    return routeCategories.find((c) => c.id === activeCategoryId) ?? null;
  }, [activeCategoryId]);

  const filtered = useMemo(() => {
    if (activeCategoryId === '__all__') return items;
    return items.filter((x) => x.categoryId === activeCategoryId);
  }, [items, activeCategoryId]);

  const onRemove = async (id: string) => {
    const next = items.filter((x) => x.id !== id);
    setItems(next);
    await saveSaved(next);
  };

  const onToggleCategory = () => {
    const list = categoriesInSaved;
    if (list.length === 0) {
      setActiveCategoryId('__all__');
      return;
    }
    if (activeCategoryId === '__all__') {
      setActiveCategoryId(list[0].id);
      return;
    }
    const idx = list.findIndex((c) => c.id === activeCategoryId);
    const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1].id : '__all__';
    setActiveCategoryId(next);
  };

  const titleSize = isSE ? 14 : isTiny ? 15 : 16;
  const thumbW = isSE ? 96 : isMini ? 104 : 118;
  const thumbH = isSE ? 70 : isMini ? 74 : 82;
  const filterH = isSE ? 38 : isMini ? 40 : 44;

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <View style={[styles.wrap, { paddingTop: topPad, paddingHorizontal: sidePad }]}>
            
            <View style={[styles.header, { height: headerH, marginTop: androidHeaderOffset + 6 }]}>
              <View style={styles.headerGlowA} />
              <View style={styles.headerGlowB} />

              <View style={styles.headerInner}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  style={styles.menuBtn}
                >
                  <Text style={styles.menuIcon}>≡</Text>
                </Pressable>

                <Text style={[styles.headerTitle, { fontSize: isSE ? 18 : 20 }]}>Saved places</Text>

                <View style={[styles.badgeWrap, { width: badgeSize, height: badgeSize }]}>
                  <Image source={HEADER_BADGE} style={styles.badgeImg} resizeMode="cover" />
                </View>
              </View>
            </View>

            <View style={{ height: 14 }} />

            <View style={[styles.filterRow, { width: cardW, gap: 10 }]}>
              <Pressable onPress={onToggleCategory} style={[styles.filterPill, { height: filterH, borderRadius: 14, flex: 1 }]}>
                <View style={styles.filterGlowA} /><View style={styles.filterGlowB} />
                <Text style={styles.filterTxt} numberOfLines={1}>
                  {activeCat ? `${activeCat.icon} ${activeCat.title}` : 'All saved'}
                </Text>
              </Pressable>
              <Pressable onPress={onToggleCategory} style={[styles.filterArrow, { width: filterH, height: filterH, borderRadius: 14 }]}>
                <Text style={styles.arrowTxt}>›</Text>
              </Pressable>
            </View>

            <View style={{ height: 12 }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: androidScrollBottom }}>
              {filtered.length === 0 ? (
                <View style={[styles.emptyCard, { width: cardW, borderRadius: 22, padding: 20 }]}>
                  <View style={styles.emptyCardGlowA} /><View style={styles.emptyCardGlowB} />
                  <Image source={GUIDE} style={{ alignSelf: 'center', width: 110, height: 150 }} resizeMode="contain" />
                  <Text style={styles.emptyText}>
                    Oops.. You have no saves in this category. I suggest you go back to "Recommended places".
                  </Text>
                  <Pressable onPress={() => navigation.navigate('HiddenRoutes')} style={styles.goBtn}>
                    <View style={styles.goGlowA} /><View style={styles.goGlowB} />
                    <Text style={styles.goTxt}>Go to recommended places</Text>
                  </Pressable>
                </View>
              ) : (
                filtered.map((p) => (
                  <View key={p.id} style={[styles.itemCard, { width: cardW, borderRadius: 22, padding: 10, marginTop: 12 }]}>
                    <View style={styles.itemCardGlowA} /><View style={styles.itemCardGlowB} />
                    <View style={styles.itemRow}>
                      <Image source={placeImages[p.imageKey] ?? FALLBACK_IMG} style={[styles.thumb, { width: thumbW, height: thumbH, borderRadius: 16 }]} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.itemTitle, { fontSize: titleSize }]} numberOfLines={1}>{p.title}</Text>
                        <Text style={styles.itemCoords}>📍 {p.coordsText}</Text>
                        <View style={styles.itemBottomRow}>
                          <Pressable onPress={() => navigation.navigate('HiddenRouteDetail', { categoryId: p.categoryId, placeId: p.id })} style={styles.moreBtn}>
                            <View style={styles.moreGlowA} /><View style={styles.moreGlowB} />
                            <Text style={styles.moreTxt}>More</Text>
                          </Pressable>
                        </View>
                      </View>
                      <Pressable onPress={() => onRemove(p.id)} style={styles.removeBtn}>
                        <Text style={styles.removeTxt}>×</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
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
  header: { width: '100%', borderRadius: 26, overflow: 'hidden' },
  headerInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14 },
  headerGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#8f1010', opacity: 0.92 },
  headerGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#5b0b0b', opacity: 0.42 },
  menuBtn: { width: 54, height: 54, borderRadius: 16, backgroundColor: 'rgba(35,0,70,0.55)', alignItems: 'center', justifyContent: 'center' },
  menuIcon: { color: '#fff', fontWeight: '900', fontSize: 26 },
  headerTitle: { color: '#fff', fontWeight: '900', textAlign: 'center', flex: 1 },
  badgeWrap: { overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 16 },
  badgeImg: { width: '100%', height: '100%' },
  filterRow: { alignSelf: 'center', flexDirection: 'row' },
  filterPill: { overflow: 'hidden', justifyContent: 'center', paddingHorizontal: 16 },
  filterGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#b01616', opacity: 0.86 },
  filterGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#3b0622', opacity: 0.45 },
  filterTxt: { color: '#fff', fontWeight: '900' },
  filterArrow: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: '#b01616' },
  arrowTxt: { color: '#fff', fontWeight: '900', fontSize: 20 },
  emptyCard: { alignSelf: 'center', overflow: 'hidden' },
  emptyCardGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(139,16,16,0.86)' },
  emptyCardGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  emptyText: { color: '#fff', textAlign: 'center', fontWeight: '700', marginTop: 10 },
  goBtn: { marginTop: 15, height: 48, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  goGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#b01616', opacity: 0.9 },
  goGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#3b0622', opacity: 0.45 },
  goTxt: { color: '#fff', fontWeight: '900' },
  itemCard: { alignSelf: 'center', overflow: 'hidden' },
  itemCardGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(139,16,16,0.86)' },
  itemCardGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.14)' },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  thumb: { backgroundColor: 'rgba(0,0,0,0.25)' },
  itemTitle: { color: '#fff', fontWeight: '900' },
  itemCoords: { color: 'rgba(255,255,255,0.8)', marginTop: 4, fontSize: 11 },
  itemBottomRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end' },
  moreBtn: { height: 32, borderRadius: 12, overflow: 'hidden', paddingHorizontal: 15, justifyContent: 'center' },
  moreGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#7c24ff', opacity: 0.92 },
  moreGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#3b0622', opacity: 0.22 },
  moreTxt: { color: '#fff', fontWeight: '900', fontSize: 12 },
  removeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  removeTxt: { color: '#fff', fontSize: 20, fontWeight: '900' },
});