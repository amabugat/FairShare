import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, ScrollView} from 'react-native';
import ActionButton from "react-native-circular-action-menu";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Groups extends React.Component {
    render() {
        return (
            //<ScrollView>
            <View style={styles.container}>

                <Text>GROUPS</Text>

                <ActionButton buttonColor="#559535">
                    <ActionButton.Item buttonColor='#9b59b6' title="Home" onPress={() =>
                        this.props.navigation.navigate('Home')
                    }>
                        <Icon name="home" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Profile" onPress={() => console.log("notes tapped!")}>
                        <Icon name="face" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Split New Bill"  onPress={() =>
                        this.props.navigation.navigate('BillPrompt')
                    }>
                        <Icon name="receipt" style={styles.actionButtonIcon} />
                    </ActionButton.Item>

                    <ActionButton.Item buttonColor='#1abc9c' title="GroupsAdd" onPress={() =>
                        this.props.navigation.navigate('SearchFriends')
                    }>
                        <Icon name="group" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>

            </View>
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
        marginBottom:10,
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