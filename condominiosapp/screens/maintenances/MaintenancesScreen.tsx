import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'Maintenances'>;

type Maintenance = {
  id: number;
  description: string;
  date: string;
  status: string;
  cost: number;
  condominium: number;
};

const MaintenancesScreen = ({ navigation }: Props) => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaintenances = async () => {
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/manutencoes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    const data = await response.json();
    setMaintenances(data.map((item: any) => ({
      id: item.id,
      description: item.descricao,
      date: item.data || item.data_manutencao || '',
      status: item.status,
      cost: item.custo,
      condominium: item.condominio,
    })));
    setLoading(false);
  };

  useFocusEffect(useCallback(() => {
    fetchMaintenances();
  }, []));

  const handleDelete = async (id: number) => {
    await fetch(`${API_BASE_URL}/manutencoes/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    setMaintenances(prev => prev.filter(m => m.id !== id));
  };

  const renderItem = ({ item }: { item: Maintenance }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Manutenção {item.id}</Text>
      <Text style={styles.description}>Descrição: {item.description}</Text>
      <Text style={styles.description}>Data: {item.date}</Text>
      <Text style={styles.description}>Status: {item.status}</Text>
      <Text style={styles.description}>Condomínio ID: {item.condominium}</Text>
      <Text style={styles.description}>Custo: R$ {item.cost?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditMaintenance', item)}
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
      <Text style={styles.title}>Manutenções</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={maintenances}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateMaintenance')}
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
});

export default MaintenancesScreen;
