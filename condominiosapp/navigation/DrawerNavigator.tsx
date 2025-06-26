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

// Residents
import ResidentScreen from '../screens/residents/ResidentScreen';
import CreateResidentScreen from '../screens/residents/CreateResidentScreen';
import EditResidentScreen from '../screens/residents/EditResidentScreen';

// Employees
import EmployeeScreen from '../screens/employees/EmployeeScreen';
import CreateEmployeeScreen from '../screens/employees/CreateEmployeeScreen';
import EditEmployeeScreen from '../screens/employees/EditEmployeeScreen';

// Common Areas
import CommonAreasScreen from '../screens/commonareas/CommonAreasScreen';
import CreateCommonAreaScreen from '../screens/commonareas/CreateCommonAreaScreen';
import EditCommonAreaScreen from '../screens/commonareas/EditCommonAreaScreen';

// Common Areas Reservations
import CommonAreaReservationsScreen from '../screens/commonareareservations/CommonAreaReservationsScreen';
import CreateCommonAreaReservationScreen from '../screens/commonareareservations/CreateCommonAreaReservationScreen';
import EditCommonAreaReservationScreen from '../screens/commonareareservations/EditCommonAreaReservationScreen';



export type DrawerParamList = {
    Home: undefined;
    Condominiums: undefined;
    CreateCondominium: undefined;
    EditCondominium: { id: number, nome: string, endereco: string, cnpj: string, quantidade_blocos: number };
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
    Residents: undefined;
    CreateResident: undefined;
    EditResident: {
        id: number;
        name: string;
        cpf: string;
        phone: string;
        email: string;
        apartment: number;
    };
    Employees: undefined;
    CreateEmployee: undefined;
    EditEmployee: {
        id: number;
        name: string;
        role: string;
        salary: string;
        shift: string;
        condominium: number;
    };
    CommonAreas: undefined;
    CreateCommonArea: undefined;
    EditCommonArea: {
        id: number;
        name: string;
        capacity: number;
        openingTime: string;
        closingTime: string;
        condominium: number;
    };
    CommonAreaReservations: undefined;
    CreateCommonAreaReservation: undefined;
    EditCommonAreaReservation: {
        id: number;
        reservationDate: string;
        status: string;
        resident: number;
        commonArea: number;
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
                name="Condominiums"
                component={CondominiumScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="business" size={size} color={color} />,
                    title: 'Condomínios',
                }}
            />
            <Drawer.Screen
                name="CreateCondominium"
                component={CreateCondominiumScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Condomínio' }}
            />
            <Drawer.Screen
                name="EditCondominium"
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
            {/* Residents */}
            <Drawer.Screen
                name="Residents"
                component={ResidentScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
                    title: 'Moradores',
                }}
            />

            <Drawer.Screen
                name="CreateResident"
                component={CreateResidentScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Morador' }}
            />

            <Drawer.Screen
                name="EditResident"
                component={EditResidentScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Morador' }}
            />
            {/* End Residents */}
            {/* Employees */}
            <Drawer.Screen
                name="Employees"
                component={EmployeeScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="construct-outline" size={size} color={color} />,
                    title: 'Funcionários',
                }}
            />

            <Drawer.Screen
                name="CreateEmployee"
                component={CreateEmployeeScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Funcionário' }}
            />

            <Drawer.Screen
                name="EditEmployee"
                component={EditEmployeeScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Funcionário' }}
            />
            {/* End Employees */}
            {/* Common Areas */}
            <Drawer.Screen
                name="CommonAreas"
                component={CommonAreasScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
                    title: 'Áreas Comuns',
                }}
            />
            <Drawer.Screen
                name="CreateCommonArea"
                component={CreateCommonAreaScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Nova Área Comum' }}
            />
            <Drawer.Screen
                name="EditCommonArea"
                component={EditCommonAreaScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Área Comum' }}
            />
            {/* End Common Areas */}
            {/* Common Areas Reservations */}
            <Drawer.Screen
                name="CommonAreaReservations"
                component={CommonAreaReservationsScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
                    title: 'Reservas Áreas Comuns',
                }}
            />

            <Drawer.Screen
                name="CreateCommonAreaReservation"
                component={CreateCommonAreaReservationScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Nova Reserva' }}
            />

            <Drawer.Screen
                name="EditCommonAreaReservation"
                component={EditCommonAreaReservationScreen}
                options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Reserva' }}
            />
            {/* End Common Areas Reservations */}
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
