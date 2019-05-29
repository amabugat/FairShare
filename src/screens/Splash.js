import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import ProfileImage from "./profilePage/ProfileImage";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";

export default class Splash extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         loggedIn: false,
         timePassed: false
      };
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
      let that = this;
      setTimeout(function() {
         that.setState({ timePassed: true });
      }, 2000);
      if (!that.state.timePassed) {
         return (
            <View style={styles.container}>
               <StatusBar barStyle="light-content" backgroundColor="#82b85a" />
               <ProfileImage />
            </View>
         );
      }else{
          if(that.state.loggedIn){
            return this.props.navigation.navigate("Activity");
          }else{
            return this.props.navigation.navigate("Home");
          }
      }
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#82b85a",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
   }
});
