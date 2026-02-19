import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
} from 'react-native';

type Props = {
  onDone?: () => void;
};

const BG = require('../media/entry_portal_bg.png');
const LOGO = require('../media/entry_portal_logo.png');

export default function EntryPortal({ onDone }: Props) {
  const { width, height } = useWindowDimensions();

  const isTiny = height < 700 || width < 360;

  const animIn = useRef(new Animated.Value(0)).current;   
  const animScale = useRef(new Animated.Value(0.96)).current; 
  const pulse = useRef(new Animated.Value(0)).current;    

  const logoSize = useMemo(() => {
  
    const base = Math.min(width, height);
    const raw = base * (isTiny ? 0.34 : 0.38);

    return Math.max(150, Math.min(raw, 240));
  }, [width, height, isTiny]);

  useEffect(() => {

    Animated.parallel([
      Animated.timing(animIn, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(animScale, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

  
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    const t = setTimeout(() => {
      onDone?.();
    }, 4000);

    return () => {
      clearTimeout(t);
      pulseLoop.stop();
    };
  }, [animIn, animScale, pulse, onDone]);

  const logoPulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const logoPulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <View style={styles.centerWrap}>
            <Animated.View
              style={[
                styles.logoWrap,
                {
                  opacity: animIn,
                  transform: [{ scale: animScale }],
                },
              ]}
            >
              <Animated.View
                style={{
                  transform: [{ scale: logoPulseScale }],
                  opacity: logoPulseOpacity,
                }}
              >
                <Image
                  source={LOGO}
                  style={{
                    width: logoSize,
                    height: logoSize,
                  }}
                  resizeMode="contain"
                />
              </Animated.View>

              <Text
                style={[
                  styles.caption,
                  { marginTop: isTiny ? 12 : 14, fontSize: isTiny ? 12 : 13 },
                ]}
                numberOfLines={2}
              >
                Loading…
              </Text>
            </Animated.View>
          </View>

          <View style={[styles.bottom, { paddingBottom: isTiny ? 10 : 16 }]}>
            <Text style={[styles.footer, { fontSize: isTiny ? 10 : 11 }]}>
              {Platform.OS === 'ios' ? 'Preparing scenes' : 'Preparing content'}
            </Text>
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

  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  caption: {
    color: 'rgba(255,255,255,0.78)',
    letterSpacing: 0.4,
    textAlign: 'center',
  },

  bottom: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
  },

  footer: {
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
