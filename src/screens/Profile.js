import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import ProfileImage from './ProfileImage'
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
export default class Profile extends React.Component {

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
  // const userData = snapshot.val();
  //
  //   this.setState({
  //     firstName: userData.FirstName,
  //     lastName: userData.LastName,
  //     userID: uid,
  //     phoneNum: userData.PhoneNum,
  //     email: userData.Email,
  //   });


    render() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.wrapper} enabled>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <ProfileImage/>

                        <Text style={styles.name}>FAIRSHARE </Text>
                        <Text> First Name: {this.state.firstName}</Text>
                        <Text> Last Name: {this.state.lastName}</Text>
                        <Text> Last Name: {this.state.email}</Text>
                        <Text> Last Name: {this.state.phoneNum}</Text>










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
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
