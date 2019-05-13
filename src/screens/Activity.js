import React, { Component } from "react";
import {
   StyleSheet,
   Text,
   View,
   Button,
   TouchableOpacity,
   ScrollView
} from "react-native";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/MaterialIcons";
import Friends from "./Friends";
import { Container, Content } from "native-base";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";

export default class Activity extends React.Component {
   state = { loggedIn: null };

   componentWillMount() {
      firebase.auth().onAuthStateChanged(user => {
         if (user) {
            this.setState({ loggedIn: true });
         } else {
            this.setState({ loggedIn: false });
         }
      });
   }

   //Rendering the main activity page with tab view, Action button and dynamic cards
   render() {
      return (
         <Container>
            <Content>
               <View>
                  <Friends />
                  <ActionButton buttonColor="#559535" position="right">
                     <ActionButton.Item
                        buttonColor="#ff0000"
                        title="Log Out"
                        onPress={() => {
                           if (this.state.loggedIn) {
                              firebase.auth().signOut();
                              this.props.navigation.navigate("Home");
                           } else {
                              this.props.navigation.navigate("Home");
                           }
                        }}
                     >
                        <Icon name="home" style={styles.actionButtonIcon} />
                     </ActionButton.Item>
                     <ActionButton.Item
                        buttonColor="#9b59b6"
                        title="Profile"
                        style={styles.actionButtonText}
                        onPress={() =>
                           this.props.navigation.navigate("ProfilePage")
                        }
                     >
                        <Icon name="face" style={styles.actionButtonIcon} />
                     </ActionButton.Item>
                     <ActionButton.Item
                        buttonColor="#1abc9c"
                        title="History"
                        onPress={() =>
                           this.props.navigation.navigate("ViewHistory")
                        }
                     >
                        <Icon name="group" style={styles.actionButtonIcon} />
                     </ActionButton.Item>
                     <ActionButton.Item
                        buttonColor="#3498db"
                        title="Split New Bill"
                        onPress={() =>
                           this.props.navigation.navigate("BillPrompt")
                        }
                     >
                        <Icon name="receipt" style={styles.actionButtonIcon} />
                     </ActionButton.Item>
                  </ActionButton>
               </View>
            </Content>
         </Container>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#3d3e52",
      alignItems: "center",
      justifyContent: "center"
   },
   button1: {
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
      width: "30%",
      backgroundColor: "#559535",
      paddingTop: 10,
      paddingBottom: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 200,
      marginTop: 10,
      elevation: 3
   },
   buttonText: {
      fontFamily: "Raleway-Regular",
      color: "white"
   },
   actionButtonText: {
      fontFamily: "Raleway-Regular"
   },
   actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: "white"
   }
});
