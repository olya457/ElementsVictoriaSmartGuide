import React, { useEffect, useMemo, useRef } from 'react';
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
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootRouteRegistry } from '../routes/RouteRegistry';

import { getCategory, getPlaces } from '../hiddenRoutesData';
import { placeImages } from '../placesImages';

type Props = NativeStackScreenProps<RootRouteRegistry, 'HiddenRoutesList'>;

const BG = require('../media/entry_p_bg.png');
const HEADER_BADGE = require('../media/entry_portal_logo.png');
const FALLBACK_IMG = require('../media/guide_frame_01.png');

export default function HiddenRoutesList({ navigation, route }: Props) {
  const { width, height } = useWindowDimensions();
  const isTiny = height < 720 || width < 360;

  const { categoryId } = route.params;
  const category = useMemo(() => getCategory(categoryId), [categoryId]);
  const items = useMemo(() => getPlaces(categoryId), [categoryId]);

  const a = useRef(new Animated.Value(0)).current;
  const pillPulse = useRef(new Animated.Value(0)).current;
  const listA = useRef(items.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    a.setValue(0);
    Animated.timing(a, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    pillPulse.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pillPulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pillPulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();

    listA.forEach(v => v.setValue(0));
    Animated.stagger(
      55,
      listA.map((v, i) =>
        Animated.timing(v, {
          toValue: 1,
          duration: 340,
          delay: i * 30,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    ).start();
  }, [categoryId, items.length]);

  const headerH = isTiny ? 76 : 86;
  const badgeSize = isTiny ? 54 : 58;
  const topPad = Platform.OS === 'ios' ? (isTiny ? 8 : 14) : (isTiny ? 6 : 10);
  const androidHeaderOffset = Platform.OS === 'android' ? 50 : 0;
  const headerMarginTop = 6 + androidHeaderOffset;
  const androidScrollPadding = Platform.OS === 'android' ? 68 : 18;

  const pillGlowOpacity = pillPulse.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.35] });
  const pillScale = pillPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] });

  const thumbSize = isTiny ? 86 : 92;
  const titleSize = isTiny ? 14 : 15;
  const coordSize = isTiny ? 11 : 12;
  const shortSize = isTiny ? 11 : 12;

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <View style={[styles.wrap, { paddingTop: topPad }]}>
        
            <Animated.View style={{ opacity: a }}>
              <View style={[styles.header, { height: headerH, marginTop: headerMarginTop }]}>
                <View style={styles.headerGlowA} />
                <View style={styles.headerGlowB} />

                <Pressable onPress={() => navigation.navigate('CrossroadsHub')} style={styles.menuBtn}>
                  <Text style={styles.menuIcon}>≡</Text>
                </Pressable>

                <Text style={[styles.headerTitle, { fontSize: isTiny ? 18 : 20 }]}>
                  Recommended{'\n'}places
                </Text>

                <View style={[styles.badgeWrap, { width: badgeSize, height: badgeSize }]}>
                  <Image source={HEADER_BADGE} style={styles.badgeImg} resizeMode="cover" />
                </View>
              </View>

              <View style={styles.pillRow}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backPill}>
                  <Text style={styles.backTxt}>←</Text>
                </Pressable>

                <Animated.View style={{ flex: 1, transform: [{ scale: pillScale }] }}>
                  <View style={styles.catPill}>
                    <Animated.View style={[styles.catGlow, { opacity: pillGlowOpacity }]} />
                    <Text style={[styles.catPillTxt, { fontSize: isTiny ? 12 : 13 }]} numberOfLines={1}>
                      {category?.title ?? 'Category'}
                    </Text>
                  </View>
                </Animated.View>
              </View>
            </Animated.View>

            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ paddingBottom: androidScrollPadding }}
            >
              {items.map((p, idx) => {
                const imgSrc = placeImages[p.imageKey] ?? FALLBACK_IMG;

                return (
                  <Animated.View
                    key={p.id}
                    style={{
                      opacity: listA[idx] ?? 1,
                      transform: [
                        {
                          translateY: (listA[idx] ?? a).interpolate({ inputRange: [0, 1], outputRange: [12, 0] }),
                        },
                      ],
                    }}
                  >
                    <Pressable
                      onPress={() => navigation.navigate('HiddenRouteDetail', { categoryId, placeId: p.id })}
                      style={({ pressed }) => [
                        styles.itemCard,
                        pressed && { opacity: 0.95, transform: [{ scale: 0.995 }] },
                      ]}
                    >
                      <View style={styles.itemBorder} />
                      <Image
                        source={imgSrc}
                        style={{ width: thumbSize, height: thumbSize, borderRadius: isTiny ? 13 : 14 }}
                        resizeMode="cover"
                      />

                      <View style={{ flex: 1, paddingLeft: 12 }}>
                        <Text style={[styles.itemTitle, { fontSize: titleSize }]} numberOfLines={1}>
                          {p.title}
                        </Text>
                        <Text style={[styles.coords, { fontSize: coordSize }]} numberOfLines={1}>
                          📍 {p.coordsText}
                        </Text>
                        <Text style={[styles.itemShort, { fontSize: shortSize }]} numberOfLines={2}>
                          {p.short}
                        </Text>
                        <View style={[styles.moreBtn, isTiny && { width: 110, height: 32, borderRadius: 11 }]}>
                          <Text style={[styles.moreText, isTiny && { fontSize: 12 }]}>More</Text>
                        </View>
                      </View>
                    </Pressable>
                  </Animated.View>
                );
              })}
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
  wrap: { flex: 1, paddingHorizontal: 18 },

  header: {
    width: '100%',
    borderRadius: 26,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingLeft: 76,
    paddingRight: 86,
  },
  headerGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#8f1010', opacity: 0.92 },
  headerGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#5b0b0b', opacity: 0.42 },

  menuBtn: {
    position: 'absolute',
    left: 14,
    top: '50%',
    marginTop: -27,
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(35,0,70,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: { color: '#fff', fontSize: 26, fontWeight: '900' },
  headerTitle: { color: '#fff', fontWeight: '900', textAlign: 'center', lineHeight: 20 },

  badgeWrap: {
    position: 'absolute',
    right: 14,
    top: '50%',
    marginTop: -27,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  badgeImg: { width: '100%', height: '100%' },

  pillRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, marginBottom: 10 },
  backPill: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#b01616',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backTxt: { color: '#fff', fontSize: 22, fontWeight: '900' },

  catPill: {
    height: 46,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: 'rgba(124,36,255,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  catGlow: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.25)' },
  catPillTxt: { color: '#fff', fontWeight: '900' },

  itemCard: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(139, 16, 16, 0.75)',
    flexDirection: 'row',
    padding: 12,
    marginTop: 12,
  },
  itemBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.25)',
  },

  itemTitle: { color: '#fff', fontWeight: '900' },
  coords: { color: 'rgba(255,255,255,0.92)', marginTop: 6, fontWeight: '800' },
  itemShort: { color: 'rgba(255,255,255,0.9)', marginTop: 6, lineHeight: 16 },

  moreBtn: {
    marginTop: 10,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(35,0,70,0.70)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  moreText: { color: '#fff', fontWeight: '900' },
});