import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'Events'>;

type Event = {
  id: number;
  name: string;
  location: string;
  date: string;
  time: string;
  resident: number;
};

const EventsScreen = ({ navigation }: Props) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [resident, setResident] = useState('');

  const fetchEvents = async (params?: { name?: string; location?: string; date?: string; resident?: string }) => {
    setLoading(true);
    let url = `${API_BASE_URL}/eventos/`;
    const query: string[] = [];
    if (params) {
      if (params.name) query.push(`nome=${encodeURIComponent(params.name)}`);
      if (params.location) query.push(`local=${encodeURIComponent(params.location)}`);
      if (params.date) query.push(`data=${encodeURIComponent(params.date)}`);
      if (params.resident) query.push(`morador=${encodeURIComponent(params.resident)}`);
    }
    if (query.length > 0) {
      url += '?' + query.join('&');
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    const dataResp = await response.json();
    setEvents(dataResp.map((item: any) => ({
      id: item.id,
      name: item.nome,
      location: item.local,
      date: item.data,
      time: item.horario,
      resident: item.morador,
    })));
    setLoading(false);
  };

  useFocusEffect(useCallback(() => {
    fetchEvents();
  }, []));

  const handleDelete = async (id: number) => {
    await fetch(`${API_BASE_URL}/eventos/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleSearch = () => {
    fetchEvents({ name, location, date, resident });
  };

  const renderItem = ({ item }: { item: Event }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>Local: {item.location}</Text>
      <Text style={styles.description}>Data: {item.date}</Text>
      <Text style={styles.description}>Horário: {item.time}</Text>
      <Text style={styles.description}>Morador ID: {item.resident}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditEvent', item)}
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.editText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos</Text>
      {/* Campos de busca */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Local"
          value={location}
          onChangeText={setLocation}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Data"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Morador (ID)"
          value={resident}
          onChangeText={setResident}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', alignSelf: 'center', marginBottom: 12 },
  card: { backgroundColor: '#f0f4ff', padding: 16, borderRadius: 10, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: '600' },
  description: { fontSize: 14, color: '#666', marginTop: 4 },
  row: { flexDirection: 'row', marginTop: 12 },
  editButton: { backgroundColor: '#4B7BE5', padding: 8, borderRadius: 6, marginRight: 8 },
  deleteButton: { backgroundColor: '#E54848', padding: 8, borderRadius: 6 },
  editText: { color: '#fff', fontWeight: '500' },
  fab: {
    position: 'absolute', right: 20, bottom: 20,
    backgroundColor: '#0D47A1', borderRadius: 28,
    padding: 14, elevation: 4
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
    marginRight: 4,
  },
  searchButton: {
    backgroundColor: '#4B7BE5',
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EventsScreen;
