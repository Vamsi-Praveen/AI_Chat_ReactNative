import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export default function App() {

  //getting the device color scheme darkmode or lightmode
  const [apperance, setApperance] = useState(Appearance.getColorScheme());

  useEffect(() => {
    //adding event listner on chaning the color theme
    const subscription = Appearance.addChangeListener(({ colorScheme }) => { setApperance(colorScheme) })
    //cleanup function
    return () => {
      subscription.remove()
    }
  }, [])

  //changing the statusbar color based on  the apperance mode
  const statusBarColor = apperance === 'dark' ? 'dark' : apperance == 'light' ? 'dark' : 'auto'

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
      <StatusBar style={statusBarColor} /></>
  );
}