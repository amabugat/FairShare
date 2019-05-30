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
   Picker,
   TouchableOpacity
} from "react-native";
import flatListData from "../data/flatListData";
import userFlatList from "../data/userFlatList";
import Swipeout from "react-native-swipeout";
import AddModal from "./AddModal";
import UserModal from "../screens/billsplit/AddModal";

class UserListItem extends Component {
   constructor(props) {
      super(props);
      this.state = {
         activeRowKey: null,
         total: null,
         PickerValue: "",
      };
   }

   render() {
      const swipeSettings = {
         autoClose: true,
         onClose: (secId, rowId, direction) => {
            if (flatListData.length == 1) {
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
               this.setState({ activeRowKey: this.props.item.newUser });
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
                           style: "cancel"
                        },
                        {
                           text: "Yes",
                           onPress: () => {
                              flatListData[
                                 this.props.userFlatList.props.index
                              ].user.splice(this.props.index, 1);

                              if (
                                 flatListData[
                                    this.props.userFlatList.props.index
                                 ].user.length > 0
                              ) {
                                 var itemPrice =
                                    flatListData[
                                       this.props.userFlatList.props.index
                                    ].itemPrice * 100;
                                 console.log("itemPrice: " + itemPrice);
                                 var len =
                                    flatListData[
                                       this.props.userFlatList.props.index
                                    ].user.length;
                                 console.log("len: " + len);
                                 var rem =
                                    itemPrice %
                                    flatListData[
                                       this.props.userFlatList.props.index
                                    ].user.length;
                                 console.log("rem: " + rem);
                                 var least =
                                    (itemPrice - rem) /
                                    flatListData[
                                       this.props.userFlatList.props.index
                                    ].user.length;
                                 console.log("least: " + least);
                                 for (
                                    var i = 0;
                                    i <
                                    flatListData[
                                       this.props.userFlatList.props.index
                                    ].user.length;
                                    i++
                                 ) {
                                    flatListData[
                                       this.props.userFlatList.props.index
                                    ].user[i].newPrice = least / 100;
                                 }
                                 if (rem > 0) {
                                    for (var i = 0; i < rem; i++) {
                                       while (true) {
                                          var random = parseFloat(
                                             Math.floor(Math.random() * len)
                                          );
                                          console.log("random: " + random);
                                          console.log(
                                             "random user price: " +
                                                flatListData[
                                                   this.props.userFlatList.props
                                                      .index
                                                ].user[random].newPrice
                                          );
                                          console.log(
                                             "least price: " +
                                                least / 100
                                          );

                                          if (
                                             flatListData[
                                                this.props.userFlatList.props
                                                   .index
                                             ].user[random].newPrice ==
                                             least / 100
                                          ) {
                                             console.log(
                                                parseFloat(
                                                   flatListData[
                                                      this.props.userFlatList
                                                         .props.index
                                                   ].user[random].newPrice
                                                )
                                             );
                                             flatListData[
                                                this.props.userFlatList.props.index
                                             ].user[random].newPrice =
                                                (least + 1) / 100;
                                             break;
                                          }
                                       }
                                    }
                                 }
                              }

                              //Refresh FlatList !
                              this.props.userFlatList.props.parentFlatList.refreshFlatList(
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
                  <Text style={styles.UserListItem}>-</Text>
                  <Text style={styles.UserListItem}>
                     {this.props.item.newUser}
                  </Text>
                  <Text style={styles.UserListItem}>pays</Text>
                  <Text style={styles.UserListItem}>
                     ${this.props.item.newPrice}
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

class FlatListItem extends Component {
   constructor(props) {
      super(props);
      this.state = {
         activeRowKey: null,
         total: null,
         data: null
      };
      this.createFnc = this.createFnc.bind(this);
   }

   createFnc = () => {
      var price = parseFloat((
         flatListData[this.props.index].itemPrice /
         (flatListData[this.props.index].user.length + 1)
      ));
      const newUserName = {
         newUser: this.state.PickerValue,
         newPrice: price
      };
      flatListData[this.props.index].user.push(newUserName);
      /*for (var i = 0; i < userFlatList.length; i++) {
         if (userFlatList[i].name == this.state.PickerValue) {
            const addItem = {
               addedItem: flatListData[this.props.index].name,
               addedPrice: price
            };
            userFlatList[i].items.push(addItem);
         }
      }*/
      //userFlatList.
      if (flatListData[this.props.index].user.length > 1) {
         /* for (
            var i = flatListData[this.props.index].user.length - 1;
            i > 0;
            i--
         ) {
            flatListData[this.props.index].user[i - 1].newPrice =
               flatListData[this.props.index].user[i].newPrice;
         }*/

         var itemPrice = flatListData[this.props.index].itemPrice * 100;
         console.log("itemPrice: " + itemPrice);
         var len = flatListData[this.props.index].user.length;
         console.log("len: " + len);
         var rem = itemPrice % flatListData[this.props.index].user.length;
         console.log("rem: " + rem);
         var least =
            (itemPrice - rem) / flatListData[this.props.index].user.length;
         console.log("least: " + least);
         for (var i = 0; i < flatListData[this.props.index].user.length; i++) {
            flatListData[this.props.index].user[i].newPrice =
               least / 100;
         }
         if (rem > 0) {
            for (var i = 0; i < rem; i++) {
               while (true) {
                  var random = parseFloat(Math.floor(Math.random() * len));
                  console.log("random: " + random);
                  console.log(
                     "random user price: " +
                        flatListData[this.props.index].user[random].newPrice
                  );
                  console.log("least price: " + least / 100);

                  if (
                     flatListData[this.props.index].user[random].newPrice ==
                     least / 100
                  ) {
                     console.log(
                        parseFloat(
                           flatListData[this.props.index].user[random].newPrice
                        )
                     );
                     flatListData[this.props.index].user[random].newPrice =
                        (least + 1) / 100;

                     //flatListData[this.props.index].user[random].bol = true;
                     break;
                  }
               }
            }
         }
      }

      this.setState({ PickerValue: null });
   };

   createDrop = () => {
      var dropDown = [];
      for (var i = 0; i < userFlatList.length; i++) {
         dropDown.push(
            <Picker.Item
               label={userFlatList[i].name}
               value={userFlatList[i].name}
            />
         );
      }
      return dropDown;
   };

   render() {
      const swipeSettings = {
         autoClose: true,
         onClose: (secId, rowId, direction) => {
            if (flatListData.length == 1) {
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
                           style: "cancel"
                        },
                        {
                           text: "Yes",
                           onPress: () => {
                              flatListData.splice(this.props.index, 1);

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
                  <Text style={styles.flatListItem}>
                     ${this.props.item.itemPrice}
                  </Text>
                  <TouchableOpacity
                     style={styles.calcContainer}
                     onPress={() => {
                        if (
                           this.state.PickerValue == "Username" ||
                           this.state.PickerValue == null
                        ) {
                           alert("Please Select A Person's Name");
                        } else {
                           this.createFnc();
                        }
                     }}
                  >
                     <Text style={styles.buttonFont}> ADD TO </Text>
                  </TouchableOpacity>
                  <Picker
                     style={{
                        width: "40%",
                        margin: 10
                     }}
                     selectedValue={this.state.PickerValue}
                     onValueChange={(itemValue, itemIndex) =>
                        this.setState({ PickerValue: itemValue })
                     }
                  >
                     <Picker.Item label="Username" value="Username" />
                     {this.createDrop()}
                  </Picker>
               </View>

               <View
                  style={{
                     borderBottomColor: "white",
                     borderBottomWidth: 4,
                     width: "100%"
                  }}
               />
            </View>
            <FlatList
               style={{ flex: 2 }}
               ref={"flatList"}
               data={flatListData[this.props.index].user}
               renderItem={({ item, index }) => {
                  return (
                     <UserListItem
                        item={item}
                        index={index}
                        userFlatList={this}
                     />
                  );
               }}
            />
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
      fontSize: 18
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
      width: 100,
      height: 40,
      backgroundColor: "#26A65B",
      marginLeft: "2%",
      fontFamily: "Raleway-Bold",
      margin: 20,
      elevation: 3
   },
   cancelContainer: {
      borderRadius: 90,
      width: 100,
      height: 40,
      backgroundColor: "#F47983",
      marginRight: "2%",
      fontFamily: "Raleway-Bold",
      margin: 20,
      elevation: 3
   },
   buttonFont: {
      fontSize: 18,
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

export default class BasicFlatList extends Component {
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

   sum() {
      var sum = 0;
      for (var i = 0; i < flatListData.length; i++) {
         sum = sum + parseFloat(flatListData[i].itemPrice);
      }
      return sum;
   }

   render() {
      return (
         <View
            style={{
               flex: 1,
               marginTop: Platform.OS === "ios" ? 34 : 0,
               flexDirection: "column",
               justifyContent: "space-between"
            }}
         >
            <FlatList
               style={{ flex: 1 }}
               ref={"flatList"}
               data={flatListData}
               renderItem={({ item, index }) => {
                  return (
                     <FlatListItem
                        item={item}
                        index={index}
                        parentFlatList={this}
                     />
                  );
               }}
            />
            <AddModal ref={"addModal"} parentFlatList={this} />

            <UserModal ref={"userModal"} userFlatList={this} />

            <View
               style={{
                  alignItems: "center",
                  height: 40,
                  width: 380
               }}
            >
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
                     Tap to Add Items{" "}
                  </Text>
               </TouchableOpacity>
            </View>
            <View style={styles.row} />
         </View>
      );
   }
}
