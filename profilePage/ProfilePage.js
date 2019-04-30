import React from "react";
import {StyleSheet, Text, View, TouchableOpacity, ImageBackground} from 'react-native';
import {Card, Avatar, ListItem, Icon} from 'react-native-elements';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

const alien = require("../../images/alien.jpg");
const backgroundImage = require("../../images/greenBG.jpg");
const data = [];

export default class ProfilePage extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        password: '',
        phoneNum: '',
        email: '',
        userID: '',
        profileImage: null,
        items: data,
    };
    async componentWillMount(){
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        var userDBref = firebase.database().ref('/Users').child(uid);
        var that = this;
        var userData = '';
//  const snapshot = userDBref.once('value')
        await userDBref.on('value', function(snapshot){
            userData = snapshot.val();
          //  alert(userData.PhotoURL)
            that.setState({
                firstName: userData.FirstName,
                lastName: userData.LastName,
                userID: uid,
                phoneNum: userData.PhoneNum,
                email: userData.Email,
                profileImage: userData.PhotoURL,
            });
        })
    }

    userPicture = (checkPhoto) => {
        if (checkPhoto == null) {
            return alien
        } else {
            return {uri: checkPhoto}
        }
    };

    getFollowing = () => {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        var that = this;
        var newData = [... that.state.items];
        var requestRef = firebase.database().ref('/Follow').child(uid).child('/Following');
        requestRef.on('child_added', function(data){
            newData.push(data);
            return toString(data.length - 1)
        });
    };

    renderHeader = () => {
        return (
        <View>
            <View style = {styles.headerColumn}>
                <ImageBackground
                    style={styles.bgImage}
                    blurRadius={20}
                    source={backgroundImage}
                >
                <Avatar
                    style = {styles.userImage}
                    rounded
                    size = {120}
                    imageProps = {{resizeMode: 'cover'}}
                    source = {this.userPicture(this.state.profileImage)}
                />
                <Text style={styles.textField}>{this.state.firstName} {this.state.lastName}</Text>
                <Text style={styles.textField2}>hey</Text>
                </ImageBackground>
            </View>
        </View>
        )
    };

    renderSeparator = () => {
        return (
            <View style = {styles.separator}/>
        );
    };

    renderNumber =() => {
        return (
            <ListItem
                titleStyle = {styles.bodyText}
                contentContainerStyle = {styles.numberTextStyle}
                title = {this.state.phoneNum}
                subtitle = 'Mobile'
                leftIcon = {<Icon
                                containerStyle = {styles.numberIconStyles}
                                size = {50}
                                name = 'mobile'
                                type = 'font-awesome'/>}
            />
        )
    };

    renderEmail =() => {
        return (
            <ListItem
                titleStyle = {styles.bodyText}
                contentContainerStyle = {styles.emailTextStyle}
                title = {this.state.email}
                subtitle = 'Email'
                leftIcon = {<Icon
                                titleStyle = {styles.bodyText}
                                containerStyle = {styles.emailIconStyles}
                                size = {26}
                                name = 'envelope'
                                type = 'font-awesome'
                            />}
            />
        )
    };

    render() {
        return (
            <View style = {styles.container}>
                <Card containerStyle = {styles.cardContainer}>
                    {this.renderHeader()}
                    {this.renderNumber()}
                    {this.renderSeparator()}
                    {this.renderEmail()}
                </Card>
                <View style = {styles.buttonRow}>
                    <TouchableOpacity onPress={() =>
                        this.props.navigation.navigate('EditProfile')
                    } style={styles.button1}>
                        <Text style = {styles.buttonText1}> Edit Profile </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>
                        this.props.navigation.navigate('Search')
                    } style={styles.button2}>
                        <Text style = {styles.buttonText2}> Charge </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    separator: {
        height: 1,
        backgroundColor: "#CED0CE",
    },
    button1: {
        backgroundColor: '#559535',
        padding:10,
        height: 40,
        borderRadius: 85,
        elevation: 3,
        marginTop: 200,
    },
    button2: {
        backgroundColor: '#559535',
        height: 40,
        width: 95,
        borderRadius: 45,
        padding:10,
        marginTop: 200,
        elevation: 3,
    },
    textField: {
        fontFamily: "Raleway-Regular",
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        marginBottom: 15,
    },
    textField2: {
        fontFamily: "Raleway-Regular",
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        marginBottom: 15,
    },
    buttonText1: {
        fontFamily: "Raleway-Regular",
        textAlign: 'center',
        color: 'white',
    },
    buttonText2: {
        fontFamily: "Raleway-Regular",
        textAlign: 'center',
        color: 'white',
    },
    headerColumn: {
        backgroundColor: '#559535',
    },
    userImage: {
        borderColor: 'white',
        borderRadius: 85,
        borderWidth: 3,
        height: 120,
        marginBottom: 15,
        width: 120,
        marginTop: 15,
        marginLeft: 130,
    },
    cardContainer: {
        backgroundColor: '#FFF',
        borderWidth: 0,
        flex: 1,
        margin: 0,
        padding: 0,
    },
    numberContainer: {
        backgroundColor: '#FFF',
        flex: 1,
        paddingTop: 30,
    },
    emailContainer: {
        backgroundColor: '#FFF',
        flex: 1,
        paddingTop: 30,
    },
    numberIconStyles: {
        marginLeft: 12,
    },
    emailIconStyles: {
        marginLeft: 10,
    },
    bodyText: {
        color: 'black',
        paddingBottom: 3,
    },
    emailTextStyle: {
        marginBottom: 5,
        marginLeft: 13,
    },
    numberTextStyle: {
        marginTop: 5,
        marginLeft: 17,
    },
    bgImage: {
        paddingBottom: 20,
        paddingTop: 25,
    }
});
