import React from 'react'
import { View ,Text} from 'react-native'
import {StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const Home = () => {
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>React Native</Text>
    </SafeAreaView>
  </SafeAreaProvider>

  
  )
}

export default Home


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#eaeaea',
    },
    title: {
      marginTop: 16,
      paddingVertical: 8,
      borderWidth: 4,
      borderColor: '#20232a',
      borderRadius: 6,
      backgroundColor: '#61dafb',
      color: '#20232a',
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
    },
  });
  