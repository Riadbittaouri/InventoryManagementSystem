import React, { useContext } from "react"; 
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "../screens/landing";
import Login from "../screens/login";
import Home from "../screens/home";
import AddLabelInfo from "../screens/AddLabelInfo"; 
import Menu from "../screens/Menu"; 
import { Context } from "../globalContext/globalContext.js";
import SuperMarket from "../screens/SuperMarket";

const Stack = createStackNavigator();

function Navigator() {
  const { isLoggedIn } = useContext(Context);

  return (
    <Stack.Navigator initialRouteName="Login">
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="AddLabelInfo" component={AddLabelInfo} options={{ headerShown: false }} /> 
          <Stack.Screen name="SuperMarket" component={SuperMarket} options={{ headerShown: false }} /> 
          
        </>
      ) : (
        <>
          <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default Navigator;
