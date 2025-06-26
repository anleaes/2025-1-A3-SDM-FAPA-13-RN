import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

// Padronização dos tipos e props

type Props = DrawerScreenProps<DrawerParamList, 'EditMaintenance'>;

type Condominium = {
  id: number;
  nome: string;
};

type Maintenance = {
  id: number;
  description: string;
  date: string;
  status: string;
  cost: number;
  condominium: number;
};

const EditMaintenanceScreen = ({ route, navigation }: Props) => {
  const { id, description, maintenanceDate, status, cost, condominium } = route.params as any;

  const [descriptionState, setDescription] = useState(description);
  const [dateState, setDate] = useState(maintenanceDate || '');
  const [statusValue, setStatusValue] = useState(status);
  const [costState, setCost] = useState(cost ? String(cost) : '');
  const [condominiumId, setCondominiumId] = useState<number | null>(condominium);
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCondominiums = async () => {
    const res = await fetch(`${API_BASE_URL}/condominio/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    const data = await res.json();
    setCondominiums(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCondominiums();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API_BASE_URL}/manutencoes/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
      body: JSON.stringify({
        descricao: descriptionState,
        data: dateState,
        status: statusValue,
        custo: costState ? parseFloat(costState) : 0,
        condominio: condominiumId,
      }),
    });
    navigation.navigate('Maintenances');
    setSaving(false);
  };

  if (loading) return <ActivityIndicator size="large" color="#4B7BE5" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Manutenção</Text>
      <TextInput placeholder="Descrição" style={styles.input} value={descriptionState} onChangeText={setDescription} />
      <TextInput placeholder="Data (YYYY-MM-DD)" style={styles.input} value={dateState} onChangeText={setDate} />
      <TextInput placeholder="Status" style={styles.input} value={statusValue} onChangeText={setStatusValue} />
      <TextInput placeholder="Custo" style={styles.input} value={costState} onChangeText={setCost} keyboardType="numeric" />
      <Text style={styles.label}>Condomínio</Text>
      <Picker selectedValue={condominiumId} onValueChange={(itemValue) => setCondominiumId(itemValue)}>
        <Picker.Item label="Selecione..." value={null} />
        {condominiums.map(c => (
          <Picker.Item key={c.id} label={c.nome} value={c.id} />
        ))}
      </Picker>
      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate('Maintenances')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});

export default EditMaintenanceScreen;
