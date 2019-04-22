import React from "react";
import {
   StyleSheet,
   Text,
   View,
   TextInput,
   TouchableOpacity
} from "react-native";
import ProfileImage from "../profilePage/ProfileImage";
import Splitstep1 from "../../components/Splitstep1";
//Menu for asking how bill is being split
export default class BillPrompt extends React.Component {
   render() {
      return (
         <View style={styles.container}>
            <ProfileImage />
            <Text style={styles.name}>Will the bill be split evenly?</Text>

            <TouchableOpacity
               onPress={() => this.props.navigation.navigate("NoSplit")}
               style={styles.button1}
            >
               <Text style={styles.buttonText}> Yes </Text>
            </TouchableOpacity>

            <TouchableOpacity
               onPress={() => this.props.navigation.navigate("Splitstep1")}
               style={styles.button2}
            >
               <Text style={styles.buttonText}> No </Text>
            </TouchableOpacity>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#82b85a",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
   },
   button1: {
      width: "30%",
      backgroundColor: "#559535",
      paddingTop: 10,
      paddingBottom: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 30,
      elevation: 3
   },
   button2: {
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
      fontFamily: "Raleway-Regular",
      color: "white"
   },
   name: {
      fontFamily: "Raleway-Regular",
      marginTop: 20,
      fontSize: 25,
      color: "#fcfcfe"
   }
});
