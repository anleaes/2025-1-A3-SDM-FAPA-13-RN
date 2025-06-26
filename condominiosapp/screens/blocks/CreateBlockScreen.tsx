import { API_BASE_URL, API_TOKEN } from '../../apiConfig';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'CreateBlock'>;

type Condominio = {
  id: number;
  nome: string;
};

const CreateBlockScreen = ({ navigation }: Props) => {

  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState('');
  const [qtdApartamentos, setQtdApartamentos] = useState('');
  const [condominioId, setCondominioId] = useState<number | null>(null);
  const [condominios, setCondominios] = useState<Condominio[]>([]);
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
    setCondominios(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCondominios();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API_BASE_URL}/blocos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
      body: JSON.stringify({
        nome,
        numero: Number(numero),
        qtd_apartamentos: Number(qtdApartamentos),
        condominio: condominioId
      }),
    });
    navigation.navigate('Blocks');
    setSaving(false);
  };

  if (loading) return <ActivityIndicator size="large" color="#4B7BE5" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Bloco</Text>
      <Text style={styles.label}>Nome do Bloco</Text>
      <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
      <Text style={styles.label}>Número</Text>
      <TextInput placeholder="Número" style={styles.input} keyboardType="numeric" value={numero} onChangeText={setNumero} />
      <Text style={styles.label}>Qtd. Apartamentos</Text>
      <TextInput placeholder="Qtd. Apartamentos" style={styles.input} keyboardType="numeric" value={qtdApartamentos} onChangeText={setQtdApartamentos} />

      <Text style={styles.label}>Condomínio</Text>
      <Picker selectedValue={condominioId} onValueChange={(itemValue: number | null) => setCondominioId(itemValue)}>
        <Picker.Item label="Selecione..." value={null} />
        {condominios.map(c => (
          <Picker.Item key={c.id} label={c.nome} value={c.id} />
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

export default CreateBlockScreen;
