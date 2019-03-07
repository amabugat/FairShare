import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import ProfileImage from './ProfileImage';
import { Container, Content } from 'native-base'
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

export default class ProfilePage extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        password: '',
        phoneNum: '',
        email: '',
        userID: '',
    }
    componentDidMount(){
        var user = firebase.auth().currentUser
        var uid = user.uid;
        var userDBref = firebase.database().ref('/Users').child(uid);
        var that = this
        var userData = ''
//  const snapshot = userDBref.once('value')
        userDBref.on('value', function(snapshot){
            userData = snapshot.val();

            that.setState({
                firstName: userData.FirstName,
                lastName: userData.LastName,
                userID: uid,
                phoneNum: userData.PhoneNum,
                email: userData.Email,
            });
        })
    }
    render() {
        return (
            <Container style = {styles.container}>
                <Content>
                    <View>
                        <ProfileImage/>

                        <Text style={styles.name}>USERNAME </Text>

                        <View style={{borderBottomColor:'black', borderBottomWidth: 2, width: '100%'}}>
                        </View>

                        <View>
                            <Text style = {styles.textField}> First Name: {this.state.firstName}</Text>
                            <Text style = {styles.textField}> Last Name: {this.state.lastName}</Text>
                            <Text style = {styles.textField}> Email: {this.state.email}</Text>
                            <Text style = {styles.textField}> Phone Number: {this.state.phoneNum}</Text>

                            <TouchableOpacity onPress={() =>
                                this.props.navigation.navigate('EditProfile')
                            } style={styles.button2}>
                                <Text style = {styles.buttonText}> Edit Profile </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() =>
                                this.props.navigation.navigate('Friends')
                            } style={styles.button2}>
                                <Text style = {styles.buttonText}> Back </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </Content>
            </Container>



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
    wrapper: {
        flex: 1,
    },
    name:{
        fontFamily: "Futura-Medium-Italic",
        fontStyle: 'italic',
        marginTop:20,
        fontSize:40,
        color:'#559535',
        fontWeight:'bold',
    },
    textField: {
        fontFamily: "Raleway-Regular",
        alignSelf:'flex-start',
        fontSize: 20,
        paddingVertical:20,
    }

});

