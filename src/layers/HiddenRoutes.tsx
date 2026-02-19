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
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootRouteRegistry } from '../routes/RouteRegistry';
import { routeCategories } from '../hiddenRoutesData';

type Props = NativeStackScreenProps<RootRouteRegistry, 'HiddenRoutes'>;

type CatColor = {
  a: string; 
  b: string; 
  border: string;
  shadow: string;
};

const BG = require('../media/entry_p_bg.png');
const HEADER_BADGE = require('../media/entry_portal_logo.png');
const CARD_BG = require('../media/entry_portal_bg.png');
const GUIDE_1 = require('../media/guide_frame_01.png');

const CAT_COLORS: Record<string, CatColor> = {
  nature: { a: '#0f6b8f', b: '#07324a', border: 'rgba(160, 230, 255, 0.28)', shadow: '#2bb6ff' },
  history: { a: '#8f1010', b: '#3b0622', border: 'rgba(255, 210, 210, 0.24)', shadow: '#ff3b3b' },
  food: { a: '#8a5a10', b: '#3b2206', border: 'rgba(255, 235, 190, 0.26)', shadow: '#ffb300' },
};

function shorten(s: string, n: number) {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1) + '…' : t;
}

function useEntryAnim() {
  const a = useRef(new Animated.Value(0)).current;
  const cards = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(a, { toValue: 1, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(cards, { toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [a, cards]);
  return { a, cards };
}

export default function HiddenRoutes({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  const isMicro = height < 600; 
  const isSE = height < 680 || width < 340;

  const sidePad = isMicro ? 8 : isSE ? 12 : 16;
  const headerH = isMicro ? 60 : isSE ? 68 : 84;
  const badgeSize = isMicro ? 40 : isSE ? 46 : 54;
  const infoH = isMicro ? 100 : isSE ? 115 : 135;
  const btnH = isMicro ? 60 : isSE ? 70 : 82;

  const androidOffset = Platform.OS === 'android' ? 50 : 0;
  const headerMarginTop = (isMicro ? 4 : 10) + androidOffset;
  
  const { a, cards } = useEntryAnim();
  const [selectedId, setSelectedId] = useState<string>(routeCategories[0]?.id ?? 'nature');
  const activeColors = useMemo(() => CAT_COLORS[selectedId] ?? CAT_COLORS.history, [selectedId]);

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[styles.wrap, { paddingHorizontal: sidePad }]}>
            
            <Animated.View style={{ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }] }}>
              <View style={[styles.header, { height: headerH, marginTop: headerMarginTop }]}>
                <View style={styles.headerGlowA} />
                <View style={styles.headerGlowB} />
                
                <Pressable 
                  onPress={() => navigation.goBack()}
                  style={[styles.menuBtn, { width: badgeSize, height: badgeSize, left: 10, borderRadius: isMicro ? 10 : 14 }]}
                >
                  <Text style={{ color: '#fff', fontSize: isMicro ? 20 : 24, fontWeight: 'bold' }}>≡</Text>
                </Pressable>

                <Text style={[styles.headerTitle, { fontSize: isMicro ? 14 : isSE ? 17 : 19 }]}>
                  Recommended{'\n'}places
                </Text>

                <View style={[styles.badgeWrap, { width: badgeSize, height: badgeSize, right: 10, borderRadius: isMicro ? 10 : 14 }]}>
                  <Image source={HEADER_BADGE} style={styles.badgeImg} />
                </View>
              </View>
            </Animated.View>

            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ paddingBottom: 20 }}
            >
          
              <Animated.View style={{ opacity: a, marginTop: isMicro ? 10 : 15 }}>
                <View style={[styles.infoOuter, { height: infoH }]}>
                  <ImageBackground source={CARD_BG} style={styles.infoBg}>
                    <View style={styles.infoShade} />
                    <View style={[styles.infoBorder, { borderColor: activeColors.a }]} />
                    <View style={styles.infoRow}>
                      <Image 
                        source={GUIDE_1} 
                        style={{ width: isMicro ? 60 : 80, height: '100%', marginRight: 10 }} 
                        resizeMode="contain" 
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.infoTitle, { fontSize: isMicro ? 15 : 18 }]}>Choose category</Text>
                        <Text style={[styles.infoBody, { fontSize: isMicro ? 10 : 11 }]} numberOfLines={2}>
                          Select a category to find the best local gems.
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </Animated.View>

      
              <View style={{ gap: isMicro ? 8 : 12, marginTop: isMicro ? 10 : 15 }}>
                {routeCategories.map((c, idx) => {
                  const isSelected = c.id === selectedId;
                  const color = CAT_COLORS[c.id] ?? CAT_COLORS.history;

                  return (
                    <CategoryCard
                      key={c.id}
                      item={c}
                      selected={isSelected}
                      onPress={() => setSelectedId(c.id)}
                      color={color}
                      isMicro={isMicro}
                      animValue={cards}
                      index={idx}
                    />
                  );
                })}
              </View>

          
              <Pressable
                onPress={() => navigation.navigate('HiddenRoutesList', { categoryId: selectedId })}
                style={({ pressed }) => [
                  styles.chooseBtn,
                  { height: btnH, marginTop: isMicro ? 15 : 20, borderRadius: isMicro ? 15 : 20 },
                  pressed && { transform: [{ scale: 0.98 }] }
                ]}
              >
                <View style={[styles.chooseGlowA, { backgroundColor: activeColors.a }]} />
                <View style={[styles.chooseBorder, { borderColor: activeColors.border }]} />
                <Text style={[styles.chooseText, { fontSize: isMicro ? 17 : 20 }]}>Explore Now</Text>
              </Pressable>
            </ScrollView>

          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

function CategoryCard({ item, selected, onPress, color, isMicro, animValue, index }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: selected ? 1.02 : 1, useNativeDriver: true }).start();
  }, [selected, scale]);

  return (
    <Animated.View style={{
      opacity: animValue,
      transform: [
        { scale },
        { translateY: animValue.interpolate({ inputRange: [0, 1], outputRange: [20 + index * 5, 0] }) }
      ]
    }}>
      <Pressable 
        onPress={onPress} 
        style={[
          styles.catCard, 
          { minHeight: isMicro ? 70 : 90, padding: isMicro ? 10 : 14 }
        ]}
      >
        <View style={[styles.catGlowA, { backgroundColor: selected ? color.a : '#222' }]} />
        <View style={[styles.catBorder, { borderColor: selected ? color.border : 'rgba(255,255,255,0.1)' }]} />
        
        <Text style={[styles.catTitle, { fontSize: isMicro ? 13 : 16 }]}>{item.icon} {item.title}</Text>
        <Text style={[styles.catBody, { fontSize: isMicro ? 10 : 11 }]} numberOfLines={2}>
          {shorten(item.subtitle, isMicro ? 70 : 120)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { flex: 1 },
  wrap: { flex: 1 },
  header: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerGlowA: { ...StyleSheet.absoluteFillObject, backgroundColor: '#8f1010', opacity: 0.9 },
  headerGlowB: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000', opacity: 0.3 },
  headerTitle: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  menuBtn: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  badgeWrap: { 
    position: 'absolute', 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)' 
  },
  badgeImg: { width: '100%', height: '100%' },
  
  infoOuter: { width: '100%', borderRadius: 20, overflow: 'hidden' },
  infoBg: { flex: 1, paddingHorizontal: 10 },
  infoShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  infoBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 20, borderWidth: 1.5 },
  infoRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  infoTitle: { color: '#fff', fontWeight: '900' },
  infoBody: { color: '#ddd' },

  catCard: { borderRadius: 16, overflow: 'hidden', justifyContent: 'center' },
  catGlowA: { ...StyleSheet.absoluteFillObject, opacity: 0.7 },
  catBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 16, borderWidth: 1.5 },
  catTitle: { color: '#fff', fontWeight: '800', marginBottom: 4 },
  catBody: { color: 'rgba(255,255,255,0.7)' },

  chooseBtn: { width: '100%', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  chooseGlowA: { ...StyleSheet.absoluteFillObject, opacity: 1 },
  chooseBorder: { ...StyleSheet.absoluteFillObject, borderWidth: 2 },
  chooseText: { color: '#fff', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
});