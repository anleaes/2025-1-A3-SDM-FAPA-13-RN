import { API_BASE_URL, API_TOKEN } from '../../apiConfig';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Apartments'>;

type Apartamento = {
  id: number;
  numero: string;
  andar: number;
  metragem: number;
  vagas_garagem: number;
  bloco: number;
};

const ApartmentScreen = ({ navigation }: Props) => {

  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApartamentos = async () => {
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/apartamentos/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    const data = await response.json();
    setApartamentos(data);
    setLoading(false);
  };

  useFocusEffect(useCallback(() => {
    fetchApartamentos();
  }, []));

  const handleDelete = async (id: number) => {
    await fetch(`${API_BASE_URL}/apartamentos/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    setApartamentos(prev => prev.filter(a => a.id !== id));
  };

  const renderItem = ({ item }: { item: Apartamento }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Apt {item.numero} - Andar {item.andar}</Text>
      <Text style={styles.description}>Metragem: {item.metragem}m²</Text>
      <Text style={styles.description}>Vagas garagem: {item.vagas_garagem}</Text>
      <Text style={styles.description}>Bloco ID: {item.bloco}</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditApartment', item)}
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
      <Text style={styles.title}>Apartamentos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={apartamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateApartment')}
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
});

export default ApartmentScreen;
