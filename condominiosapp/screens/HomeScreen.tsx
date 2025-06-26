import { DrawerScreenProps } from '@react-navigation/drawer';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { DrawerParamList } from '../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => (
  <View style={styles.container}>
    <Text style={styles.welcomeText}>Bem-vindo ao App de Condomínios!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
  },
});

export default HomeScreen;
