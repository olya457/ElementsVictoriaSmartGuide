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
  ScrollView,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootRouteRegistry } from '../routes/RouteRegistry';

type Props = NativeStackScreenProps<RootRouteRegistry, 'JourneyNotes'>;

const BG = require('../media/entry_p_bg.png');
const HEADER_BADGE = require('../media/entry_portal_logo.png');

const BLOG_IMAGES: Record<string, any> = {
  harbor_walk: require('../media/blog_harbor_walk.png'),
  butchart_gardens: require('../media/blog_butchart_gardens.png'),
  beacon_hill: require('../media/blog_beacon_hill.png'),
  whale_watching: require('../media/blog_whale_watching.png'),
  chinatown_walk: require('../media/blog_chinatown_walk.png'),
  local_food: require('../media/blog_local_food.png'),
  coastal_drive: require('../media/blog_coastal_drive.png'),
};

type BlogPost = {
  id: string;
  title: string;
  body: string;
  imageKey: keyof typeof BLOG_IMAGES;
};

const POSTS: BlogPost[] = [
  { id: 'harbor-walk', title: 'Harbor Walk Highlights', imageKey: 'harbor_walk', body: "Victoria's Inner Harbor is the heart of the city. Here you'll find street performers, historic architecture, and waterfront views all in one place." },
  { id: 'butchart-gardens', title: 'Butchart Gardens Experience', imageKey: 'butchart_gardens', body: 'The Butchart Gardens are one of the most famous attractions in British Columbia. Open year-round, the gardens offer different seasonal displays.' },
  { id: 'beacon-hill-park', title: 'Discover Beacon Hill Park', imageKey: 'beacon_hill', body: "Beacon Hill Park is a peaceful green space near downtown. You can walk scenic trails, visit small ponds, and enjoy coastal views." },
  { id: 'whale-watching', title: 'Whale Watching Adventure', imageKey: 'whale_watching', body: 'Victoria is one of the best places in Canada for whale watching. Tours depart from the Inner Harbor and take you into the Salish Sea.' },
  { id: 'chinatown', title: 'Historic Chinatown Walk', imageKey: 'chinatown_walk', body: "Victoria's Chinatown is the oldest in Canada. Narrow Fan Tan Alley is one of the most photographed streets in the city." },
  { id: 'local-food', title: 'Local Food & Seafood', imageKey: 'local_food', body: 'Victoria is known for fresh seafood. Try Pacific salmon, halibut, or local oysters in waterfront restaurants.' },
  { id: 'coastal-drive', title: 'Coastal Drive Views', imageKey: 'coastal_drive', body: 'Drive or cycle along Dallas Road for stunning ocean views. On clear days, you can even see the Olympic Mountains.' },
];

const FAVORITES_KEY = 'journey_notes_favorites_v1';

async function loadFavs(): Promise<Record<string, number>> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch { return {}; }
}

async function saveFavs(map: Record<string, number>) {
  try { await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(map)); } catch {}
}

export default function JourneyNotes({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isTiny = height < 740 || width < 360;
  const isMini = height < 680 || width < 350;
  const isSE = height < 640 || width < 340;

  const sidePad = isSE ? 12 : isMini ? 14 : 18;
  const headerH = isSE ? 70 : isTiny ? 76 : 86;
  const badgeSize = isSE ? 50 : isTiny ? 54 : 58;
  const topPad = Platform.OS === 'ios' ? (isSE ? 6 : isTiny ? 8 : 14) : (isSE ? 4 : isTiny ? 6 : 10);

  const androidHeaderOffset = Platform.OS === 'android' ? 50 : 0;
  const androidScrollBottom = Platform.OS === 'android' ? 123 : 23;

  const cardW = Math.min(width - sidePad * 2, 560);
  const thumbW = isSE ? 104 : isMini ? 110 : 118;
  const thumbH = isSE ? 66 : isMini ? 70 : 76;

  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [a]);

  const [openId, setOpenId] = useState<string | null>(null);
  const [favMap, setFavMap] = useState<Record<string, number>>({});

  useEffect(() => {
    loadFavs().then(setFavMap);
  }, []);

  const openPost = useMemo(() => POSTS.find((p) => p.id === openId) ?? null, [openId]);
  const isFav = (id: string) => typeof favMap[id] === 'number';

  const sortedPosts = useMemo(() => {
    const arr = [...POSTS];
    arr.sort((a, b) => {
      const fa = typeof favMap[a.id] === 'number';
      const fb = typeof favMap[b.id] === 'number';
      if (fa === fb) return 0;
      return fa ? -1 : 1;
    });
    return arr;
  }, [favMap]);

  const toggleFav = async (id: string) => {
    const next = { ...favMap };
    if (isFav(id)) delete next[id]; else next[id] = Date.now();
    setFavMap(next);
    await saveFavs(next);
  };

  const onShare = async (post: BlogPost) => {
    try { await Share.share({ message: `${post.title}\n\n${post.body}` }); } catch {}
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <View style={[styles.wrap, { paddingTop: topPad, paddingHorizontal: sidePad }]}>
            
            <Animated.View style={{ opacity: a }}>
              <View style={[styles.header, { height: headerH, marginTop: androidHeaderOffset + 6 }]}>
                <View style={styles.headerGlowA} />
                <View style={styles.headerGlowB} />
                <View style={styles.headerInner}>
                  <Pressable onPress={() => navigation.goBack()} style={styles.menuBtn}>
                    <Text style={[styles.menuIcon, { fontSize: isSE ? 24 : 26 }]}>≡</Text>
                  </Pressable>
                  <Text style={[styles.headerTitle, { fontSize: isSE ? 18 : isTiny ? 19 : 20 }]}>Travel blog</Text>
                  <View style={[styles.badgeWrap, { width: badgeSize, height: badgeSize, borderRadius: isSE ? 14 : 16 }]}>
                    <Image source={HEADER_BADGE} style={styles.badgeImg} resizeMode="cover" />
                  </View>
                </View>
              </View>
            </Animated.View>

            <View style={{ height: 12 }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: androidScrollBottom }}>
              {!openPost ? (
                sortedPosts.map((p) => (
                  <View key={p.id} style={[styles.itemCard, { width: cardW }]}>
                    <View style={styles.itemGlowA} />
                    <View style={styles.itemGlowB} />
                    <View style={[styles.itemRow, { gap: isSE ? 10 : 12 }]}>
                      <Image source={BLOG_IMAGES[p.imageKey]} style={[styles.thumb, { width: thumbW, height: thumbH, borderRadius: 16 }]} resizeMode="cover" />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.itemTitle, { fontSize: isSE ? 12 : isMini ? 13 : 14 }]} numberOfLines={1}>{p.title}</Text>
                        <Text style={[styles.itemShort, { fontSize: isSE ? 9 : isMini ? 10 : 11 }]} numberOfLines={2}>{p.body}</Text>
                        <Pressable onPress={() => setOpenId(p.id)} style={styles.moreBtn}>
                          <View style={styles.moreGlowA} />
                          <View style={styles.moreGlowB} />
                          <Text style={styles.moreTxt}>More</Text>
                        </Pressable>
                      </View>
                      <Pressable onPress={() => toggleFav(p.id)} style={[styles.heartBtn, isFav(p.id) && styles.heartBtnFav]}>
                        <Text style={styles.heartTxt}>{isFav(p.id) ? '♥' : '♡'}</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              ) : (
                <View>
                  <View style={[styles.heroFrame, { width: cardW, height: isSE ? 180 : 220 }]}>
                    <Image source={BLOG_IMAGES[openPost.imageKey]} style={styles.heroImg} resizeMode="cover" />
                  </View>
                  <View style={[styles.detailCard, { width: cardW }]}>
                    <Text style={styles.detailTitle}>{openPost.title}</Text>
                    <Text style={styles.detailBody}>{openPost.body}</Text>
                  </View>
                  <View style={[styles.detailActions, { width: cardW, gap: 12 }]}>
                    <Pressable onPress={() => setOpenId(null)} style={styles.actionIcon}><Text style={styles.actionIconTxt}>←</Text></Pressable>
                    <Pressable onPress={() => onShare(openPost)} style={styles.shareBtn}>
                       <View style={styles.shareGlowA} />
                       <View style={styles.shareGlowB} />
                       <Text style={styles.shareTxt}>Share</Text>
                    </Pressable>
                    <Pressable onPress={() => toggleFav(openPost.id)} style={[styles.actionIcon, isFav(openPost.id) && styles.actionIconFav]}><Text style={styles.actionIconTxt}>{isFav(openPost.id) ? '♥' : '♡'}</Text></Pressable>
                  </View>
                </View>
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
  menuIcon: { color: '#fff', fontWeight: '900' },
  headerTitle: { color: '#fff', fontWeight: '900', textAlign: 'center', flex: 1 },
  badgeWrap: { overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  badgeImg: { width: '100%', height: '100%' },
  itemCard: { alignSelf: 'center', borderRadius: 22, overflow: 'hidden', padding: 10, marginTop: 12 },
  itemGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(139,16,16,0.86)' },
  itemGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.14)' },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  thumb: { backgroundColor: 'rgba(0,0,0,0.25)' },
  itemTitle: { color: '#fff', fontWeight: '900' },
  itemShort: { color: 'rgba(255,255,255,0.88)', marginTop: 6 },
  moreBtn: { alignSelf: 'flex-start', overflow: 'hidden', paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', marginTop: 10, height: 34, borderRadius: 14 },
  moreGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#7c24ff', opacity: 0.92 },
  moreGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#3b0622', opacity: 0.22 },
  moreTxt: { color: '#fff', fontWeight: '900', fontSize: 12 },
  heartBtn: { width: 34, height: 34, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', marginLeft: 8 },
  heartBtnFav: { backgroundColor: 'rgba(124,36,255,0.45)' },
  heartTxt: { color: '#fff', fontWeight: '900' },
  heroFrame: { alignSelf: 'center', borderRadius: 26, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(176,22,22,0.55)' },
  heroImg: { width: '100%', height: '100%' },
  detailCard: { alignSelf: 'center', marginTop: 12, borderRadius: 22, backgroundColor: 'rgba(139,16,16,0.86)', padding: 16 },
  detailTitle: { color: '#fff', fontWeight: '900', textAlign: 'center', fontSize: 20 },
  detailBody: { color: 'rgba(255,255,255,0.92)', marginTop: 10, textAlign: 'center', fontSize: 12 },
  detailActions: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  actionIcon: { backgroundColor: '#b01616', width: 58, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionIconFav: { backgroundColor: '#7c24ff' },
  actionIconTxt: { color: '#fff', fontWeight: '900', fontSize: 20 },
  shareBtn: { flex: 1, height: 48, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  shareGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#b01616', opacity: 0.9 },
  shareGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#3b0622', opacity: 0.45 },
  shareTxt: { color: '#fff', fontWeight: '900', fontSize: 16 },
});