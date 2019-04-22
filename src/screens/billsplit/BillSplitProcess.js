import React, { Component } from "react";
import {
   StyleSheet,
   View,
   Text,
   TouchableOpacity,
   TextInput,
   Platform,
   Alert
} from "react-native";

import userFlatList from "../../data/userFlatList";
import flatListData from "../../data/flatListData";
import BasicFlatList from "../../components/BasicFlatList";
export default class BillSplitProcess extends Component {
   constructor() {
      super();

      this.state = {
         currentPage: 0,
         total: 0
      };
   }

   componentWillReceiveProps(nextProps, nextState) {
      if (nextState.currentPage != this.state.currentPage) {
         if (this.viewPager) {
            this.viewPager.setPage(nextState.currentPage);
         }
      }
   }

   sum() {
      var sum = 0;
      for (var i = 0; i < flatListData.length; i++) {
         sum = sum + parseFloat(flatListData[i].itemPrice);
         console.log(sum);
      }
      console.log(flatListData);
      return sum;
   }

   reList() {
      for (var i = 0; i < userFlatList.length; i++) {}
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
            <View style={styles.row}>
               <Text> </Text>
               <View style={styles.change}>
                  <TouchableOpacity
                     onPress={() => {
                        if (this.state.total == null) {
                           Alert.alert("Please Calculate First");
                        } else {
                           this.props.navigation.navigate("ChargePeople", {
                              peps: 2,
                              amounts: this.state.total,
                              tip: 0,
                              tax: 0
                           });
                        }
                     }}
                  >
                     <Text style={styles.buttonFont}>Charge</Text>
                  </TouchableOpacity>
               </View>
            </View>

            <BasicFlatList style={{ marginTop: 10 }} />
         </View>
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
   },
   buttonFont: {
      fontSize: 20,
      marginTop: 7,
      fontFamily: "Raleway-Bold",
      color: "#FFFFFF",
      textAlign: "center"
   }
});
