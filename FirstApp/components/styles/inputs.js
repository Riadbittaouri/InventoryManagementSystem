import React , { useContext } from 'react';
import {StyleSheet} from 'react-native';

const inputs = (appSettings) => StyleSheet.create({

 textInput:{
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
 },
 
 inputContainer:{
   backgroundColor: ('backgroundColor' in appSettings) ? appSettings['backgroundColor'] : '#FFFFFF',
   color: ('foregroundColor' in appSettings) ? appSettings['foregroundColor'] : '#FFFFFF',
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center',
   width:"100%"
},
inputField:{
    width: 350,
    height: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
},
addlabelinfoinput: {
   width: '80%',
   height: 40,
   borderColor: 'gray',
   borderWidth: 1,
   marginBottom: 10,
   paddingHorizontal: 10,
},


});

export default inputs;
