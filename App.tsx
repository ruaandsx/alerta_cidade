<Image
  source={require("./assets/logo.png")}
  style={styles.logoImage}
  resizeMode="contain"
/>;
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./WelcomeScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import GoogleLoginScreen from "./GoogleLoginScreen";
import PhoneLoginScreen from "./src/screens/PhoneLoginScreen";
import RegisterSuccessScreen from "./src/screens/RegisterSuccessScreen";
import LoginSuccessScreen from "./src/screens/LoginSuccessScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import NewReportScreen from "./src/screens/NewReportScreen";
import ReportSuccessScreen from "./src/screens/ReportSuccessScreen";
import MyDataScreen from "./src/screens/MyDataScreen";
import AboutScreen from "./src/screens/AboutScreen";
import HistoricoScreen from "./src/screens/HistoricoScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AdminHomeScreen from "./src/screens/AdminHomeScreen";
import AdminUsersScreen from "./src/screens/AdminUsersScreen";
import {
  AddUserStep1,
  AddUserStep2,
  AddUserStep3,
} from "./src/screens/AddUserScreen";
import AdminReportDetailScreen from "./src/screens /AdminReportDetailScreen";
import AdminProfileScreen from "./src/screens/AdminProfileScreen";

const Stack = createNativeStackNavigator();
const handleGoogle = () => navigation?.navigate("GoogleLogin");
const handlePhoneLogin = () => navigation?.navigate("PhoneLogin");
const handleEsqueci = () => navigation?.navigate("EsqueciSenha");

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={RegisterScreen} />
        <Stack.Screen name="GoogleLogin" component={GoogleLoginScreen} />
        <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
        <Stack.Screen
          name="RegisterSuccess"
          component={RegisterSuccessScreen}
        />
        <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} />
        <Stack.Screen name="EsqueciSenha" component={ForgotPasswordScreen} />
        <Stack.Screen name="NewReport" component={NewReportScreen} />
        <Stack.Screen name="ReportSuccess" component={ReportSuccessScreen} />
        <Stack.Screen name="MyData" component={MyDataScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Historico" component={HistoricoScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
        <Stack.Screen name="AddUserStep1" component={AddUserStep1} />
        <Stack.Screen name="AddUserStep2" component={AddUserStep2} />
        <Stack.Screen name="AddUserStep3" component={AddUserStep3} />
        <Stack.Screen
          name="AdminReportDetail"
          component={AdminReportDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
