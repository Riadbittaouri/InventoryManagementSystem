import React , { useContext } from 'react';
import {StyleSheet, Dimensions} from 'react-native';

const containers = (appSettings) => StyleSheet.create({

    outerPage:{
        
        width: Dimensions.get('window').width ,
        height: Dimensions.get('window').height ,
        backgroundColor: ('backgroundColor' in appSettings) ? appSettings['backgroundColor'] : '#FFFFFF',
        color: ('foregroundColor' in appSettings) ? appSettings['foregroundColor'] : '#000000',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formBox:{
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').height * 0.5,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: "6%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    addlabelinfocontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF', // Replace with your background color
    },
});

export default containers;