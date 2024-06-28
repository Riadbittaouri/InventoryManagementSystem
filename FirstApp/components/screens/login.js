import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Context } from "../globalContext/globalContext.js";
import containers from '../styles/containers.js';
import fonts from '../styles/fonts.js';
import inputs from '../styles/inputs.js';
import margins from '../styles/margins.js';
import buttons from '../styles/buttons.js';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Login({ navigation }) {
  const globalContext = useContext(Context);
  const { setIsLoggedIn, setAuthToken, appSettings, domain } = globalContext;

  const [securePassword, setSecurePassword] = useState(true);
  const [matricule, setMatricule] = useState(""); 
  const [password, setPassword] = useState(""); 

  async function handleLogin() {
    try {
      console.log("Logging in...");
      console.log("Matricule:", matricule);
      console.log("Password:", password);
      
      let body = JSON.stringify({
        'Matricule': matricule,
        'password': password
      });

      const response = await fetch(`${domain}/api/v1.0/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Logged in successfully:", data);
        setIsLoggedIn(true);
        setAuthToken(data.token.access);
        await AsyncStorage.setItem('accessToken', data.token.access);
        // Navigate to the Menu screen upon successful login
        navigation.navigate("Menu");
      } else {
        const errorData = await response.json();
        alert('Connexion échouée \n\n Vérifier votre matricule ou mot de passe')
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

 
  return (
    <View style={styles.container}>
        <Text style={styles.text}>Login</Text>
        <TextInput
            style={styles.input}
            placeholder="Matricule"
            value={matricule}
            onChangeText={text => setMatricule(text)}
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
},
backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
},
text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
},
input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
},
button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
},
buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
},
});

export default Login;