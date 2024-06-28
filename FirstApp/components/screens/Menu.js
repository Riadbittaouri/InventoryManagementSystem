import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function Menu({ navigation }) {
    const handleWarehousePress = () => {
        navigation.navigate('Home'); 
    };

    const handleSuperMarketPress = () => {
        navigation.navigate('SuperMarket'); 
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleWarehousePress}>
                    <Text style={styles.buttonText}>Warehouse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSuperMarketPress}>
                    <Text style={styles.buttonText}>Super Market</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 25,
        paddingHorizontal: 40,
        borderRadius: 15,
        marginBottom: 30,
        width:300
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Menu;
