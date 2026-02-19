import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootRouteRegistry } from './RouteRegistry';

import EntryPortal from '../layers/EntryPortal';
import FirstLightFlow from '../layers/FirstLightFlow';
import CrossroadsHub from '../layers/CrossroadsHub';
import HiddenRoutes from '../layers/HiddenRoutes';
import HiddenRoutesList from '../layers/HiddenRoutesList';
import HiddenRouteDetail from '../layers/HiddenRouteDetail';

import MemoryShelf from '../layers/MemoryShelf';
import JourneyNotes from '../layers/JourneyNotes';
import LiveAtlas from '../layers/LiveAtlas';

const Stack = createNativeStackNavigator<RootRouteRegistry>();

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#000000',
    text: '#FFFFFF',
    border: 'rgba(255,255,255,0.12)',
    primary: '#FFFFFF',
    notification: '#FFFFFF',
  },
};

export default function NavigatorCore() {
  return (
    <NavigationContainer theme={AppDarkTheme}>
      <Stack.Navigator
        initialRouteName="EntryPortal"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#000' },
        }}
      >
        <Stack.Screen name="EntryPortal" component={EntryPortalBridge} />
        <Stack.Screen name="FirstLightFlow" component={FirstLightBridge} />
        <Stack.Screen name="CrossroadsHub" component={CrossroadsBridge} />

        <Stack.Screen name="HiddenRoutes" component={HiddenRoutes} />
        <Stack.Screen name="HiddenRoutesList" component={HiddenRoutesList} />
        <Stack.Screen name="HiddenRouteDetail" component={HiddenRouteDetail} />

        <Stack.Screen name="MemoryShelf" component={MemoryShelf} />
        <Stack.Screen name="JourneyNotes" component={JourneyNotes} />
        <Stack.Screen name="LiveAtlas" component={LiveAtlas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function EntryPortalBridge({ navigation }: any) {
  return <EntryPortal onDone={() => navigation.replace('FirstLightFlow')} />;
}

function FirstLightBridge({ navigation }: any) {
  return <FirstLightFlow onFinish={() => navigation.replace('CrossroadsHub')} />;
}

function CrossroadsBridge({ navigation }: any) {
  return (
    <CrossroadsHub
      goHiddenRoutes={() => navigation.navigate('HiddenRoutes')}
      goMemoryShelf={() => navigation.navigate('MemoryShelf')}
      goJourneyNotes={() => navigation.navigate('JourneyNotes')}
      goLiveAtlas={() => navigation.navigate('LiveAtlas')}
    />
  );
}
