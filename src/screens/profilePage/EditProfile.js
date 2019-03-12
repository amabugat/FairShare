import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import ProfileImage from './ProfileImage';
import DatePicker from 'react-native-datepicker';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
export default class EditProfile extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        password: '',
        phoneNum: '',
        email: '',
        userID: '',
        date: '',
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

                    <DatePicker
                        style={{width: 200}}
                        date={this.state.date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate="1900-01-01"
                        maxDate="2018-12-31"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => {this.setState({date: date})}}
                    />
                    {/*<Text style={styles.name}>DATE INPUT with datepicker </Text>*/}








                    <TouchableOpacity onPress={() =>
                        this.editProfile(this.state.firstName, this.state.lastName, this.state.phoneNum, this.state.date)
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

        );
    }

    editProfile = ( firstName, lastName, phoneNum, date) => {
        var that = this
        var user = firebase.auth().currentUser
        var uid = user.uid;
        var userDBref = firebase.database().ref('/Users').child(uid);
        userDBref.update({
            FirstName: firstName,
            LastName: lastName,
            FullName : firstName + " " + lastName,
            PhoneNum: phoneNum,
            DateofBirth: date,
        });
        alert("saved yay!")
        this.props.navigation.navigate('ProfilePage')
        //go to profile page

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
