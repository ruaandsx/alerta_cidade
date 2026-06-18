import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


// ── Telas de autenticação ──────────────────────────────────────────────────────
import WelcomeScreen              from './src/screens/WelcomeScreen';
import LoginScreen                from './src/screens/LoginScreen';
import GoogleLoginScreen          from './src/screens/GoogleLoginScreen';
import PhoneLoginScreen           from './src/screens/PhoneLoginScreen';
import RegisterScreen             from './src/screens/RegisterScreen';
import ForgotPasswordPhoneScreen from './src/screens/ForgotPasswordScreen';
import RegisterSuccessScreen      from './src/screens/RegisterSuccessScreen';
import LoginSuccessScreen         from './src/screens/LoginSuccessScreen';

// ── Telas do usuário comum ─────────────────────────────────────────────────────
import HomeScreen                 from './src/screens/HomeScreen';
import NewReportScreen            from './src/screens/NewReportScreen';
import ReportSuccessScreen        from './src/screens/ReportSuccessScreen';
import ProfileScreen              from './src/screens/ProfileScreen';
import MyDataScreen               from './src/screens/MyDataScreen';
import HistoricoScreen            from './src/screens/HistoricoScreen';
import SupportScreen              from './src/screens/SupportScreen';
import AboutScreen                from './src/screens/AboutScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import ReportDetailScreen from './src/screens/ReportDetailScreen';


// ── Telas do administrador ─────────────────────────────────────────────────────
import AdminHomeScreen            from './src/screens/AdminHomeScreen';
import AdminProfileScreen         from './src/screens/AdminProfileScreen';
import AdminUsersScreen           from './src/screens/AdminUsersScreen';
import AdminReportDetailScreen    from './src/screens/AdminReportDetailScreen';
import { AddUserStep1, AddUserStep2, AddUserStep3 } from './src/screens/AddUserScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >

        {/* ── AUTENTICAÇÃO ── */}
        <Stack.Screen name="Welcome"        component={WelcomeScreen} />
        <Stack.Screen name="Login"          component={LoginScreen} />
        <Stack.Screen name="GoogleLogin"    component={GoogleLoginScreen} />
        <Stack.Screen name="PhoneLogin"     component={PhoneLoginScreen} />
        <Stack.Screen name="Cadastro"       component={RegisterScreen} />
        <Stack.Screen name="EsqueciSenha"   component={ForgotPasswordPhoneScreen} />
        <Stack.Screen name="CadastroSucess" component={RegisterSuccessScreen} />
        <Stack.Screen name="LoginSucess"   component={LoginSuccessScreen} />

        {/* ── USUÁRIO COMUM ── */}
        <Stack.Screen name="Home"           component={HomeScreen} />
        <Stack.Screen name="NewReport"      component={NewReportScreen} />
        <Stack.Screen name="ReportSuccess"  component={ReportSuccessScreen} />
        <Stack.Screen name="ReportDetail"   component={ReportDetailScreen} />
        <Stack.Screen name="Profile"        component={ProfileScreen} />
        <Stack.Screen name="MeusDados"      component={MyDataScreen} />
        <Stack.Screen name="Historico"      component={HistoricoScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Ajuda" component={HelpSupportScreen} />
        <Stack.Screen name="SobreObservaCidade" component={AboutScreen} />

        {/* ── ADMINISTRADOR ── */}
        <Stack.Screen name="AdminHome"      component={AdminHomeScreen} />
        <Stack.Screen name="AdminProfile"   component={AdminProfileScreen} />
        <Stack.Screen name="AdminUsers"     component={AdminUsersScreen} />
        <Stack.Screen name="AdminReportDetail" component={AdminReportDetailScreen} />
        <Stack.Screen name="AddUserStep1"   component={AddUserStep1} />
        <Stack.Screen name="AddUserStep2"   component={AddUserStep2} />
        <Stack.Screen name="AddUserStep3"   component={AddUserStep3} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
