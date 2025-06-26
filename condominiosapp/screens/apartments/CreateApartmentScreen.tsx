import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'CreateApartment'>;

type Bloco = {
    id: number;
    numero: number;
};

const CreateApartmentScreen = ({ navigation }: Props) => {

    const [numero, setNumero] = useState('');
    const [andar, setAndar] = useState('');
    const [metragem, setMetragem] = useState('');
    const [vagasGaragem, setVagasGaragem] = useState('');
    const [blocoId, setBlocoId] = useState<number | null>(null);
    const [blocos, setBlocos] = useState<Bloco[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchBlocos = async () => {
        const res = await fetch(`${API_BASE_URL}/blocos/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${API_TOKEN}`,
            },
        });
        const data = await res.json();
        setBlocos(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBlocos();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        await fetch(`${API_BASE_URL}/apartamentos/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${API_TOKEN}`,
            },
            body: JSON.stringify({
                numero,
                andar: Number(andar),
                metragem: Number(metragem),
                vagas_garagem: Number(vagasGaragem),
                bloco: blocoId
            }),
        });
        navigation.navigate('Apartments');
        setSaving(false);
    };

    if (loading) return <ActivityIndicator size="large" color="#4B7BE5" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Novo Apartamento</Text>
            <TextInput placeholder="Número" style={styles.input} value={numero} onChangeText={setNumero} />
            <TextInput placeholder="Andar" style={styles.input} keyboardType="numeric" value={andar} onChangeText={setAndar} />
            <TextInput placeholder="Metragem (m²)" style={styles.input} keyboardType="numeric" value={metragem} onChangeText={setMetragem} />
            <TextInput placeholder="Vagas Garagem" style={styles.input} keyboardType="numeric" value={vagasGaragem} onChangeText={setVagasGaragem} />

            <Text style={styles.label}>Bloco</Text>
            <Picker selectedValue={blocoId} onValueChange={(itemValue: number | null) => setBlocoId(itemValue)}>
                <Picker.Item label="Selecione..." value={null} />
                {blocos.map(b => (
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
        backgroundColor: '#fff'
    },
    title: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 12, 
        alignSelf: 'center' 
    },
    label: { 
        fontWeight: '600', 
        marginTop: 12, 
        marginBottom: 4 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 8, 
        padding: 10, 
        marginBottom: 10 
    },
});

export default CreateApartmentScreen;
