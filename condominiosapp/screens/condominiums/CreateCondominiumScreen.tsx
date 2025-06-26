import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'CreateCondominium'>;

const CreateCondominiumScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [blocksCount, setBlocksCount] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API_BASE_URL}/condominio/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
      body: JSON.stringify({
        nome: name,
        endereco: address,
        cnpj: cnpj,
        quantidade_blocos: Number(blocksCount),
      }),
    });
    navigation.navigate('Condominiums');
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Condomínio</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Endereço</Text>
      <TextInput placeholder="Endereço" style={styles.input} value={address} onChangeText={setAddress} />
      <Text style={styles.label}>CNPJ</Text>
      <TextInput placeholder="CNPJ" style={styles.input} value={cnpj} onChangeText={setCnpj} />
      <Text style={styles.label}>Qtd. Blocos</Text>
      <TextInput placeholder="Qtd. Blocos" style={styles.input} keyboardType="numeric" value={blocksCount} onChangeText={setBlocksCount} />

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate('Condominiums')} />
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
    fontSize: 16,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});

export default CreateCondominiumScreen;
