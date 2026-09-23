import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import DashboardScreen from "./src/screen/dashboard_screen";
import registerScreen from "./src/screen/register_screen";
import SplashScreen from "./src/screen/splash_screen";
import LoginScreen from "./src/screen/login_screen";
import Rotas from "./src/screen/rotas_screen";
import API from "./src/screen/api_screen";
import sair from "./src/screen/sair_screen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Register"
          component={registerScreen}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
        />
        <Stack.Screen
          name="Rotas"
          component={Rotas}
        />
        <Stack.Screen
          name="API"
          component={API}
        />
        <Stack.Screen
          name="Sair"
          component={sair}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}