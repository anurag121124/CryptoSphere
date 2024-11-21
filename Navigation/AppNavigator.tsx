import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "@/app/screen/auth/login";
import Signup from "@/app/screen/auth/signup";
import Home from "@/app/screen/Home/home";

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#121212" },
        presentation: "card",
      }}
    >
     
     <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: "Login",
        }}
      />
      
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          title: "Sign Up",
        }}
      />
      <Stack.Screen name="Home" component={Home} />
    
    </Stack.Navigator>
  );
};

// If you need a standalone app component:
