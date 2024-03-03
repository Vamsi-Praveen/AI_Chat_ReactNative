import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  //using usefonts to import user specified fonts and only return the homepage when all the fonts is loaded
  const [loaded] = useFonts({
    'Poppins': require('./assets/fonts/Poppins-Medium.ttf'),
    'DmSans': require('./assets/fonts/DMSans-Medium.ttf'),
  })
  if (!loaded) return null; // Prevent rendering until fonts are loaded
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeScreen />
      </SafeAreaView>
      <StatusBar style='auto' /></>
  );
}