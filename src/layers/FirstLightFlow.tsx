import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Animated,
  Easing,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';

type Props = {
  onFinish?: () => void;
};

const BG = require('../media/entry_portal_bg.png');
const GUIDE_1 = require('../media/guide_frame_01.png');
const GUIDE_2 = require('../media/guide_frame_02.png');
const GUIDE_3 = require('../media/guide_frame_03.png');

type Slide = {
  key: string;
  title: string;
  body: string;
  button: string;
  image: any;
};

export default function FirstLightFlow({ onFinish }: Props) {
  const { width, height } = useWindowDimensions();

  const isTiny = height < 720 || width < 360;
  const isShort = height < 740;

  const slides: Slide[] = useMemo(
    () => [
      {
        key: 'a1',
        title: "Hi, I'm Daniel — your Victoria guide.",
        body: "I’ll help you discover the best places in Victoria, British Columbia. From iconic landmarks to hidden local gems — everything is organized for you.",
        button: 'Next',
        image: GUIDE_1,
      },
      {
        key: 'b2',
        title: "I've prepared curated places just for you.",
        body: "Browse locations by categories, save your favorites, and explore everything on an interactive map. Plan your day, build your route, and never miss something special.",
        button: 'Okay',
        image: GUIDE_2,
      },
      {
        key: 'c3',
        title: 'Need something unique? Just ask me',
        body: "Use the guide chat to get interesting facts about any location or receive a random place suggestion for your next visit. Victoria always has something new waiting for you.",
        button: 'Start',
        image: GUIDE_3,
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const s = slides[index];

  const appear = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    appear.setValue(0);
    Animated.timing(appear, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [index, appear]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  const topPad = Platform.OS === 'ios' ? (isTiny ? 12 : 18) : (isTiny ? 10 : 14);
  const heroW = Math.min(width * (isTiny ? 0.88 : 0.82), isTiny ? 315 : 360);
  const heroH = Math.min(height * (isTiny ? 0.54 : 0.58), heroW * 1.3);
  const cardMaxW = Math.min(width - 36, 560);
  const cardTopOffset = 40;
  const cardMinH = isTiny ? 112 : 126;
  const btnHeight = isTiny ? 52 : 54;
  const overlapPx = 20;

  const androidBottomLift = Platform.OS === 'android' ? 100 : 0;
  const bottomPad = Platform.OS === 'ios'
    ? (isTiny ? 16 : 20)
    : (isTiny ? 12 : 16);

  const cardOpacity = appear;
  const cardY = appear.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] });
  const heroOpacity = appear;
  const heroY = appear.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  const heroScaleIn = appear.interpolate({ inputRange: [0, 1], outputRange: [0.985, 1] });
  const heroBreatheScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });
  const btnOpacity = appear;
  const btnY = appear.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });

  const onPressPrimary = () => {
    if (index < slides.length - 1) setIndex((v) => v + 1);
    else onFinish?.();
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <View style={[styles.content, { paddingTop: topPad, paddingBottom: bottomPad }]}>
            <Animated.View
              style={[
                styles.card,
                {
                  width: cardMaxW,
                  minHeight: cardMinH,
                  marginTop: cardTopOffset,
                  opacity: cardOpacity,
                  transform: [{ translateY: cardY }],
                  padding: isTiny ? 13 : 15,
                  borderRadius: 16,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { fontSize: isTiny ? 13 : 14 }]}>{s.title}</Text>
              <Text style={[styles.cardBody, { fontSize: isTiny ? 11 : 12 }]}>{s.body}</Text>
            </Animated.View>

            <View style={[styles.heroWrap, { paddingTop: isTiny ? 6 : 10 }]}>
              <Animated.View
                style={{
                  opacity: heroOpacity,
                  transform: [
                    { translateY: heroY },
                    { scale: heroScaleIn },
                    { scale: heroBreatheScale },
                  ],
                }}
              >
                <Image source={s.image} resizeMode="contain" style={{ width: heroW, height: heroH }} />
              </Animated.View>
            </View>

            <Animated.View
              style={{
                width: '100%',
                alignItems: 'center',
                opacity: btnOpacity,
                transform: [{ translateY: btnY }],
                marginTop: -overlapPx - androidBottomLift,
              }}
            >
              <PrimaryPurpleButton title={s.button} onPress={onPressPrimary} height={btnHeight} isTiny={isTiny} />
            </Animated.View>

            {isShort ? <View style={{ height: 4 + androidBottomLift }} /> : <View style={{ height: 10 + androidBottomLift }} />}
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

function PrimaryPurpleButton({
  title,
  onPress,
  height,
  isTiny,
}: {
  title: string;
  onPress: () => void;
  height: number;
  isTiny: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { height },
        pressed && styles.btnPressed,
      ]}
    >
      <View style={styles.btnGlowA} />
      <View style={styles.btnGlowB} />
      <Text style={[styles.btnText, { fontSize: isTiny ? 13 : 14 }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 18,
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.44)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  cardTitle: {
    color: 'rgba(255,255,255,0.93)',
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  cardBody: {
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 16,
    textAlign: 'center',
  },
  heroWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a0747',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  btnPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
  btnGlowA: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#7c24ff',
    opacity: 0.26,
  },
  btnGlowB: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#3f0a6f',
    opacity: 0.45,
  },
  btnText: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '800',
    letterSpacing: 0.7,
  },
});