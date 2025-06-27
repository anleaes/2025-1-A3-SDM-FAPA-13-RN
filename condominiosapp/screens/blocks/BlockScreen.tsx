import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { API_BASE_URL, API_TOKEN } from '../../apiConfig';

type Props = DrawerScreenProps<DrawerParamList, 'Blocks'>;

type Block = {
    id: number;
    name: string;
    number: number;
    apartmentsCount: number;
    condominium: number;
};

const BlockScreen = ({ navigation }: Props) => {

    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [apartmentsCount, setApartmentsCount] = useState('');
    const [condominium, setCondominium] = useState('');

    const fetchBlocks = async (params?: { name?: string; number?: string; apartmentsCount?: string; condominium?: string }) => {
        setLoading(true);
        let url = `${API_BASE_URL}/blocos/`;
        const query: string[] = [];
        if (params) {
            if (params.name) query.push(`nome=${encodeURIComponent(params.name)}`);
            if (params.number) query.push(`numero=${encodeURIComponent(params.number)}`);
            if (params.apartmentsCount) query.push(`qtd_apartamentos=${encodeURIComponent(params.apartmentsCount)}`);
            if (params.condominium) query.push(`condominio=${encodeURIComponent(params.condominium)}`);
        }
        if (query.length > 0) {
            url += '?' + query.join('&');
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${API_TOKEN}`,
            },
        });
        const data = await response.json();
        setBlocks(data.map((item: any) => ({
            id: item.id,
            name: item.nome,
            number: item.numero,
            apartmentsCount: item.qtd_apartamentos,
            condominium: item.condominio
        })));
        setLoading(false);
    };

    useFocusEffect(useCallback(() => {
        fetchBlocks();
    }, []));

    const handleSearch = () => {
        fetchBlocks({ name, number, apartmentsCount, condominium });
        Keyboard.dismiss();
    };

    const handleDelete = async (id: number) => {
        await fetch(`${API_BASE_URL}/blocos/${id}/`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${API_TOKEN}`,
            },
        });
        setBlocks(prev => prev.filter(b => b.id !== id));
    };

    const renderItem = ({ item }: { item: Block }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>Apartamentos: {item.apartmentsCount}</Text>
            <Text style={styles.description}>Condomínio ID: {item.condominium}</Text>
            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditBlock', {
                        id: item.id,
                        nome: item.name,
                        numero: item.number,
                        qtd_apartamentos: item.apartmentsCount,
                        condominio: item.condominium
                    })}
                >
                    <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <Text style={styles.editText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <Text style={styles.title}>Blocos</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Número"
                    value={number}
                    onChangeText={setNumber}
                    keyboardType="default"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Qtd. Aptos"
                    value={apartmentsCount}
                    onChangeText={setApartmentsCount}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Condomínio"
                    value={condominium}
                    onChangeText={setCondominium}
                    keyboardType="default"
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#4B7BE5" />
            ) : (
                <FlatList
                    data={blocks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateBlock')}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#f0f4ff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    row: {
        flexDirection: 'row',
        marginTop: 12,
    },
    editButton: {
        backgroundColor: '#4B7BE5',
        padding: 8,
        borderRadius: 6,
        marginRight: 8,
    },
    deleteButton: {
        backgroundColor: '#E54848',
        padding: 8,
        borderRadius: 6,
    },
    editText: {
        color: '#fff',
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#0D47A1',
        borderRadius: 28,
        padding: 14,
        elevation: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 6,
    },
    input: {
        flex: 1,
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

export default BlockScreen;
