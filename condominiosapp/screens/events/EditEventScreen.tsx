import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'EditEvent'>;

type Resident = {
  id: number;
  name: string;
};

const EditEventScreen = ({ route, navigation }: Props) => {
  const { id, name: nameInit, location: locationInit, date: dateInit, time: timeInit, resident: residentInit } = route.params;

  const [name, setName] = useState(nameInit);
  const [location, setLocation] = useState(locationInit);
  const [date, setDate] = useState(dateInit);
  const [time, setTime] = useState(timeInit);
  const [residentId, setResidentId] = useState<number | null>(residentInit);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchResidents = async () => {
    const res = await fetch(`${API_BASE_URL}/moradores/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    const data = await res.json();
    setResidents(data.map((m: any) => ({ id: m.id, name: m.nome })));
    setLoading(false);
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API_BASE_URL}/eventos/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
      body: JSON.stringify({
        nome: name,
        local: location,
        data: date,
        horario: time,
        morador: residentId,
      }),
    });
    navigation.navigate('Events');
    setSaving(false);
  };

  if (loading) return <ActivityIndicator size="large" color="#4B7BE5" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Evento</Text>
      <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Local" style={styles.input} value={location} onChangeText={setLocation} />
      <TextInput placeholder="Data (YYYY-MM-DD)" style={styles.input} value={date} onChangeText={setDate} />
      <TextInput placeholder="Horário (HH:MM)" style={styles.input} value={time} onChangeText={setTime} />
      <Text style={styles.label}>Morador</Text>
      <Picker selectedValue={residentId} onValueChange={(itemValue) => setResidentId(itemValue)}>
        <Picker.Item label="Selecione..." value={null} />
        {residents.map(r => (
          <Picker.Item key={r.id} label={r.name} value={r.id} />
        ))}
      </Picker>
      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate('Events')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, alignSelf: 'center' },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
});

export default EditEventScreen;
