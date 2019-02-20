import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import ProfileImage from '../ProfileImage';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

export default class ChargePeople extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          people: this.props.navigation.state.params.peps,
          result: this.props.navigation.state.params.amounts,
          emailID: "",
          email: "",
        };
    }

    render() {
        return (

            <View style={styles.container}>
                <ProfileImage/>
                <Text style={styles.name}>{this.state.people}</Text>
                <Text style={styles.name}>{this.state.result} per person</Text>
                <Text style={styles.name}>{this.state.emailID}</Text>
                <TextInput
                    onChangeText={(email) => this.setState({email})}
                />
                <TouchableOpacity onPress={() => this.findUID(this.state.email)
                } >
                    <Text> Find emailID </Text>
                </TouchableOpacity>



                {/*<TouchableOpacity onPress={() =>*/}
                    {/*this.props.navigation.navigate('SplitStep1')*/}
                {/*} style={styles.button1}>*/}
                    {/*<Text style = {styles.buttonText}> Yes </Text>*/}
                {/*</TouchableOpacity>*/}

            </View>
        );
    }

     findUID = async (email) => {
          var ref = firebase.database().ref("/Users");
          var uid = "";
          var that = this;
          await ref.orderByChild("Email").equalTo(email).limitToFirst(1)
            .once("value", snapshot => {
              // console.log(snapshot);
              // console.log(snapshot.key);

              if (snapshot.numChildren() === 0) {
                alert("User not found");
                return;
              } else {
                snapshot.forEach( user => {
                  // console.log(user.key);
                  if (user.child("userID").val()) {
                    that.setState({emailID : user.child("userID").val()});
                  } else {
                    alert("User with email " + email + " does not have a uid");
                  }
                });
              }
            });

          return;
    }
//     joinByEmail(email) {
//   var ref = firebase.database().ref("/Users");
//   var uid = "";
//   ref.orderByChild("Email").equalTo(email).limitToFirst(1)
//     .once("value", snapshot => {
//       // console.log(snapshot);
//       // console.log(snapshot.key);
//
//       if (snapshot.numChildren() === 0) {
//         alert("User not found");
//         return;
//       } else {
//         snapshot.forEach( user => {
//           // console.log(user.key);
//           if (user.child("HouseID").val()) {
//             this.joinHouse(user.child("HouseID").val());
//           } else {
//             alert("User with email " + email + " does not have a house with us");
//           }
//         });
//       }
//     });
//
//   return;
// }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#82b85a',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    button1: {
        width: '30%',
        backgroundColor: '#559535',
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10,
        marginTop:30,
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
        fontFamily: "Raleway-Regular",
        color: 'white',
    },
    name:{
        fontFamily: "Raleway-Regular",
        marginTop:20,
        fontSize:25,
        color:'#fcfcfe',
    },
});
