import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();
    const goToQuizScreen = () => {
        navigation.navigate('Quiz');
    };

    return (
        <View>
            <Image
                style={{ width: '100%', height: 350, resizeMode: 'contain', marginTop: 0, marginBottom: 20 }}
                source={require('../assets/logo.jpg')} />
            <Text style={{ textAlign: 'center', color: '#F8004E', fontSize: 23, fontWeight: 600 }}>
                Game Rules
            </Text>
            <View style={{ padding: 10, backgroundColor: '#FEBD1B', borderRadius: 6, margin: 6, marginBottom: 35 }}>
                <Text style={styles.rules}>
                   No negative scoring
                </Text>
                <Text style={styles.rules}>
                    1 point per question
                </Text>
                <Text style={styles.rules}>
                    Difficulty from easy to difficult
                </Text>
            </View>
            <Pressable onPress={goToQuizScreen} style={styles.btn}>
                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 25, fontWeight: 600 }}>Start quizz</Text>
            </Pressable>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    rules: {
        color: '#fff',
        fontSize: 16,
        margin: 10,
        textAlign: 'center',
    },
    btn: {
        backgroundColor: '#F8004E',
        padding: 14,
        marginTop: 20,
        marginLeft: 50,
        marginRight: 50,
        borderRadius: 6,
        marginHorizontal: 'auto',
        alignItems: 'center'
    }
})