import React , { useContext } from 'react';
import {StyleSheet} from 'react-native';

const buttons = (appSettings) => StyleSheet.create({

    login:{
        width: "50%", 
        height: 50, 
        backgroundColor: '#007AFF', 
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25, 
    },


    searchbutton:{
        width:"100%",
        height: 50, 
        backgroundColor: '#333A73', 
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25, 
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    logoutButton:{
        width:"30%",
        borderRadius:8,
        height:30,
        backgroundColor:"#FF0000"
    }
});

export default buttons;