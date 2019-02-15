import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default class SplitStep1 extends React.Component {
    render() {
        return (

            <View style={styles.container}>

                <Text style={styles.name}>How many ways will the bill be split?</Text>
                <TextInput style={styles.textInput1} placeholder='# of ways' />
                <Text style={styles.name}>Tip</Text>
                <TextInput style={styles.textInput2} placeholder='$' />
                <Text style={styles.name}>Tax</Text>
                <TextInput style={styles.textInput2} placeholder='$' />

                <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate('SplitStep2')
                } style={styles.button1}>
                    <Text style = {styles.buttonText}> Next </Text>
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
    button2: {
        fontFamily: "Raleway-Regular",
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
    name:{
        fontFamily: "Raleway-Regular",
        marginTop:20,
        fontSize:25,
        color:'#4f4f69',
        // fontWeight:'bold',
        textAlign: 'center'
    },
    textInput1:{
        fontFamily: "Raleway-Regular",
        marginTop:10,
    },
    textInput2:{
        fontFamily: "Raleway-Regular",
        marginBottom:10,
        marginTop:10,
    }
});
