import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'CreateResident'>;

type Apartment = {
    id: number;
    number: string;
};

const CreateResidentScreen = ({ navigation }: Props) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [apartmentId, setApartmentId] = useState<number | null>(null);
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchApartments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/apartamentos/`, {
                headers: { Authorization: `Token ${API_TOKEN}` },
            });
            const data = await res.json();
            setApartments(
                data.map((item: any) => ({
                    id: item.id,
                    number: item.numero,
                }))
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to load apartments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApartments();
    }, []);

    const handleSave = async () => {
        if (!name || !phone || !email || !cpf || !apartmentId) {
            Alert.alert('Validation', 'Please fill all fields.');
            return;
        }
        setSaving(true);
        try {
            await fetch(`${API_BASE_URL}/moradores/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${API_TOKEN}`,
                },
                body: JSON.stringify({
                    nome: name,
                    cpf: cpf,
                    telefone: phone,
                    email: email,
                    apartamento: apartmentId,
                }),
            });
            navigation.navigate('Residents');
        } catch (error) {
            Alert.alert('Error', 'Failed to create resident.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#4B7BE5" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Novo Morador</Text>
            <Text style={styles.label}>Nome</Text>
            <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
            <Text style={styles.label}>Telefone</Text>
            <TextInput placeholder="Telefone" style={styles.input} value={phone} onChangeText={setPhone} />
            <Text style={styles.label}>Email</Text>
            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
            <Text style={styles.label}>CPF</Text>
            <TextInput placeholder="CPF" style={styles.input} value={cpf} onChangeText={setCpf} />
            <Text style={styles.label}>Apartamento</Text>
            <Picker
                selectedValue={apartmentId}
                onValueChange={(itemValue) => setApartmentId(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Selecione..." value={null} />
                {apartments.map(a => (
                    <Picker.Item key={a.id} label={`Apt ${a.number}`} value={a.id} />
                ))}
            </Picker>

            {saving ? (
                <ActivityIndicator size="large" color="#4B7BE5" />
            ) : (
                <Button title="Save" onPress={handleSave} color="#4B7BE5" />
            )}
            <Button title="Back" onPress={() => navigation.navigate('Residents')} />
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

export default CreateResidentScreen;
