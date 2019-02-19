import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import ProfileImage from './ProfileImage'
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
export default class Home extends React.Component {

    state = {
        firstName: '',
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

                        <TextInput
                            style={styles.textInput1}
                            placeholder='First Name'
                            value={this.state.firstName}
                            onChangeText={
                                (firstName) => this.setState({firstName})}
                        />

                        <TextInput
                            style={styles.textInput2}
                            value={this.state.lastName}
                            onChangeText={
                                (lastName) => this.setState({lastName})
                            }
                            placeholder=' Last Name ' />

                            <TextInput
                                style={styles.textInput2}
                                keyboardType = 'numeric'
                                maxLength={10}
                                value={this.state.phoneNum}
                                onChangeText={
                                    (phoneNum) => this.setState({phoneNum})
                                }
                                placeholder='Phone Number' />

                            <Text>{this.state.email}</Text>

                            <Text style={styles.name}>DATE INPUT with datepicker </Text>








                        <TouchableOpacity onPress={() =>
                            this.editProfile(this.state.firstName, this.state.lastName, this.state.phoneNum)
                        } style={styles.button2}>
                            <Text style = {styles.buttonText}> Save </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() =>
                            this.props.navigation.navigate('Friends')
                        } style={styles.button2}>
                            <Text style = {styles.buttonText}> Cancel </Text>
                        </TouchableOpacity>





                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }

    editProfile = ( firstName, lastName, phoneNum) => {
        var that = this
         var user = firebase.auth().currentUser
         var uid = user.uid;
         var userDBref = firebase.database().ref('/Users').child(uid);
         userDBref.update({
           FirstName: firstName,
           LastName: lastName,
           PhoneNum: phoneNum,
         });
         alert("saved yay!")


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
