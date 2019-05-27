import React, { Component } from "react";
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Card, Avatar, ListItem, Icon} from 'react-native-elements';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

const alien = require("../../images/logo.png");

export default class ProfilePage extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        password: '',
        phoneNum: '',
        email: '',
        userID: '',
        profileImage: null,
    }
    async componentWillMount(){
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        var userDBref = firebase.database().ref('/Users').child(uid);
        var that = this;
        var userData = '';
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

    renderHeader = () => {
        return (
            <View>
                <View style = {styles.headerColumn}>
                    <Avatar
                        style = {styles.userImage}
                        rounded
                        size = {120}
                        imageProps = {{resizeMode: 'cover'}}
                        source = {this.userPicture(this.state.profileImage)}
                    />
                    <Text style={styles.textField}>{this.state.firstName} {this.state.lastName}</Text>
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
        marginLeft: 125,
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
});

// import React, { Component } from "react";
// import { StyleSheet, Text, View, TouchableOpacity, PixelRatio, Image} from 'react-native';
// import ProfileImage from './ProfileImage';
// import { Container, Content } from 'native-base'
// import firebase from '@firebase/app';
// import '@firebase/auth';
// import '@firebase/database';
//
// export default class ProfilePage extends React.Component {
//
//     state = {
//         firstName: '',
//         lastName: '',
//         password: '',
//         phoneNum: '',
//         email: '',
//         userID: '',
//         profileImage: null,
//     }
//     async componentWillMount(){
//         var user = firebase.auth().currentUser
//         var uid = user.uid;
//         var userDBref = firebase.database().ref('/Users').child(uid);
//         var that = this
//         var userData = ''
// //  const snapshot = userDBref.once('value')
//         await userDBref.on('value', function(snapshot){
//             userData = snapshot.val();
//           //  alert(userData.PhotoURL)
//             that.setState({
//                 firstName: userData.FirstName,
//                 lastName: userData.LastName,
//                 userID: uid,
//                 phoneNum: userData.PhoneNum,
//                 email: userData.Email,
//                 profileImage: userData.PhotoURL,
//             });
//         })
//     }
//     render() {
//         return (
//             <Container style = {styles.container}>
//                 <Content>
//                     <View>
//                       {this.state.profileImage === null ? (
//                         <ProfileImage/>
//                       ) : (
//                         <Image style={styles.avatar} source={{ uri: this.state.profileImage}} />
//                       )}
//
//
//                         <Text style={styles.name}>USERNAME </Text>
//
//                         <View style={{borderBottomColor:'black', borderBottomWidth: 2, width: '100%'}}>
//                         </View>
//
//                         <View>
//                             <Text style = {styles.textField}> First Name: {this.state.firstName}</Text>
//                             <Text style = {styles.textField}> Last Name: {this.state.lastName}</Text>
//                             <Text style = {styles.textField}> Email: {this.state.email}</Text>
//                             <Text style = {styles.textField}> Phone Number: {this.state.phoneNum}</Text>
//
//                             <TouchableOpacity onPress={() =>
//                                 this.props.navigation.navigate('EditProfile')
//                             } style={styles.button1}>
//                                 <Text style = {styles.buttonText}> Edit Profile </Text>
//                             </TouchableOpacity>
//
//                         </View>
//
//                     </View>
//
//                 </Content>
//             </Container>
//
//
//
//         );
//     }
//
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fcfcfe',
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'column',
//     },
//     wrapper: {
//         flex: 1,
//     },
//     button1: {
//         // width: '30%',
//         backgroundColor: '#559535',
//         padding:10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom:10,
//         marginTop:10,
//         elevation: 3,
//     },
//     name:{
//         fontFamily: "Futura-Medium-Italic",
//         fontStyle: 'italic',
//         marginTop:20,
//         fontSize:40,
//         color:'#559535',
//         fontWeight:'bold',
//     },
//     textField: {
//         fontFamily: "Raleway-Regular",
//         alignSelf:'flex-start',
//         fontSize: 20,
//         paddingVertical:20,
//     },
//     buttonText: {
//         fontFamily: "Raleway-Regular",
//         color: 'white',
//     },
//     avatarContainer: {
//       borderColor: '#9B9B9B',
//       borderWidth: 1 / PixelRatio.get(),
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     avatar: {
//       borderRadius: 75,
//       width: 150,
//       height: 150,
//     },
//
// });
