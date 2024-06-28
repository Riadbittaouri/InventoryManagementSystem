import React , { useContext } from 'react';
import {StyleSheet} from 'react-native';

const fonts = (appSettings) => StyleSheet.create({

    h1:{
        color: ('foregroundColor' in appSettings) ? appSettings['foregroundColor'] : '#000000',
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    p:{
        color: ('foregroundColor' in appSettings) ? appSettings['foregroundColor'] : '#000000',
        fontSize: 16,
        textAlign: 'center',
    },
    inputlabel:{
        color: ('foregroundColor' in appSettings) ? appSettings['foregroundColor'] : '#000000',
        fontSize: 16,
    },
    buttontext:{
        
        color: ('foregroundColor' in appSettings) ? appSettings['foregroundColor'] : '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
    

});

export default fonts;