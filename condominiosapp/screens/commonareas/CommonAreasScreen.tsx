import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'CommonAreas'>;

type CommonArea = {
  id: number;
  name: string;
  capacity: number;
  openingTime: string;
  closingTime: string;
  condominium: number;
};

const CommonAreasScreen = ({ navigation }: Props) => {
  const [areas, setAreas] = useState<CommonArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [condominio, setCondominio] = useState('');

  const fetchAreas = async (params?: { nome?: string; capacidade?: string; condominio?: string }) => {
    setLoading(true);
    let url = `${API_BASE_URL}/areascomuns/`;
    const query: string[] = [];
    if (params) {
      if (params.nome) query.push(`nome=${encodeURIComponent(params.nome)}`);
      if (params.capacidade) query.push(`capacidade=${encodeURIComponent(params.capacidade)}`);
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
    const data = await response.json();
    setAreas(data.map((item: any) => ({
      id: item.id,
      name: item.nome,
      capacity: item.capacidade,
      openingTime: item.horario_abertura,
      closingTime: item.horario_fechamento,
      condominium: item.condominio,
    })));
    setLoading(false);
  };

  useFocusEffect(useCallback(() => {
    fetchAreas();
  }, []));

  const handleDelete = async (id: number) => {
    await fetch(`${API_BASE_URL}/areascomuns/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    setAreas(prev => prev.filter(a => a.id !== id));
  };

  const handleSearch = () => {
    fetchAreas({ nome, capacidade, condominio });
    Keyboard.dismiss();
  };

  const renderItem = ({ item }: { item: CommonArea }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>Capacidade: {item.capacity} pessoas</Text>
      <Text style={styles.description}>Abertura: {item.openingTime}</Text>
      <Text style={styles.description}>Fechamento: {item.closingTime}</Text>
      <Text style={styles.description}>Condomínio ID: {item.condominium}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditCommonArea', item)}
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Text style={styles.title}>Áreas Comuns</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Capacidade"
          value={capacidade}
          onChangeText={setCapacidade}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Condomínio"
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
          data={areas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateCommonArea')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  input: {
    flex: 1,
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

export default CommonAreasScreen;
