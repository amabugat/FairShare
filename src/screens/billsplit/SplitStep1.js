import React from 'react';
import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default class SplitStep1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: this.props.navigation.state.params.amounts,
            tax: null,
            tip: null,
            subtotal: null,
            people: 1,
        }
    }

    renderCal() {
        if (this.state.subtotal === null) {
            return;
        } else {
            return (
                <Text>Final Total Amount is $ {this.state.subtotal.toFixed(4)}</Text>
            );

        }
    }

    render() {
        return (

            <View style={styles.container}>
                <Text style={styles.name}> Total Amount before Tip and Tax is $ {this.state.amount} dollars</Text>

                <Text style={styles.name}>Tip</Text>
                <TextInput
                    style={styles.box}
                    keyboardType = 'numeric'
                    returnKeyType='done'
                    placeholder='%'
                    ref={ti => { this.tipInput = ti }}
                    onChangeText={(tip) => this.setState({tip: parseFloat(tip)})}
                />
                <Text style={styles.name}>Tax</Text>
                <TextInput
                    style={styles.box}
                    keyboardType = 'numeric'
                    returnKeyType='done'
                    placeholder='%'
                    ref={ta => { this.taxInput = ta }}
                    onChangeText={(tax) => this.setState({tax: parseFloat(tax)})}
                />

                {this.renderCal()}

                <TouchableOpacity onPress={() => {
                    if (this.state.tip == null || this.state.tax == null) {
                        Alert.alert ("Please Fill In All The Fields");
                        return;
                    } else {
                        this.setState({
                            subtotal: (this.state.amount + (0.01 * this.state.tip * this.state.amount) +
                                (0.01 * this.state.tax * this.state.amount)),
                        })
                    }
                }

                } style={styles.button1} >
                    <Text style = {styles.buttonText}> Calculate </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    if (this.state.subtotal === null) {
                        Alert.alert("Please Calculate First");
                        return;
                    } else {
                        this.props.navigation.navigate('ChargePeople', {
                            peps: this.state.people,
                            amounts: this.state.subtotal.toFixed(4),
                        });
                    }
                }
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
        //fontFamily: "Raleway-Regular",
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
        //fontFamily: "Raleway-Regular",
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
        //fontFamily: "Raleway-Regular",
        marginTop:20,
        fontSize:25,
        color:'#4f4f69',
        // fontWeight:'bold',
        textAlign: 'center'
    },
    textInput1:{
        //fontFamily: "Raleway-Regular",
        marginTop:10,
    },
    textInput2:{
        //fontFamily: "Raleway-Regular",
        marginBottom:10,
        marginTop:10,
    },
    box: {
        borderRadius: 100,
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'rgba(117,125,117,0.2)',
        color: '#000000',
        width: 120,
        height: 40,
        fontFamily: 'Raleway-Bold',

    },
});