import { API_BASE_URL, API_TOKEN } from '../../apiConfig';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type EditBlockParams = {
  id: number;
  nome: string;
  numero: number;
  qtd_apartamentos: number;
  condominio: number;
};

type Props = DrawerScreenProps<DrawerParamList, 'EditBlock'> & {
  route: { params: EditBlockParams }
};

type Condominio = {
  id: number;
  name: string;
};

const EditBlockScreen = ({ route, navigation }: Props) => {
  const { id, nome: nameInit, numero: numberInit, qtd_apartamentos: apartmentsCountInit, condominio: condominiumInit } = route.params;

  const [name, setName] = useState(nameInit || '');
  const [number, setNumber] = useState(String(numberInit));
  const [apartmentsCount, setApartmentsCount] = useState(String(apartmentsCountInit));
  const [condominiumId, setCondominiumId] = useState<number | null>(condominiumInit);
  const [condominiums, setCondominiums] = useState<Condominio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCondominios = async () => {
    const res = await fetch(`${API_BASE_URL}/condominio/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    const data = await res.json();
    setCondominiums(data.map((item: any) => ({ id: item.id, name: item.nome })));
    setLoading(false);
  };

  useEffect(() => {
    fetchCondominios();
  }, []);

  useEffect(() => {
    setName(route.params.nome);
    setNumber(String(route.params.numero));
    setApartmentsCount(String(route.params.qtd_apartamentos));
    setCondominiumId(route.params.condominio);
  }, [route.params]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API_BASE_URL}/blocos/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
      body: JSON.stringify({
        nome: name,
        numero: Number(number),
        qtd_apartamentos: Number(apartmentsCount),
        condominio: condominiumId
      }),
    });
    navigation.navigate('Blocks');
    setSaving(false);
  };

  if (loading) return <ActivityIndicator size="large" color="#4B7BE5" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Bloco</Text>
      <Text style={styles.label}>Nome do Bloco</Text>
      <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Número</Text>
      <TextInput placeholder="Número" style={styles.input} keyboardType="numeric" value={number} onChangeText={setNumber} />
      <Text style={styles.label}>Qtd. Apartamentos</Text>
      <TextInput placeholder="Qtd. Apartamentos" style={styles.input} keyboardType="numeric" value={apartmentsCount} onChangeText={setApartmentsCount} />

      <Text style={styles.label}>Condomínio</Text>
      <Picker selectedValue={condominiumId} onValueChange={(itemValue: number | null) => setCondominiumId(itemValue)}>
        <Picker.Item label="Selecione..." value={null} />
        {condominiums.map(c => (
          <Picker.Item key={c.id} label={c.name} value={c.id} />
        ))}
      </Picker>

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate('Blocks')} />
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

export default EditBlockScreen;
