import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'CreateEmployee'>;

type Condominium = {
  id: number;
  name: string;
};

const CreateEmployeeScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [shift, setShift] = useState('');
  const [condominiumId, setCondominiumId] = useState<number | null>(null);
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
    setCondominiums(data.map((item: any) => ({ id: item.id, name: item.nome })));
    setLoading(false);
  };

  useEffect(() => {
    fetchCondominiums();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API_BASE_URL}/funcionarios/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
      body: JSON.stringify({
        nome: name,
        funcao: role,
        salario: salary,
        turno: shift,
        condominio: condominiumId,
      }),
    });
    navigation.navigate('Employees');
    setSaving(false);
  };

  if (loading) return <ActivityIndicator size="large" color="#4B7BE5" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Funcionário</Text>
      <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Função" style={styles.input} value={role} onChangeText={setRole} />
      <TextInput placeholder="Salário" style={styles.input} value={salary} onChangeText={setSalary} keyboardType="numeric" />
      <TextInput placeholder="Turno" style={styles.input} value={shift} onChangeText={setShift} />
      <Text style={styles.label}>Condomínio</Text>
      <Picker selectedValue={condominiumId} onValueChange={(itemValue) => setCondominiumId(itemValue)}>
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
      <Button title="Voltar" onPress={() => navigation.navigate('Employees')} />
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

export default CreateEmployeeScreen;
