import React, { Component } from "react";
import {
   AppRegistry,
   FlatList,
   StyleSheet,
   Text,
   View,
   Image,
   Alert,
   Platform,
   TouchableHighlight,
   Dimensions,
   TextInput
} from "react-native";
import Modal from "react-native-modalbox";
import Button from "react-native-button";
import userFlatList from "../data/userFlatList";
import priceList from "../data/priceList";

var screen = Dimensions.get("window");
export default class UModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         newItemName: "",
         newItemPrice: ""
      };
   }
   showAddModal = () => {
      this.refs.myModal.open();
   };
   generateKey = numberOfCharacters => {
      return require("random-string")({ length: numberOfCharacters });
   };
   render() {
      return (
         <Modal
            ref={"myModal"}
            style={{
               justifyContent: "center",
               borderRadius: Platform.OS === "ios" ? 30 : 0,
               shadowRadius: 10,
               width: screen.width - 80,
               height: 280
            }}
            position="center"
            backdrop={true}
            onClosed={() => {
               // alert("Modal closed");
            }}
         >
            <Text
               style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: 40
               }}
            >
               New Person's Name
            </Text>
            <TextInput
               style={{
                  height: 40,
                  borderBottomColor: "gray",
                  marginLeft: 30,
                  marginRight: 30,
                  marginTop: 20,
                  marginBottom: 10,
                  borderBottomWidth: 1
               }}
               onChangeText={text => this.setState({ newItemName: text })}
               placeholder="Enter new person's name"
               value={this.state.newItemName}
            />
            <Button
               style={{ fontSize: 18, color: "white" }}
               containerStyle={{
                  padding: 8,
                  marginLeft: 70,
                  marginRight: 70,
                  height: 40,
                  borderRadius: 6,
                  backgroundColor: "mediumseagreen"
               }}
                onPress={async () => //{
               //    if (this.state.newItemName.length == 0) {
               //       alert("You Must Enter Person's Name");
               //       return;
               //    } else if (this.state.newItemName == "item") {
               //       alert("You Must Enter a Proper Name for Item");
               //       return;
               //    }
               //    const newName = this.state.newItemName;
               //    const newItem = {
               //       name: newName,
               //       price: 0,
               //       items: []
               //    };
               //    userFlatList.push(newItem);
               //    console.log(userFlatList);
               //    this.props.parentFlatList.refreshFlatList(newName);
               //    //this.props.userFlatList.refreshUserFlatList(newName);
               //    this.setState({
               //       newItemName: ""
               //    });
               //    this.refs.myModal.close();
               // }
               {
                   var ref = firebase.database().ref("/Users");
                   var uid = "";
                   var that = this;

                   await ref.orderByChild("Email").equalTo(this.state.newItemName).limitToFirst(1)
                       .once("value", snapshot => {

                           if (snapshot.numChildren() === 0) {
                               alert("User not found");
                               return;
                           } else {
                               snapshot.forEach( user => {
                                   // console.log(user.key);
                                   if (user.child("userID").val()) {
                                       var dataDic = {
                                           userID: user.child("userID").val(),
                                           name: user.child("FullName").val(),
                                           items:[],
                                           price: 0,
                                       }
                                       userFlatList.push(dataDic)
                                       console.log(userFlatList);
                                       this.props.parentFlatList.refreshFlatList(user.child("FullName").val());

                                       // that.state.chargingPeople.append(user.child("userID").val()) //dont know if will work

                                   } else {
                                       alert("User with email " + email + " does not have a uid");
                                   }
                               });
                           }
                       });
                   return;
               }
             }
            >
               Save
            </Button>
         </Modal>
      );
   }
}
