import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function MemoryListScreen({ navigation }) {
  const [memories, setMemories] = useState([]);
  const [search, setSearch] = useState('');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('memories');
      if (stored) setMemories(JSON.parse(stored));
    };
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  const deleteMemory = async (id) => {
    const updated = memories.filter(m => m.id !== id);
    setMemories(updated);
    await AsyncStorage.setItem('memories', JSON.stringify(updated));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Deleted!', 'Memory removed.');
  };

  const filtered = memories
    .filter(m => m.text.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortNewestFirst ? b.id - a.id : a.id - b.id);

  return (
    <View style={styles.container}>
      <View style={styles.gradientOverlay} />
      <View style={styles.backgroundCircle} />

      <Text style={styles.title}>Your Memories</Text>

      <TextInput
        style={styles.input}
        placeholder="Search memories..."
        placeholderTextColor={colors.text}
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => {
          setSortNewestFirst(!sortNewestFirst);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Ionicons name="swap-vertical-outline" size={18} color={colors.accentGreen} style={{ marginRight: 5 }} />
        <Text style={styles.sortText}>
          {sortNewestFirst ? 'Newest First' : 'Oldest First'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No memories yet. Start logging your stuff!</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => {
              deleteMemory(item.id);
            }}
            style={styles.memory}
          >
            <Text style={styles.memoryText}>{item.text}</Text>
            <Text style={styles.memoryTime}>
              {new Date(item.time).toLocaleDateString()} {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.goBack();
        }}
      >
        <Ionicons name="arrow-back-outline" size={18} color={colors.accentGreen} style={{ marginRight: 5 }} />
        <Text style={styles.backText}>Back to Log</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  gradientOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(138,189,168,0.05)' },
  backgroundCircle: { position: 'absolute', top: -150, left: -150, width: 500, height: 500, backgroundColor: colors.accentBeige, opacity: 0.1, borderRadius: 250 },
  title: { fontSize: 26, color: colors.accentBeige, textAlign: 'center', marginBottom: 15, fontWeight: '600' },
  input: { padding: 12, borderWidth: 1, borderColor: colors.accentBeige, borderRadius: 10, marginBottom: 15, backgroundColor: colors.surface, color: colors.text },
  sortButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  sortText: { color: colors.accentGreen, fontWeight: 'bold' },
  memory: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 12, marginVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  memoryText: { color: colors.text, fontSize: 16, marginBottom: 5 },
  memoryTime: { color: '#888', fontSize: 12, marginBottom: 5 },
  image: { width: 100, height: 100, marginTop: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.accentBeige },
  backButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  backText: { color: colors.accentGreen, textDecorationLine: 'underline' },
  empty: { textAlign: 'center', marginTop: 40, color: '#888', fontStyle: 'italic' },
});
