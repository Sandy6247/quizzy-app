import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuizScreen from './screens/QuizScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#F8004E',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Quizzy' }} />
        {/* <Stack.Screen name="Quiz" component={QuizScreen} /> */}
        <Stack.Screen name="Quiz" component={QuizScreen} initialParams={{ questionIndex: 0 }} />

      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({});
