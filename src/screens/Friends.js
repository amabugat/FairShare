import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';

export default class Friends extends React.Component {
    render() {
        return (
            <View style={styles.container}>

                <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate('Home')
                } style={styles.button1}>
                    <Text style = {styles.buttonText}> Back to Home </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate('BillPrompt')
                } style={styles.button2}>
                    <Text style = {styles.buttonText}> Split Bill </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate('ViewCharged')
                } style={styles.button2}>
                    <Text style = {styles.buttonText}> View charged </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate('ViewRequest')
                } style={styles.button2}>
                    <Text style = {styles.buttonText}> View your Request </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3d3e52',
        alignItems: 'center',
        justifyContent: 'center',
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
        fontFamily: "Raleway-Regular",
        color: 'white',
    },
});
