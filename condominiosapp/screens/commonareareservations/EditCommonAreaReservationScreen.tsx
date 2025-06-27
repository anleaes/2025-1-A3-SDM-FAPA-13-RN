import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'EditCommonAreaReservation'>;

type Resident = {
  id: number;
  name: string;
};

type CommonArea = {
  id: number;
  name: string;
};

const EditCommonAreaReservationScreen = ({ route, navigation }: Props) => {
  const { id, reservationDate, status, resident, commonArea } = route.params;

  const [date, setDate] = useState(reservationDate);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [residentId, setResidentId] = useState<number | null>(resident);
  const [commonAreaId, setCommonAreaId] = useState<number | null>(commonArea);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const resResidents = await fetch(`${API_BASE_URL}/moradores/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    const resAreas = await fetch(`${API_BASE_URL}/areascomuns/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
    });
    const residentsData = await resResidents.json();
    const areasData = await resAreas.json();
    setResidents(residentsData.map((item: any) => ({ id: item.id, name: item.nome })));
    setCommonAreas(areasData.map((item: any) => ({ id: item.id, name: item.nome })));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setDate(route.params.reservationDate);
    setCurrentStatus(route.params.status);
    setResidentId(route.params.resident);
    setCommonAreaId(route.params.commonArea);
  }, [route.params]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API_BASE_URL}/reservas/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
      },
      body: JSON.stringify({
        data_reserva: date,
        status: currentStatus,
        morador: residentId,
        area_comum: commonAreaId,
      }),
    });
    navigation.navigate('CommonAreaReservations');
    setSaving(false);
  };

  if (loading) return <ActivityIndicator size="large" color="#4B7BE5" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Reserva</Text>
      <TextInput placeholder="Data (YYYY-MM-DD)" style={styles.input} value={date} onChangeText={setDate} />
      <TextInput placeholder="Status" style={styles.input} value={currentStatus} onChangeText={setCurrentStatus} />
      <Text style={styles.label}>Morador</Text>
      <Picker selectedValue={residentId} onValueChange={(itemValue) => setResidentId(itemValue)}>
        <Picker.Item label="Selecione..." value={null} />
        {residents.map(m => (
          <Picker.Item key={m.id} label={m.name} value={m.id} />
        ))}
      </Picker>
      <Text style={styles.label}>Área Comum</Text>
      <Picker selectedValue={commonAreaId} onValueChange={(itemValue) => setCommonAreaId(itemValue)}>
        <Picker.Item label="Selecione..." value={null} />
        {commonAreas.map(a => (
          <Picker.Item key={a.id} label={a.name} value={a.id} />
        ))}
      </Picker>
      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate('CommonAreaReservations')} />
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

export default EditCommonAreaReservationScreen;
