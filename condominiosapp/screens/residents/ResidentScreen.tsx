import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

// Resident type
export type Resident = {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    email: string;
    apartment: number;
};

type Props = DrawerScreenProps<DrawerParamList, 'Residents'>;

const ResidentScreen = ({ navigation }: Props) => {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [loading, setLoading] = useState(true);
    // Novos estados para filtros
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [apartamento, setApartamento] = useState('');

    const fetchResidents = async (params?: { nome?: string; cpf?: string; apartamento?: string }) => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/moradores/`;
            const query: string[] = [];
            if (params) {
                if (params.nome) query.push(`nome=${encodeURIComponent(params.nome)}`);
                if (params.cpf) query.push(`cpf=${encodeURIComponent(params.cpf)}`);
                if (params.apartamento) query.push(`apartamento=${encodeURIComponent(params.apartamento)}`);
            }
            if (query.length > 0) {
                url += '?' + query.join('&');
            }
            const response = await fetch(url, {
                headers: { Authorization: `Token ${API_TOKEN}` },
            });
            const data = await response.json();
            setResidents(
                data.map((item: any) => ({
                    id: item.id,
                    name: item.nome,
                    cpf: item.cpf,
                    phone: item.telefone,
                    email: item.email,
                    apartment: item.apartamento,
                }))
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to load residents.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchResidents();
        }, [])
    );

    const handleDelete = async (id: number) => {
        Alert.alert('Delete Resident', 'Are you sure you want to delete this resident?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    try {
                        await fetch(`${API_BASE_URL}/moradores/${id}/`, {
                            method: 'DELETE',
                            headers: { Authorization: `Token ${API_TOKEN}` },
                        });
                        setResidents(prev => prev.filter(r => r.id !== id));
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete resident.');
                    }
                }
            }
        ]);
    };

    const handleSearch = () => {
        fetchResidents({ nome, cpf, apartamento });
    };

    const renderItem = ({ item }: { item: Resident }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>CPF: {item.cpf}</Text>
            <Text style={styles.description}>Telefone: {item.phone}</Text>
            <Text style={styles.description}>Email: {item.email}</Text>
            <Text style={styles.description}>Apartamento ID: {item.apartment}</Text>
            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditResident', item)}
                >
                    <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <Text style={styles.editText}>Deletar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Moradores</Text>
            {/* Campos de busca */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                />
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="CPF"
                    value={cpf}
                    onChangeText={setCpf}
                />
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Apartamento (ID)"
                    value={apartamento}
                    onChangeText={setApartamento}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#4B7BE5" />
            ) : (
                <FlatList
                    data={residents}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum morador encontrado!</Text>}
                />
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateResident')}
                accessibilityLabel="Add Resident"
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 12
    },
    card: {
        backgroundColor: '#f0f4ff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12
    },
    name: {
        fontSize: 18,
        fontWeight: '600'
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginTop: 4
    },
    row: {
        flexDirection: 'row',
        marginTop: 12
    },
    editButton: {
        backgroundColor: '#4B7BE5',
        padding: 8,
        borderRadius: 6,
        marginRight: 8
    },
    deleteButton: {
        backgroundColor: '#E54848',
        padding: 8,
        borderRadius: 6
    },
    editText: {
        color: '#fff',
        fontWeight: '500'
    },
    fab: {
        position: 'absolute', right: 20, bottom: 20,
        backgroundColor: '#0D47A1', borderRadius: 28,
        padding: 14, elevation: 4
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 40,
        fontSize: 16
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontSize: 15,
        marginRight: 4,
    },
    searchButton: {
        backgroundColor: '#4B7BE5',
        padding: 10,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ResidentScreen;
