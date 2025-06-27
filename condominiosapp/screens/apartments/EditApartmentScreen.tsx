import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'EditApartment'>;

type Bloco = {
    id: number;
    numero: number;
};

const EditApartmentScreen = ({ route, navigation }: Props) => {
    const { id, numero: numberInit, andar: floorInit, metragem: areaInit, vagas_garagem: garageSpotsInit, bloco: blockInit } = route.params;

    const [number, setNumber] = useState(numberInit);
    const [floor, setFloor] = useState(String(floorInit));
    const [area, setArea] = useState(String(areaInit));
    const [garageSpots, setGarageSpots] = useState(String(garageSpotsInit));
    const [blockId, setBlockId] = useState<number | null>(blockInit);
    const [blocks, setBlocks] = useState<Bloco[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchBlocks = async () => {
        const res = await fetch(`${API_BASE_URL}/blocos/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${API_TOKEN}`,
            },
        });
        const data = await res.json();
        setBlocks(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBlocks();
    }, []);

    useEffect(() => {
        setNumber(route.params.numero);
        setFloor(String(route.params.andar));
        setArea(String(route.params.metragem));
        setGarageSpots(String(route.params.vagas_garagem));
        setBlockId(route.params.bloco);
    }, [route.params]);

    const handleSave = async () => {
        setSaving(true);
        await fetch(`${API_BASE_URL}/apartamentos/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${API_TOKEN}`,
            },
            body: JSON.stringify({
                numero: number,
                andar: Number(floor),
                metragem: Number(area),
                vagas_garagem: Number(garageSpots),
                bloco: blockId
            }),
        });
        navigation.navigate('Apartments');
        setSaving(false);
    };

    if (loading) return <ActivityIndicator size="large" color="#4B7BE5" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Apartamento</Text>
            <TextInput placeholder="Número" style={styles.input} value={number} onChangeText={setNumber} />
            <TextInput placeholder="Andar" style={styles.input} keyboardType="numeric" value={floor} onChangeText={setFloor} />
            <TextInput placeholder="Metragem (m²)" style={styles.input} keyboardType="numeric" value={area} onChangeText={setArea} />
            <TextInput placeholder="Vagas Garagem" style={styles.input} keyboardType="numeric" value={garageSpots} onChangeText={setGarageSpots} />

            <Text style={styles.label}>Bloco</Text>
            <Picker selectedValue={blockId} onValueChange={(itemValue: number | null) => setBlockId(itemValue)}>
                <Picker.Item label="Selecione..." value={null} />
                {blocks.map(b => (
                    <Picker.Item key={b.id} label={`Bloco ${b.numero}`} value={b.id} />
                ))}
            </Picker>

            {saving ? (
                <ActivityIndicator size="large" color="#4B7BE5" />
            ) : (
                <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
            )}
            <Button title="Voltar" onPress={() => navigation.navigate('Apartments')} />
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

export default EditApartmentScreen;
