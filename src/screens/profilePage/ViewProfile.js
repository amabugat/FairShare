
import React, { Component } from "react";
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   PixelRatio,
   Image,
   ScrollView
} from "react-native";
import ProfileImage from "./ProfileImage";
import { Container, Content } from "native-base";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";

export default class ViewProfile extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       firstName: "",
       lastName: "",
       password: "",
       phoneNum: "",
       email: "",
       userID: this.props.navigation.state.params.viewUID,
       profileImage: null
     };
     this.chargePeople = this.chargePeople.bind(this);
     this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }
   async componentWillMount() {

      var userDBref = firebase
         .database()
         .ref("/Users")
         .child(this.state.userID);
      var that = this;
      var userData = "";
      //  const snapshot = userDBref.once('value')
      await userDBref.on("value", function(snapshot) {
         userData = snapshot.val();
         //  alert(userData.PhotoURL)
         that.setState({
            firstName: userData.FirstName,
            lastName: userData.LastName,
            phoneNum: userData.PhoneNum,
            email: userData.Email,
            profileImage: userData.PhotoURL
         });
      });
   }
   render() {
      return (
         <ScrollView>
            <Container style={styles.container}>
               <View style={{ alignItems: "center" }}>
                  {this.state.profileImage === null ? (
                     <ProfileImage />
                  ) : (
                     <Image
                        style={styles.avatar}
                        source={{ uri: this.state.profileImage }}
                     />
                  )}

                  <Text style={styles.name}>USERNAME </Text>

                  <View
                     style={{
                        borderBottomColor: "black",
                        borderBottomWidth: 2,
                        width: "100%"
                     }}
                  />

                  <View>
                     <Text style={styles.textField}>
                        {" "}
                        First Name: {this.state.firstName}
                     </Text>
                     <Text style={styles.textField}>
                        {" "}
                        Last Name: {this.state.lastName}
                     </Text>
                     <Text style={styles.textField}>
                        {" "}
                        Email: {this.state.email}
                     </Text>
                     <Text style={styles.textField}>
                        {" "}
                        Phone Number: {this.state.phoneNum}
                     </Text>

                     <TouchableOpacity
                        onPress={() =>
                           this.props.navigation.navigate("EditProfile")
                        }
                        style={styles.button1}
                     >
                        <Text style={styles.buttonText}> Edit Profile </Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </Container>
         </ScrollView>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fcfcfe",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
   },
   wrapper: {
      flex: 1
   },
   button1: {
      // width: '30%',
      borderRadius: 90,
      backgroundColor: "#559535",
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 10,
      elevation: 3
   },
   name: {
      fontFamily: "Futura-Medium-Italic",
      fontStyle: "italic",
      marginTop: 20,
      fontSize: 40,
      color: "#559535",
      fontWeight: "bold"
   },
   textField: {
      fontFamily: "Raleway-Regular",
      alignSelf: "flex-start",
      fontSize: 20,
      paddingVertical: 20
   },
   buttonText: {
      fontFamily: "Raleway-Regular",
      color: "white"
   },
   avatarContainer: {
      borderColor: "#9B9B9B",
      borderWidth: 1 / PixelRatio.get(),
      justifyContent: "center",
      alignItems: "center"
   },
   avatar: {
      borderRadius: 75,
      width: 150,
      height: 150
   }
});
