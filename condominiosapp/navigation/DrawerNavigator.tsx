import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import HomeScreen from '../screens/HomeScreen';

// Condominios
import CondominiumScreen from '../screens/condominiums/CondominiumScreen';
import CreateCondominiumScreen from '../screens/condominiums/CreateCondominiumScreen';
import EditCondominiumScreen from '../screens/condominiums/EditCondominiumScreen';

export type DrawerParamList = {
    Home: undefined;
    Condominios: undefined;
    CreateCondominio: undefined;
    EditCondominio: { id: number, nome: string, endereco: string, cnpj: string, quantidade_blocos: number };
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
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
