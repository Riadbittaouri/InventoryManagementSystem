import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { Context } from "../globalContext/globalContext.js";
import containers from '../styles/containers.js';
import fonts from '../styles/fonts.js';
import buttons from '../styles/buttons.js';
import margins from '../styles/margins.js';

function Landing() {
    const globalContext = useContext(Context);
    const { isLoggedIn, appSettings } = globalContext;
    const navigation = useNavigation(); 

    return (
      <View style={containers(appSettings).outerPage}>
        <Text style={fonts(appSettings).h1}>Login to use scanner</Text>
        <TouchableOpacity style={[buttons(appSettings).login,margins.allTenPercent]} onPress={() => navigation.navigate("Login")}> 
            <Text style={fonts(appSettings).buttontext}>Login</Text>
        </TouchableOpacity>
      </View>
    );
}

export default Landing;
