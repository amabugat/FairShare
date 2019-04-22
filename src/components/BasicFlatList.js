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
import flatListData from "../data/flatListData";
import priceList from "../data/priceList";
import Swipeout from "react-native-swipeout";
import AddModal from "./AddModal";
import UserModal from "../screens/billsplit/AddModal";

class UserListItem extends Component {
   constructor(props) {
      super(props);
      this.state = {
         activeRowKey: null,
         total: null,
         data: null
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
               console.log(this.props.item.newUser);
               this.setState({ activeRowKey: this.props.item.newUser });
            }
         },
         right: [
            {
               onPress: () => {
                  const deletingRow = this.state.activeRowKey;
                  console.log(
                     flatListData[this.props.userFlatList.props.index].user
                  );
                  console.log(deletingRow);
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
                              flatListData[
                                 this.props.userFlatList.props.index
                              ].user.splice(this.props.index, 1);

                              if (
                                 flatListData[
                                    this.props.userFlatList.props.index
                                 ].user.length > 0
                              ) {
                                 for (
                                    var i =
                                       flatListData[
                                          this.props.userFlatList.props.index
                                       ].user.length - 1;
                                    i >= 0;
                                    i--
                                 ) {
                                    flatListData[
                                       this.props.userFlatList.props.index
                                    ].user[i].newPrice =
                                       flatListData[
                                          this.props.userFlatList.props.index
                                       ].itemPrice /
                                       flatListData[
                                          this.props.userFlatList.props.index
                                       ].user.length;
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
      const newUser = {
         newUser: this.state.data,
         newPrice: (
            flatListData[this.props.index].itemPrice /
            (flatListData[this.props.index].user.length + 1)
         ).toFixed(2)
      };
      flatListData[this.props.index].user.push(newUser);
      if (flatListData[this.props.index].user.length > 1) {
         for (
            var i = flatListData[this.props.index].user.length - 1;
            i > 0;
            i--
         ) {
            flatListData[this.props.index].user[i - 1].newPrice =
               flatListData[this.props.index].user[i].newPrice;
         }
      }
      this.setState({ data: "" });
      // console.log(flatListData[this.props.index].user);
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
                  console.log(this.props.index);
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
                              console.log(flatListData);
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
                     onPress={() => this.createFnc()}
                  >
                     <Text style={styles.buttonFont}> ADD TO </Text>
                  </TouchableOpacity>
                  <TextInput
                     style={{
                        height: 40,
                        borderBottomColor: "gray",
                        marginRight: 30,
                        marginTop: 20,
                        marginBottom: 10
                     }}
                     onChangeText={text => this.setState({ data: text })}
                     placeholder="Username"
                     value={this.state.data}
                  />
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
                  //console.log(Item = ${JSON.stringify(item)}, index = ${index});

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
      elevation: 3
   },
   cancelContainer: {
      borderRadius: 90,
      width: 120,
      height: 40,
      backgroundColor: "#F47983",
      marginRight: "2%",
      fontFamily: "Raleway-Bold",
      margin: 20,
      elevation: 3
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
                  //console.log(Item = ${JSON.stringify(item)}, index = ${index});

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
