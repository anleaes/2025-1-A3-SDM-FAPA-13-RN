import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'EditCondominio'>;

const EditCondominiumScreen = ({ route, navigation }: Props) => {

  const { id, nome: nomeInit, endereco: enderecoInit, cnpj: cnpjInit, quantidade_blocos: qtdInit } = route.params;

  const [nome, setNome] = useState(nomeInit);
  const [endereco, setEndereco] = useState(enderecoInit);
  const [cnpj, setCnpj] = useState(cnpjInit);
  const [quantidade_blocos, setQuantidadeBlocos] = useState(String(qtdInit));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const response = await fetch(`${API_BASE_URL}/condominio/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
      body: JSON.stringify({
        nome, endereco, cnpj, quantidade_blocos: Number(quantidade_blocos)
      }),
    });
    navigation.navigate('Condominios');
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Condomínio</Text>
      <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="Endereço" style={styles.input} value={endereco} onChangeText={setEndereco} />
      <TextInput placeholder="CNPJ" style={styles.input} value={cnpj} onChangeText={setCnpj} />
      <TextInput placeholder="Qtd. Blocos" style={styles.input} keyboardType="numeric" value={quantidade_blocos} onChangeText={setQuantidadeBlocos} />

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate('Condominios')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, alignSelf: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
});

export default EditCondominiumScreen;
