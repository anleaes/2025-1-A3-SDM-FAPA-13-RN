import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  // Novos estados para filtros
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [status, setStatus] = useState('');
  const [condominio, setCondominio] = useState('');

  const fetchMaintenances = async (params?: { descricao?: string; data?: string; status?: string; condominio?: string }) => {
    setLoading(true);
    let url = `${API_BASE_URL}/manutencoes/`;
    const query: string[] = [];
    if (params) {
      if (params.descricao) query.push(`descricao=${encodeURIComponent(params.descricao)}`);
      if (params.data) query.push(`data=${encodeURIComponent(params.data)}`);
      if (params.status) query.push(`status=${encodeURIComponent(params.status)}`);
      if (params.condominio) query.push(`condominio=${encodeURIComponent(params.condominio)}`);
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
    setMaintenances(dataResp.map((item: any) => ({
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

  const handleSearch = () => {
    fetchMaintenances({ descricao, data, status, condominio });
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
      {/* Campos de busca */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Data"
          value={data}
          onChangeText={setData}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Status"
          value={status}
          onChangeText={setStatus}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Condomínio (ID)"
          value={condominio}
          onChangeText={setCondominio}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
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

export default MaintenancesScreen;
