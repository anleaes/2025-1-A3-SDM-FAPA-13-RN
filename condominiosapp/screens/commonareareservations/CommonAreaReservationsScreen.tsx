import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'CommonAreaReservations'>;

type CommonAreaReservation = {
  id: number;
  reservationDate: string;
  status: string;
  resident: number;
  commonArea: number;
};

const CommonAreaReservationsScreen = ({ navigation }: Props) => {
  const [reservations, setReservations] = useState<CommonAreaReservation[]>([]);
  const [loading, setLoading] = useState(true);
  // Novos estados para filtros
  const [dataReserva, setDataReserva] = useState('');
  const [status, setStatus] = useState('');
  const [morador, setMorador] = useState('');
  const [areaComum, setAreaComum] = useState('');

  const fetchReservations = async (params?: { data_reserva?: string; status?: string; morador?: string; area_comum?: string }) => {
    setLoading(true);
    let url = `${API_BASE_URL}/reservas/`;
    const query: string[] = [];
    if (params) {
      if (params.data_reserva) query.push(`data_reserva=${encodeURIComponent(params.data_reserva)}`);
      if (params.status) query.push(`status=${encodeURIComponent(params.status)}`);
      if (params.morador) query.push(`morador=${encodeURIComponent(params.morador)}`);
      if (params.area_comum) query.push(`area_comum=${encodeURIComponent(params.area_comum)}`);
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
    setReservations(dataResp.map((item: any) => ({
      id: item.id,
      reservationDate: item.data_reserva,
      status: item.status,
      resident: item.morador,
      commonArea: item.area_comum,
    })));
    setLoading(false);
  };

  useFocusEffect(useCallback(() => {
    fetchReservations();
  }, []));

  const handleDelete = async (id: number) => {
    await fetch(`${API_BASE_URL}/reservas/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const handleSearch = () => {
    fetchReservations({ data_reserva: dataReserva, status, morador, area_comum: areaComum });
  };

  const renderItem = ({ item }: { item: CommonAreaReservation }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Reserva {item.id}</Text>
      <Text style={styles.description}>Data: {item.reservationDate}</Text>
      <Text style={styles.description}>Status: {item.status}</Text>
      <Text style={styles.description}>Morador ID: {item.resident}</Text>
      <Text style={styles.description}>Área Comum ID: {item.commonArea}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditCommonAreaReservation', item)}
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
      <Text style={styles.title}>Reservas de Áreas Comuns</Text>
      {/* Campos de busca */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Data da Reserva"
          value={dataReserva}
          onChangeText={setDataReserva}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Status"
          value={status}
          onChangeText={setStatus}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Morador (ID)"
          value={morador}
          onChangeText={setMorador}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Área Comum (ID)"
          value={areaComum}
          onChangeText={setAreaComum}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateCommonAreaReservation')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    marginTop: 12,
  },
  editButton: {
    backgroundColor: '#4B7BE5',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#E54848',
    padding: 8,
    borderRadius: 6,
  },
  editText: {
    color: '#fff',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#0D47A1',
    borderRadius: 28,
    padding: 14,
    elevation: 4,
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

export default CommonAreaReservationsScreen;
