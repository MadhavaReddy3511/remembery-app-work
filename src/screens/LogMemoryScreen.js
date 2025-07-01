import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function LogMemoryScreen({ navigation }) {
  const [memory, setMemory] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadName = async () => {
      const stored = await AsyncStorage.getItem('username');
      if (stored) setUsername(stored);
    };
    loadName();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Gallery permission needed.');
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Camera permission needed.');
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const saveMemory = async () => {
    if (!memory.trim()) return Alert.alert('Please enter something.');
    const stored = await AsyncStorage.getItem('memories');
    const memories = stored ? JSON.parse(stored) : [];
    memories.push({ id: Date.now(), text: memory, time: new Date(), image: imageUri });
    await AsyncStorage.setItem('memories', JSON.stringify(memories));
    setMemory('');
    setImageUri(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Saved!', 'Memory stored.');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.gradientOverlay} />
        <View style={styles.backgroundCircle} />

        <Text style={styles.title}>Hey {username || 'there'}, what do you want to log today?</Text>

        <TextInput
          style={styles.input}
          placeholder="Where did you place it?"
          placeholderTextColor={colors.text}
          value={memory}
          onChangeText={setMemory}
        />

        <TouchableOpacity style={styles.button} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); takePhoto(); }}>
          <Ionicons name="camera-outline" size={18} color={colors.text} style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); pickImage(); }}>
          <Ionicons name="image-outline" size={18} color={colors.text} style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

        <TouchableOpacity style={styles.saveButton} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); saveMemory(); }}>
          <Ionicons name="save-outline" size={18} color={colors.text} style={{ marginRight: 8 }} />
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); navigation.navigate('MemoryList'); }}>
          <Text style={styles.link}>View Saved Memories</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 30 },
  gradientOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(138,189,168,0.05)' },
  backgroundCircle: { position: 'absolute', top: -150, left: -150, width: 500, height: 500, backgroundColor: colors.accentBeige, opacity: 0.1, borderRadius: 250 },
  title: { fontSize: 26, color: colors.accentBeige, marginBottom: 25, fontWeight: '600', textAlign: 'center' },
  input: { width: '100%', padding: 15, borderWidth: 1, borderColor: colors.accentBeige, borderRadius: 12, marginBottom: 20, backgroundColor: colors.surface, color: colors.text },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, borderWidth: 1, borderColor: colors.accentBeige, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  buttonText: { color: colors.text, fontWeight: 'bold' },
  preview: { width: 120, height: 120, marginBottom: 15, borderRadius: 10, borderWidth: 1, borderColor: colors.accentBeige },
  saveButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accentGreen, paddingVertical: 15, paddingHorizontal: 35, borderRadius: 30, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 5 },
  saveText: { color: colors.text, fontWeight: 'bold', marginLeft: 8 },
  link: { color: colors.accentGreen, textDecorationLine: 'underline', marginTop: 15 }, 
});
