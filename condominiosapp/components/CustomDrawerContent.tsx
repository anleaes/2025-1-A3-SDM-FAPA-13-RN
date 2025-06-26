import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Adicione aqui outros elementos customizados se necessário */}
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    padding: 20,
    backgroundColor: '#4B7BE5',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CustomDrawerContent;
