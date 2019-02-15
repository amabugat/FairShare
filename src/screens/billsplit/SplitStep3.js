import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Friends from '../Friends';

export default class SplitStep3 extends React.Component {
    render() {
        return (

            <View style={styles.container}>

                <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate('Friends')
                } style={styles.button1}>
                    <Text style = {styles.buttonText}> Charge </Text>
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
        fontFamily: "Raleway-Regular",
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
    buttonText: {
        color: 'white',
    },
    name:{
        fontFamily: "Raleway-Regular",
        marginTop:20,
        fontSize:25,
        color:'#4f4f69',
        fontWeight:'bold',
        textAlign: 'center'
    },
});
