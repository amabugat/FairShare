import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import ProfileImage from './ProfileImage';
import { Container, Content, Icon, Thumbnail } from 'native-base'

export default class ProfilePage extends React.Component {

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
                            <Text style = {styles.textField}>Email: test@gmail.com</Text>

                            <Text style = {styles.textField}>Paypal: @FairShare</Text>

                            <Text style = {styles.textField}>Date Joined: Jan 17, 2019</Text>
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

