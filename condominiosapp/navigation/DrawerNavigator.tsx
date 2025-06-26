import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import HomeScreen from '../screens/HomeScreen';

// Condominiums
import CondominiumScreen from '../screens/condominiums/CondominiumScreen';
import CreateCondominiumScreen from '../screens/condominiums/CreateCondominiumScreen';
import EditCondominiumScreen from '../screens/condominiums/EditCondominiumScreen';

// Blocks
import BlockScreen from '../screens/blocks/BlockScreen';
import CreateBlockScreen from '../screens/blocks/CreateBlockScreen';
import EditBlockScreen from '../screens/blocks/EditBlockScreen';

// Apartments
import ApartmentScreen from '../screens/apartments/ApartmentScreen';
import CreateApartmentScreen from '../screens/apartments/CreateApartmentScreen';
import EditApartmentScreen from '../screens/apartments/EditApartmentScreen';

export type DrawerParamList = {
    Home: undefined;
    Condominios: undefined;
    CreateCondominio: undefined;
    EditCondominio: { id: number, nome: string, endereco: string, cnpj: string, quantidade_blocos: number };
    Blocks: undefined;
    CreateBlock: undefined;
    EditBlock: {
        id: number;
        nome: string;
        numero: number;
        qtd_apartamentos: number;
        condominio: number;
    };
    Apartments: undefined;
    CreateApartment: undefined;
    EditApartment: {
        id: number;
        numero: string;
        andar: number;
        metragem: number;
        vagas_garagem: number;
        bloco: number;
    };
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerActiveTintColor: '#4B7BE5',
                drawerLabelStyle: { marginLeft: 0, fontSize: 16 },
                drawerStyle: { backgroundColor: '#fff', width: 250 },
                headerStyle: { backgroundColor: '#4B7BE5' },
                headerTintColor: '#fff',
            }}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                    title: 'Início',
                }}
            />


            {/* Condominiums */}
            <Drawer.Screen
                name="Condominios"
                component={CondominiumScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="business" size={size} color={color} />,
                    title: 'Condomínios',
                }}
            />
            <Drawer.Screen
                name="CreateCondominio"
                component={CreateCondominiumScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Condomínio' }}
            />
            <Drawer.Screen
                name="EditCondominio"
                component={EditCondominiumScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Condomínio' }}
            />
            {/* End Condominiums */}
            {/* Blocks */}
            <Drawer.Screen
                name="Blocks"
                component={BlockScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="business-outline" size={size} color={color} />,
                    title: 'Blocos',
                }}
            />

            <Drawer.Screen
                name="CreateBlock"
                component={CreateBlockScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Bloco' }}
            />

            <Drawer.Screen
                name="EditBlock"
                component={EditBlockScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Bloco' }}
            />
            {/* End Blocks */}
            {/* Apartments */}
            <Drawer.Screen
                name="Apartments"
                component={ApartmentScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                    title: 'Apartamentos',
                }}
            />

            <Drawer.Screen
                name="CreateApartment"
                component={CreateApartmentScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Apartamento' }}
            />

            <Drawer.Screen
                name="EditApartment"
                component={EditApartmentScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Apartamento' }}
            />
            {/* End Apartments */}
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
