import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'EditCommonArea'>;

type Condominium = {
  id: number;
  nome: string;
};

const EditCommonAreaScreen = ({ route, navigation }: Props) => {
  const { id, name: nameInit, capacity: capacityInit, openingTime, closingTime, condominium: condominiumInit } = route.params;

  const [name, setName] = useState(nameInit);
  const [capacity, setCapacity] = useState(String(capacityInit));
  const [opening, setOpening] = useState(openingTime);
  const [closing, setClosing] = useState(closingTime);
  const [condominiumId, setCondominiumId] = useState<number | null>(condominiumInit);
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

  useEffect(() => {
    setName(route.params.name);
    setCapacity(String(route.params.capacity));
    setOpening(route.params.openingTime);
    setClosing(route.params.closingTime);
    setCondominiumId(route.params.condominium);
  }, [route.params]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API_BASE_URL}/areascomuns/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
      body: JSON.stringify({
        nome: name,
        capacidade: Number(capacity),
        horario_abertura: opening,
        horario_fechamento: closing,
        condominio: condominiumId,
      }),
    });
    navigation.navigate('CommonAreas');
    setSaving(false);
  };

  if (loading) return <ActivityIndicator size="large" color="#4B7BE5" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Área Comum</Text>
      <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Capacidade" style={styles.input} keyboardType="numeric" value={capacity} onChangeText={setCapacity} />
      <TextInput placeholder="Horário Abertura (HH:MM)" style={styles.input} value={opening} onChangeText={setOpening} />
      <TextInput placeholder="Horário Fechamento (HH:MM)" style={styles.input} value={closing} onChangeText={setClosing} />
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
      <Button title="Voltar" onPress={() => navigation.navigate('CommonAreas')} />
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

export default EditCommonAreaScreen;
