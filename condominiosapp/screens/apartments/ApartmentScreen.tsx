import { API_BASE_URL, API_TOKEN } from '../../apiConfig';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Apartments'>;

type Apartment = {
    id: number;
    number: string;
    floor: number;
    area: number;
    garageSpots: number;
    block: number;
};

const ApartmentScreen = ({ navigation }: Props) => {

    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(true);
    const [number, setNumber] = useState('');
    const [floor, setFloor] = useState('');
    const [block, setBlock] = useState('');

    const fetchApartments = async (params?: { number?: string; floor?: string; block?: string }) => {
        setLoading(true);
        let url = `${API_BASE_URL}/apartamentos/`;
        const query: string[] = [];
        if (params) {
            if (params.number) query.push(`numero=${encodeURIComponent(params.number)}`);
            if (params.floor) query.push(`andar=${encodeURIComponent(params.floor)}`);
            if (params.block) query.push(`bloco=${encodeURIComponent(params.block)}`);
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
        setApartments(data.map((item: any) => ({
            id: item.id,
            number: item.numero,
            floor: item.andar,
            area: item.metragem,
            garageSpots: item.vagas_garagem,
            block: item.bloco
        })));
        setLoading(false);
    };

    useFocusEffect(useCallback(() => {
        fetchApartments();
    }, []));

    const handleDelete = async (id: number) => {
        await fetch(`${API_BASE_URL}/apartamentos/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${API_TOKEN}`,
            },
        });
        setApartments(prev => prev.filter(a => a.id !== id));
    };

    const handleSearch = () => {
        fetchApartments({ number, floor, block });
        Keyboard.dismiss();
    };

    const renderItem = ({ item }: { item: Apartment }) => (
        <View style={styles.card}>
            <Text style={styles.name}>Número: {item.number}</Text>
            <Text style={styles.description}>Andar: {item.floor}</Text>
            <Text style={styles.description}>Bloco: {item.block}</Text>
            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditApartment', {
                        id: item.id,
                        numero: item.number,
                        andar: item.floor,
                        metragem: item.area,
                        vagas_garagem: item.garageSpots,
                        bloco: item.block
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
            <Text style={styles.title}>Apartamentos</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Número"
                    value={number}
                    onChangeText={setNumber}
                    keyboardType="default"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Andar"
                    value={floor}
                    onChangeText={setFloor}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Bloco"
                    value={block}
                    onChangeText={setBlock}
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
                    data={apartments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateApartment')}
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

export default ApartmentScreen;
