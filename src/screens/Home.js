import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import ProfileImage from './ProfileImage'

export default class Home extends React.Component {
    render() {
        return (

            <View style={styles.container}>
                <ProfileImage/>
                <TextInput style={styles.textInput1} placeholder='Username or Email' />
                <TextInput style={styles.textInput2} placeholder='Password' />

                <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate('Friends')
                    } style={styles.button1}>
                    <Text style = {styles.buttonText}> Login </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate('Friends')
                } style={styles.button2}>
                    <Text style = {styles.buttonText}> Sign Up </Text>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcfe',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    button1: {
        width: '30%',
        backgroundColor: '#559535',
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10,
        marginTop:10,
        elevation: 3,
    },
    button2: {
        width: '30%',
        backgroundColor: '#3d3e52',
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10,
        marginTop:10,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
    },
    textInput1:{
        marginTop:10,
    },
    textInput2:{
        marginBottom:10,
        marginTop:10,
    }
});
