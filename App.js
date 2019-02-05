/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';

import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/database';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });
const firebaseConfig = {
    apiKey: "AIzaSyAVTfoYm9xKwrHu-jwSzJOye1XRCJBYuz0",
    authDomain: "fairshare-96c68.firebaseapp.com",
    databaseURL: "https://fairshare-96c68.firebaseio.com",
    projectId: "fairshare-96c68",
    storageBucket: "fairshare-96c68.appspot.com",
  };


firebase.initializeApp(firebaseConfig);

export default class App extends Component {
  state = {
    firstname: ' ',
    lastname: '',
    email: '',
    password: '',
    confirm_password: ''
  }


  render() {
    const { container,
            wrapper,
            header,
            textInput,
            btn,
            btnText
    } = styles;

    const { firstname,
            lastname,
            email,
            password,
            confirm_password
    } = this.state;
    return (
      <KeyboardAvoidingView behavior='padding' style={wrapper} enabled>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={container}>
            <Text style={header}>SIGN UP</Text>

            <TextInput style={textInput} placeholder='First Name'
              onChangeText={(firstname) => this.setState({firstname}) }
              underlineColorAndroid='transparent'
              // onBlur={() => alert("blurred")}
            />

            <TextInput style={textInput} placeholder='Last Name'
              onChangeText={(lastname) => this.setState({lastname}) }
              underlineColorAndroid='transparent'
            />

            <TextInput style={textInput} placeholder='Email'
              onChangeText={(email) => this.setState({email}) }
              underlineColorAndroid='transparent'
            />

            <TextInput
              password={true}
              secureTextEntry={true}
              style={textInput}
              placeholder='Password'
              onChangeText={(password) => this.setState({password}) }
              underlineColorAndroid='transparent'
            />

            <TextInput
              password={true}
              secureTextEntry={true}
              style={textInput}
              placeholder='Confirm Password'
              onChangeText={
                (confirm_password) => this.setState({confirm_password})
              }
              underlineColorAndroid='transparent'
            />

            <TouchableOpacity
              style={btn}
              onPress={
                () => this.signmeup(firstname, lastname, email, password, confirm_password)
            }>
              <Text style={btnText}> Sign up </Text>
            </TouchableOpacity>


          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }


  nameIsNull(first, last) {
    // check if firstname/lastname are filled out
    if (!first || first.length === 0 ) {
      alert("Please enter your first name");
      return true;
    }
    if (!last || last.length === 0 ) {
      alert("Please enter your last name");
      return true;
    }
    return false;
  }

  passwordDontMatch(password, confirm_password) {
    if (password != confirm_password) {
      alert("Passwords don't match");
      return true;
    }
    return false;
  }

  signmeup = (first, last, email, password, confirm_password) => {
    // const { navigate } = this.props.navigation;
    //alert('testing');
    if (this.nameIsNull(first, last) ||
        this.passwordDontMatch(password, confirm_password))
      return;

    try {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(
        function(user) {

          alert("congrats you signed up")
          // Store user's information in Users table
          // navigate('Welcome');
          // this.props.navigation.navigate('Welcome');
        }
      ).catch(
        function(error) {
          alert(error.toString());
        }
      )
    } catch(error) {
      alert(error.toString());
    }
  }
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  // backgroundColor: '#2896d3',
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: 40,
  paddingRight: 40,
},
wrapper: {
  flex: 1,
},
header: {
  fontSize:24,
  marginBottom:60,
  color: '#000',
  fontWeight: 'bold',
},
textInput: {
  alignSelf: 'stretch',
  padding: 15,
  marginBottom: 20,
  backgroundColor: '#fff'
},
btn: {
  alignSelf: 'stretch',
  backgroundColor: '#000',
  // color: '#fff',
  padding: 20,
  alignItems: 'center',
  margin: 8
},
btnText: {
  color: '#fff',
  fontWeight: 'bold'
}
});
