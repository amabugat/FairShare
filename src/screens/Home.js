import React from "react";
import {
   StyleSheet,
   Text,
   View,
   TextInput,
   TouchableOpacity,
   KeyboardAvoidingView,
   TouchableWithoutFeedback,
   Keyboard,
   ScrollView,
   AsyncStorage,
   Alert
} from "react-native";
import ProfileImage from "./profilePage/ProfileImage";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";
import NotifService from "../services/pushNotifications";

type Props = {};
export default class Home extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         email: "",
         password: "",
         loggedIn: null,
         senderId: "283024795409"
      };
      this.notif = new NotifService(
         this.onRegister.bind(this),
         this.onNotif.bind(this)
      );
   }

   /*sendNotification(token) {
      console.log("pressed");
      let body = {
         to: token,
         notification: {
            title: "Simple FCM Client",
            body: "This is a notification with only NOTIFICATION.",
            sound: "default",
         },
         priority: 10
      };
      this._send(JSON.stringify(body), "notification");
   }

   _send(body, type) {
      console.log("close to send");
      let headers = new Headers({
         "Content-Type": "application/json",
       "Authorization": "key=AIzaSyCIn2th7KX6-5quHBnI4OudKTVPL9jwmNg"
      });
 
      fetch('https://gcm-http.googleapis.com/gcm/send', { method: "POST", headers: headers, body: body });

      console.log("fetched");
   }*/

   componentDidMount() {
      this.notif.configure(
         this.onRegister.bind(this),
         this.onNotif.bind(this),
         this.state.senderId
      );
   }

   onRegister(token) {
      //Alert.alert("Registered !", JSON.stringify(token));
      console.log(token);
      this.setState({ registerToken: token.token, gcmRegistered: true });
   }

   onNotif(notif) {
      console.log(notif);
      Alert.alert(notif.title, notif.message);
   }

   handlePerm(perms) {
      Alert.alert("Permissions", JSON.stringify(perms));
   }

   componentWillMount() {
      firebase.auth().onAuthStateChanged(user => {
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
            return this.props.navigation.navigate("Activity");
         // this.props.navigation.navigate('Home')
         //this.props.navigation.navigate('NoSplit')
         case false:
            return this.renderContent();
         default:
            return this.renderContent();
      }
   }

   renderContent() {
      return (
         <KeyboardAvoidingView
            behavior="padding"
            style={styles.wrapper}
            enabled
         >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
               <View style={styles.container}>
                  <ProfileImage />

                  <Text style={styles.name}>FAIRSHARE </Text>

                  <TextInput
                     style={styles.textInput1}
                     placeholder="Email "
                     autoCapitalize={"none"}
                     onChangeText={email => this.setState({ email })}
                  />

                  <TextInput
                     style={styles.textInput2}
                     secureTextEntry={true}
                     value={this.state.password}
                     onChangeText={password => this.setState({ password })}
                     placeholder="Password "
                     autoCapitalize={"none"}
                  />

                  <TouchableOpacity
                     onPress={() =>
                        this.login(this.state.email, this.state.password)
                     }
                     style={styles.button1}
                  >
                     <Text style={styles.buttonText}> LOGIN </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     onPress={() =>
                        this.signup(this.state.email, this.state.password, this.state.registerToken)
                     }
                     style={styles.button2}
                  >
                     <Text style={styles.buttonText}> SIGN UP </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     onPress={() =>
                        this.sendNotification(this.state.registerToken)
                     }
                     style={styles.button2}
                  >
                     <Text style={styles.buttonText}> Camera Fcn </Text>
                  </TouchableOpacity>
               </View>
            </TouchableWithoutFeedback>
         </KeyboardAvoidingView>
      );
   }
   login = (email, password) => {
      console.log("pressed login");
      var that = this;
      firebase
         .auth()
         .signInWithEmailAndPassword(email, password)
         .then(function(user) {
            that.setState({ password: "" });
            console.log(user);
            that.props.navigation.navigate('Activity');
         })
         .catch(function(error) {
            alert(error.toString());
         });
   };

   signup = (email, password, id) => {
      var that = this;
      firebase
         .auth()
         .createUserWithEmailAndPassword(email, password)
         .then(function(user) {
            console.log(user.user.uid);
            console.log(user);
            var userid = user.user.uid;
            firebase
               .database()
               .ref("/Users")
               .child(userid)
               .set({
                  userID: userid,
                  Email: email,
                  Password: password,
                  FirstName: "",
                  LastName: "",
                  FullName: "",
                  DeviceId: id,
                  //JoinDate: new Date().getTime(),
                  DateofBirth: "",
                  Groups: {},
                  PayPal: "",
                  PhoneNum: ""
               });

            that.props.navigation.navigate("EditProfile");
         })
         .catch(function(error) {
            alert(error.toString());
         });
   };
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
   name: {
      fontFamily: "Futura-Medium-Italic",
      fontStyle: "italic",
      marginTop: 20,
      fontSize: 40,
      color: "#559535",
      fontWeight: "bold"
   },
   button1: {
      fontFamily: "Raleway-Regular",
      width: "30%",
      backgroundColor: "#559535",
      paddingTop: 10,
      paddingBottom: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 10,
      elevation: 3
   },
   button2: {
      fontFamily: "Raleway-Regular",
      width: "30%",
      backgroundColor: "#3d3e52",
      paddingTop: 10,
      paddingBottom: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 10,
      elevation: 3
   },
   buttonText: {
      color: "white"
   },
   textInput1: {
      fontFamily: "Raleway-Regular",
      marginTop: 10
   },
   textInput2: {
      fontFamily: "Raleway-Regular",
      marginBottom: 10,
      marginTop: 10
   }
});
