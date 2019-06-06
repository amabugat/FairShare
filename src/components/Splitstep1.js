import React, { Component } from "react";
import {
   AppRegistry,
   FlatList,
   StyleSheet,
   Text,
   TextInput,
   View,
   Image,
   Alert,
   Platform,
   TouchableOpacity
} from "react-native";
import userFlatList from "../data/userFlatList";
import Swipeout from "react-native-swipeout";
import Modal from "./UModal";

class UserListItem extends Component {
   constructor(props) {
      super(props);
      this.state = {
         activeRowKey: null,
         total: null,
         data: null,
      };
   }

   render() {
      const swipeSettings = {
         autoClose: true,
         onClose: (secId, rowId, direction) => {
            if (userFlatList.length == 1) {
               this.setState({ activeRowKey: null });
            }
            if (this.state.activeRowKey != null) {
               this.setState({ activeRowKey: null });
            }
         },
         onOpen: (secId, rowId, direction) => {
            if (this.props.item.index == 0) {
               this.setState({ activeRowKey: null });
            } else {
               this.setState({ activeRowKey: this.props.item.name });
            }
         },
         right: [
            {
               onPress: () => {
                  const deletingRow = this.state.activeRowKey;
                  Alert.alert(
                     "Alert",
                     "Are you sure you want to delete ?",
                     [
                        {
                           text: "No",
                           onPress: () => console.log("Cancel Pressed"),
                           style: "cancel"
                        },
                        {
                           text: "Yes",
                           onPress: () => {
                              userFlatList.splice(this.props.index, 1);

                              //Refresh FlatList !
                              this.props.parentFlatList.refreshFlatList(
                                 deletingRow
                              );
                           }
                        }
                     ],
                     { cancelable: true }
                  );
               },
               text: "Delete",
               type: "delete"
            }
         ],
         rowId: this.props.index,
         sectionId: 1
      };
      return (
         <Swipeout {...swipeSettings}>
            <View
               style={{
                  flex: 1,
                  flexDirection: "column"
               }}
            >
               <View
                  style={{
                     flex: 1,
                     flexDirection: "row",
                     justifyContent: "space-around",
                     backgroundColor: "white"
                  }}
               >
                  <Text style={styles.flatListItem}>
                     {this.props.item.name}
                  </Text>
               </View>

               <View
                  style={{
                     borderBottomColor: "white",
                     borderBottomWidth: 4,
                     width: "100%"
                  }}
               />
            </View>
         </Swipeout>
      );
   }
}

const styles = StyleSheet.create({
   flatListItem: {
      fontFamily: "Raleway-Bold",
      color: "black",
      padding: 25,
      paddingLeft: 15,
      fontSize: 22
   },
   UserListItem: {
      fontFamily: "Raleway-Bold",
      color: "grey",
      padding: 25,
      paddingLeft: 15,
      fontSize: 15
   },
   row: {
      flexDirection: "row",
      justifyContent: "space-between"
   },
   fontSet: {
      fontSize: 23,
      textAlign: "left",
      margin: 10,
      fontFamily: "Raleway-Bold",
      color: "#26A65B"
   },
   box: {
      borderRadius: 100,
      fontSize: 20,
      textAlign: "center",
      margin: 10,
      backgroundColor: "rgba(117,125,117,0.2)",
      color: "#000000",
      width: 120,
      height: 40,
      fontFamily: "Raleway-Bold"
   },
   output: {
      fontSize: 20,
      marginTop: 7,
      textAlign: "center",
      color: "#000000",
      fontFamily: "Raleway-Bold"
   },
   calcContainer: {
      borderRadius: 90,
      width: 120,
      height: 40,
      backgroundColor: "#26A65B",
      marginLeft: "2%",
      fontFamily: "Raleway-Bold",
      margin: 20,
   },
   cancelContainer: {
      borderRadius: 90,
      width: 120,
      height: 40,
      backgroundColor: "#F47983",
      marginRight: "2%",
      fontFamily: "Raleway-Bold",
      margin: 20,
   },
   buttonFont: {
      fontSize: 20,
      marginTop: 7,
      fontFamily: "Raleway-Bold",
      color: "#FFFFFF",
      textAlign: "center"
   },
   change: {
      margin: 20,
      borderRadius: 90,
      width: 120,
      height: 40,
      backgroundColor: "#6C7A89",
      color: "#FFFFFF",
      fontFamily: "Raleway-Bold",
      marginRight: "2%",
      elevation: 3
   }
});

export default class Splitstep1 extends Component {
   constructor(props) {
      super(props);
      this.state = {
         deletedRowKey: null
      };
      this._onPressAdd = this._onPressAdd.bind(this);
   }
   refreshFlatList = activeKey => {
      this.setState(prevState => {
         return {
            deletedRowKey: activeKey
         };
      });
   };

   _onPressAdd() {
      // alert("You add Item");
      this.refs.addModal.showAddModal();
   }

   render() {
      return (
         <View
            style={{
               flex: 1,
               marginTop: Platform.OS === "ios" ? 34 : 0,
               flexDirection: "column",
               justifyContent: "center"
            }}
         >
            <FlatList
               style={{ flex: 1 }}
               ref={"flatList"}
               data={userFlatList}
               renderItem={({ item, index }) => {
                  //console.log(Item = ${JSON.stringify(item)}, index = ${index});

                  return (
                     <UserListItem
                        item={item}
                        index={index}
                        parentFlatList={this}
                     />
                  );
               }}
            />
            <Modal ref={"addModal"} parentFlatList={this} />
            <View style={{ alignItems: "center" }}>
               <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={this._onPressAdd}
               >
                  <Text
                     style={{
                        color: "rgba(117,125,117,0.5)",
                        fontSize: 25,
                        fontFamily: "Raleway-Bold"
                     }}
                  >
                     {" "}
                     Tap to Add Charge Person{" "}
                  </Text>
               </TouchableOpacity>

               <TouchableOpacity
                  style={styles.calcContainer}
                  onPress={() => {
                     if (userFlatList.length > 0) {
                        this.props.navigation.navigate("BillSplitProcess");
                     } else {
                        alert("Please Add Charge People");
                     }
                  }}
               >
                  <Text style={styles.buttonFont}>Next</Text>
               </TouchableOpacity>
            </View>
         </View>
      );
   }
}
