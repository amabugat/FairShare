import React, { Component } from "react";
import {StyleSheet, Text, View, Button, TouchableOpacity, ScrollView} from 'react-native';
import Landing from './Landing.js';
import ActionButton from "react-native-circular-action-menu";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container, Content} from 'native-base'

export default class Friends extends React.Component {
    render() {
        return (
            <Container>
                <Content>
                    <Landing/>
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() =>
                            this.props.navigation.navigate('ViewCharged')
                        } style={styles.button1}>
                            <Text style = {styles.buttonText}> View charged </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() =>
                            this.props.navigation.navigate('ViewRequest')
                        } style={styles.button2}>
                            <Text style = {styles.buttonText}> View your Request </Text>
                        </TouchableOpacity>

                        <ActionButton buttonColor="#559535">
                            <ActionButton.Item buttonColor='#9b59b6' title="Home" onPress={() =>
                                this.props.navigation.navigate('Home')
                            }>
                                <Icon name="home" style={styles.actionButtonIcon} />
                            </ActionButton.Item>
                            <ActionButton.Item buttonColor='#9b59b6' title="Profile"onPress={() =>
                                this.props.navigation.navigate('ProfilePage')
                            }>
                                <Icon name="face" style={styles.actionButtonIcon} />
                            </ActionButton.Item>
                            <ActionButton.Item buttonColor='#3498db' title="Split New Bill"  onPress={() =>
                                this.props.navigation.navigate('BillPrompt')
                            }>
                                <Icon name="receipt" style={styles.actionButtonIcon} />
                            </ActionButton.Item>

                            <ActionButton.Item buttonColor='#1abc9c' title="Groups" onPress={() =>
                                this.props.navigation.navigate('Groups')
                            }>
                                <Icon name="group" style={styles.actionButtonIcon} />
                            </ActionButton.Item>
                        </ActionButton>
                    </View>



                </Content>
            </Container>
            //<ScrollView>

            // </ScrollView>
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
        marginBottom:200,
        marginTop:10,
        elevation: 3,
    },
    buttonText: {
        fontFamily: "Raleway-Regular",
        color: 'white',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',

    },
});