import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'Employees'>;

type Employee = {
  id: number;
  name: string;
  role: string;
  salary: string;
  shift: string;
  condominium: number;
};

const EmployeeScreen = ({ navigation }: Props) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  // Novos estados para filtros
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');
  const [turno, setTurno] = useState('');
  const [condominio, setCondominio] = useState('');

  const fetchEmployees = async (params?: { nome?: string; funcao?: string; turno?: string; condominio?: string }) => {
    setLoading(true);
    let url = `${API_BASE_URL}/funcionarios/`;
    const query: string[] = [];
    if (params) {
      if (params.nome) query.push(`nome=${encodeURIComponent(params.nome)}`);
      if (params.funcao) query.push(`funcao=${encodeURIComponent(params.funcao)}`);
      if (params.turno) query.push(`turno=${encodeURIComponent(params.turno)}`);
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
    setEmployees(dataResp.map((item: any) => ({
      id: item.id,
      name: item.nome,
      role: item.funcao,
      salary: item.salario,
      shift: item.turno,
      condominium: item.condominio,
    })));
    setLoading(false);
  };

  useFocusEffect(useCallback(() => {
    fetchEmployees();
  }, []));

  const handleDelete = async (id: number) => {
    await fetch(`${API_BASE_URL}/funcionarios/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const handleSearch = () => {
    fetchEmployees({ nome, funcao, turno, condominio });
  };

  const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>Função: {item.role}</Text>
      <Text style={styles.description}>Salário: {item.salary}</Text>
      <Text style={styles.description}>Turno: {item.shift}</Text>
      <Text style={styles.description}>Condomínio ID: {item.condominium}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditEmployee', item)}
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
      <Text style={styles.title}>Funcionários</Text>
      {/* Campos de busca */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Função"
          value={funcao}
          onChangeText={setFuncao}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Turno"
          value={turno}
          onChangeText={setTurno}
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
          data={employees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateEmployee')}
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

export default EmployeeScreen;
