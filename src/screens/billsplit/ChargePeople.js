import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import ProfileImage from '../profilePage/ProfileImage'
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';


var data = []

export default class ChargePeople extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            people: this.props.navigation.state.params.peps,
            result: this.props.navigation.state.params.amounts,
            emailID: "",
            email: "",
            chargeDescription: "",
            chargingPeople: data,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>

                    <ProfileImage/>
                    <Text style={styles.name}>Please enter {this.state.people} User Email</Text>
                    <Text style={styles.name}>{this.state.result} per person</Text>
                    <Text style={styles.name}>{this.state.emailID}</Text>
                    <TextInput
                        style={styles.textInput1}
                        placeholder='Description '
                        autoCapitalize={'none'}
                        onChangeText={(chargeDescription) => this.setState({chargeDescription})}
                    />
                    <TextInput
                        style={styles.textInput1}
                        placeholder='Email '
                        autoCapitalize={'none'}
                        onChangeText={(email) => this.setState({email})}
                    />
                    <TouchableOpacity
                        style={styles.button1}
                        onPress={() => this.findUID(this.state.email)
                        } >
                        <Text> Find emailID </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button1}
                        onPress={() => this.chargePeople(this.state)
                        } >
                        <Text> Charge Them </Text>
                    </TouchableOpacity>


                    <View>
                        {this.state.chargingPeople.map((data, index) => {
                            return(
                                <Text>{data}</Text>
                            );
                        })}
                    </View>

                </ScrollView>
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
                            if(that.state.chargingPeople.length >= that.state.people)
                            {
                                alert("you have reached the maximum number of users to charge");
                                return;
                            }
                            var newData = [... that.state.chargingPeople]
                            newData.push(user.child("userID").val())

                            that.setState(
                                {
                                    emailID : user.child("userID").val(),
                                    chargingPeople : newData
                                });
                            // that.state.chargingPeople.append(user.child("userID").val()) //dont know if will work

                        } else {
                            alert("User with email " + email + " does not have a uid");
                        }
                    });
                }
            });
        return;
    }

    chargePeople = async (state) => {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        var that = this
        if(user == null){
            alert("not logged in");
            return;
        }
        var userRequestRef = firebase.database().ref('/Payments').child(uid).child('/Requesting')
        for(i = 0; i < state.chargingPeople.length; i++){
            //  console.log(state.chargingPeople[i]);
            var chargedRef = firebase.database().ref('/Payments').child(state.chargingPeople[i]).child('/GettingCharged')
            var key = chargedRef.push().key;
            chargedRef.child(key).set(
                {
                    PaymentTitle: "",
                    Description: that.state.chargeDescription,
                    Amount: that.state.result,
                    Requester: uid,
                    Charged: that.state.chargingPeople[i],
                    RequesterName: "",
                    ChargedName: "",
                    Paid: false,
                }
            );
            userRequestRef.child(key).set(
                {
                    PaymentTitle: "",
                    Description: that.state.chargeDescription,
                    Amount: that.state.result,
                    Requester: uid,
                    Charged: that.state.chargingPeople[i],
                    RequesterName: "",
                    ChargedName: "",
                    Paid: false,
                }
            );
            //    alert(state.chargingPeople[i])

        }

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
        backgroundColor: '#fcfcfe',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    wrapper: {
        flex: 1,
    },
    name:{
        //fontFamily: "Futura-Medium-Italic",
        fontStyle: 'italic',
        marginTop:20,
        fontSize:20,
        color:'#559535',
        fontWeight:'bold',
    },
    button1: {
        //fontFamily: "Raleway-Regular",
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
        //fontFamily: "Raleway-
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
        //fontFamily: "Raleway-Regular",
        height: 40, width: "95%", borderColor: 'gray', borderWidth: 1,  marginBottom: 20,
        paddingLeft: 10,
    },
    textInput2:{
        height: 40, width: "95%", borderColor: 'gray', borderWidth: 1,  marginBottom: 20,
        paddingLeft: 10,
        //fontFamily: "Raleway-Regular",
    }
});