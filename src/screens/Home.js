import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import ProfileImage from './ProfileImage'
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
export default class Home extends React.Component {

    state = {
      email: '',
      password: '',
    }

    render() {
        return (
          <KeyboardAvoidingView behavior='padding' style={styles.wrapper} enabled>
                 <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <ProfileImage/>

                        <TextInput
                        style={styles.textInput1}
                        placeholder='Email'
                        onChangeText={
                          (email) => this.setState({email})}
                        />

                        <TextInput
                        style={styles.textInput2}
                        secureTextEntry={true}
                        value={this.state.password}
                        onChangeText={
                          (password) => this.setState({password})
                        }
                        placeholder='Password' />

                        <TouchableOpacity onPress={() =>
                            this.login(this.state.email, this.state.password)
                            } style={styles.button1}>
                            <Text style = {styles.buttonText}> Login </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() =>
                            this.signup(this.state.email, this.state.password)
                        } style={styles.button2}>
                            <Text style = {styles.buttonText}> Sign Up </Text>
                        </TouchableOpacity>

                    </View>
                  </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
    login = (email, password) => {
          var that = this
          firebase.auth().signInWithEmailAndPassword(email, password)
          .then(
            function(user) {
              that.setState( {password: ''} );
              console.log(user);
              that.props.navigation.navigate('Friends');
            }
          ).catch(
            function(error) {
              alert(error.toString());
            }
          )
      }

      signup = ( email, password) => {
           var that = this
           firebase.auth().createUserWithEmailAndPassword(email, password).then(
             function(user) {
               console.log(user.user.uid);
               console.log(user);
               var userid = user.user.uid;

               // Store user's information in Users table
               // firebase.database().ref('/Users').child(userid).set(
               //   {
               //     FirstName: first,
               //     LastName: last,
               //     Email: email,
               //   }
               // );
               // navigate('Welcome');
               that.props.navigation.navigate('Friends');
             }
           ).catch(
             function(error) {
               alert(error.toString());
             }
           )

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
        marginTop:10,
    },
    textInput2:{
        marginBottom:10,
        marginTop:10,
    }
});
