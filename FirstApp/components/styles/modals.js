import React , { useContext } from 'react';
import {StyleSheet} from 'react-native';

const modals = (appSettings) => StyleSheet.create({


    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },


});
export default modals;