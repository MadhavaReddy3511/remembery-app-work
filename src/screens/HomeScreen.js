import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import * as Haptics from 'expo-haptics';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');

  const saveName = async () => {
    if (!name.trim()) return;
    await AsyncStorage.setItem('username', name.trim());
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.replace('LogMemory');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.gradientOverlay} />

        <Text style={styles.title}>Welcome to Remembery</Text>

        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor={colors.text}
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity style={styles.button} onPress={saveName}>
          <Text style={styles.buttonText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 30 },
  gradientOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(138,189,168,0.05)' },
  title: { fontSize: 28, color: colors.accentBeige, marginBottom: 30, fontWeight: 'bold', textAlign: 'center' },
  input: { width: '100%', padding: 15, borderWidth: 1, borderColor: colors.accentBeige, borderRadius: 12, marginBottom: 25, backgroundColor: colors.surface, color: colors.text },
  button: { backgroundColor: colors.surface, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, borderWidth: 1, borderColor: colors.accentBeige, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  buttonText: { color: colors.text, fontWeight: 'bold', fontSize: 16 },
});
