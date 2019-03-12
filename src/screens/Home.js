import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
import ProfileImage from './profilePage/ProfileImage';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
export default class Home extends React.Component {

    state = {
        email: '',
        password: '',
        loggedIn: null,
    };

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ loggedIn: true });
            } else {
                this.setState({ loggedIn: false });
            }
        });
    }

    render() {
        switch (this.state.loggedIn) {
            case true:
                return (
                    this.props.navigation.navigate('Activity')
                );
            case false:
                return this.renderContent()
            default:
                return this.renderContent()
        }
    }

    renderContent() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.wrapper} enabled>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <ProfileImage/>

                        <Text style={styles.name}>FAIRSHARE </Text>

                        <TextInput
                            style={styles.textInput1}
                            placeholder='Email '
                            autoCapitalize = {'none'}
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
                            placeholder='Password '
                            autoCapitalize = {'none'}/>

                        <TouchableOpacity onPress={() =>
                            this.login(this.state.email, this.state.password)
                        } style={styles.button1}>
                            <Text style = {styles.buttonText}> LOGIN </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() =>
                            this.signup(this.state.email, this.state.password)
                        } style={styles.button2}>
                            <Text style = {styles.buttonText}> SIGN UP </Text>
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
                    that.props.navigation.navigate('Activity');
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
                firebase.database().ref('/Users').child(userid).set(
                    {
                        userID: userid,
                        Email: email,
                        Password: password,
                        FirstName: "",
                        LastName: "",
                        FullName: "",
                        //JoinDate: new Date().getTime(),
                        DateofBirth: "",
                        Groups: {},
                        PayPal: "",
                        PhoneNum: "",
                    }
                );


                that.props.navigation.navigate('EditProfile');
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