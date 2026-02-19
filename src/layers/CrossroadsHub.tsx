import React, { useMemo, useState, useEffect, useRef } from 'react';
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
} from 'react-native';

type Props = {
  goHiddenRoutes?: () => void;
  goMemoryShelf?: () => void;
  goJourneyNotes?: () => void;
  goLiveAtlas?: () => void;
};

const BG = require('../media/entry_p_bg.png');
const APP_BADGE = require('../media/entry_portal_logo.png');
const GUIDE_1 = require('../media/guide_frame_01.png');
const CHAT_CARD_BG = require('../media/entry_portal_bg.png');

type MenuKey = 'recommended' | 'saved' | 'blog' | 'map';

export default function CrossroadsHub({
  goHiddenRoutes,
  goMemoryShelf,
  goJourneyNotes,
  goLiveAtlas,
}: Props) {
  const { width, height } = useWindowDimensions();

  const isMicro = height < 600; 
  const isSE = height < 680 || width < 340;

  const [active, setActive] = useState<MenuKey>('recommended');
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [a]);

  const menuItems = useMemo(
    () => [
      { key: 'recommended' as const, label: 'Recommended places', action: goHiddenRoutes },
      { key: 'saved' as const, label: 'Saved places', action: goMemoryShelf },
      { key: 'blog' as const, label: 'Travel blog', action: goJourneyNotes },
      { key: 'map' as const, label: 'Interactive map', action: goLiveAtlas },
    ],
    [goHiddenRoutes, goMemoryShelf, goJourneyNotes, goLiveAtlas]
  );

  const androidTopShift = Platform.OS === 'android' ? 50 : 0;
  const androidBottomShift = Platform.OS === 'android' ? 30 : 0;

  const topPad = Platform.OS === 'ios' ? (isMicro ? 2 : 10) : (4 + androidTopShift);
  const headerH = isMicro ? 54 : 76;
  const badgeSize = isMicro ? 40 : 54;
  const menuFont = isMicro ? 20 : isSE ? 26 : 32;
  const cardW = Math.min(width - (isMicro ? 16 : 30), 560);
  const cardH = isMicro ? 110 : isSE ? 135 : 160;
  
  const guideW = isMicro ? 75 : isSE ? 95 : 115;
  const guideH = isMicro ? 105 : isSE ? 135 : 160;

  const baseMargin = (isMicro ? 15 : isSE ? 55 : 75) + androidBottomShift; 

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <View style={[styles.wrap, { paddingTop: topPad }]}>
            
            <Animated.View style={{ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }] }}>
              <View style={[styles.header, { height: headerH }]}>
                <View style={styles.headerGlowA} />
                <View style={styles.headerGlowB} />
                <Text style={[styles.headerTitle, { fontSize: isMicro ? 22 : 30 }]}>Menu</Text>
                <View style={[styles.badgeWrap, { width: badgeSize, height: badgeSize, right: isMicro ? 8 : 12 }]}>
                  <Image source={APP_BADGE} style={styles.badgeImg} resizeMode="cover" />
                </View>
              </View>
            </Animated.View>

            <Animated.View style={[styles.listWrap, { opacity: a }]}>
              {menuItems.map((item, idx) => {
                const selected = item.key === active;
                return (
                  <View key={item.key} style={styles.rowBlock}>
                    <Pressable
                      onPress={() => { setActive(item.key); item.action?.(); }}
                      style={({ pressed }) => [
                        styles.rowBtn,
                        pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rowText,
                          { fontSize: menuFont, color: selected ? '#FFFFFF' : '#6d1b1b' },
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                    <View style={[styles.divider, { height: isMicro ? 2 : 3, marginTop: isMicro ? 4 : 8 }]} />
                    {idx < menuItems.length - 1 ? (
                      <View style={{ height: isMicro ? 12 : 18 }} />
                    ) : null}
                  </View>
                );
              })}
            </Animated.View>

            <Animated.View style={[styles.bottomArea, { opacity: a, marginBottom: baseMargin }]}>
              <View style={[styles.chatOuter, { width: cardW, height: cardH }]}>
                <ImageBackground source={CHAT_CARD_BG} style={styles.chatBg} resizeMode="cover">
                  <View style={styles.chatShade} />
                  <View style={styles.chatBorder} />

                  <View style={styles.chatContent}>
                    <View style={styles.chatLeft}>
                      <Image 
                        source={GUIDE_1} 
                        style={{ width: guideW, height: guideH, marginBottom: -5 }} 
                        resizeMode="contain" 
                      />
                    </View>

                    <View style={styles.chatRight}>
                      <Text
                        style={[
                          styles.chatTitle,
                          { fontSize: isMicro ? 17 : 22, marginBottom: 2 },
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        Guide Daniel
                      </Text>
                      <Text
                        style={[
                          styles.chatBody,
                          {
                            fontSize: isMicro ? 10 : 12,
                            lineHeight: isMicro ? 12 : 15,
                          },
                        ]}
                        numberOfLines={isMicro ? 3 : 5}
                      >
                        Explore Victoria with Daniel. Discover local gems and pick the perfect spot for your adventure.
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </View>
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
  wrap: { flex: 1, paddingHorizontal: 16 },
  header: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#8f1010', opacity: 0.9 },
  headerGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000', opacity: 0.3 },
  headerTitle: { color: '#fff', fontWeight: '900' },
  badgeWrap: {
    position: 'absolute',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeImg: { width: '100%', height: '100%' },
  listWrap: { flex: 1, justifyContent: 'center' },
  rowBlock: { width: '100%', alignItems: 'center' },
  rowBtn: { width: '100%' },
  rowText: { fontWeight: '900', textAlign: 'center' },
  divider: { width: '100%', backgroundColor: '#b01616', borderRadius: 10 },
  bottomArea: { alignItems: 'center', justifyContent: 'flex-end' },
  chatOuter: { borderRadius: 20, overflow: 'hidden' },
  chatBg: { flex: 1, padding: 8 },
  chatShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  chatBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 20, borderWidth: 1.5, borderColor: '#b01616' },
  chatContent: { flex: 1, flexDirection: 'row' },
  chatLeft: { width: '30%', alignItems: 'center', justifyContent: 'flex-end' },
  chatRight: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingLeft: 8,
    paddingBottom: 2, 
  },
  chatTitle: { color: '#fff', fontWeight: '900' },
  chatBody: { color: 'rgba(255,255,255,0.85)' },
});