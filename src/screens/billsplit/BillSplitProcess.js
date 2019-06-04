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
import ChargeUnevenly from "../../components/ChargeUnevenly";
import ImagePicker from "react-native-image-picker";
import RNTesseractOcr from "react-native-tesseract-ocr";

const imagePickerOptions = {
   quality: 1.0,
   maxWidth: 2000,
   maxHeight: 3000,
   storageOptions: {
      skipBackup: true
   }
};
const tessOptions = {
   whitelist: null,
   blacklist: null
};

export default class BillSplitProcess extends Component {
   constructor() {
      super();

      this.state = {
         currentPage: 0,
         total: 0,
         tax: null,
         tip: null,
         errorMessage: null,
         extractedText: null,
         hasErrored: false,
         imageSource: null,
         isLoading: false
      };
      this.selectImage = this.selectImage.bind(this);
   }

   componentWillReceiveProps(nextProps, nextState) {
      if (nextState.currentPage != this.state.currentPage) {
         if (this.viewPager) {
            this.viewPager.setPage(nextState.currentPage);
         }
      }
   }

   selectImage() {
      this.setState({ isLoading: true });

      ImagePicker.showImagePicker(imagePickerOptions, response => {
         if (response.didCancel) {
            this.setState({ isLoading: false });
         } else if (response.error) {
            this.setState({
               isLoading: false,
               hasErrored: true,
               errorMessage: response.error
            });
         } else {
            const source = { uri: response.uri };
            this.setState(
               { imageSource: source, hasErrored: false, errorMessage: null },
               this.extractTextFromImage(response.path)
            );
         }
      });
   }

   extractTextFromImage(imagePath) {
      RNTesseractOcr.recognize(imagePath, "LANG_ENGLISH", tessOptions)
         .then(result => {
            var output = result.split("\n");
            var item = [];
            var price = [];
            var curTotal = 0;
            var recieptTotal = 0;
            flatListData.length = 0;
            let flag = false;
            for (var i = 0; i < output.length; i++) {
               if (/\b(\w*Total\w*)\b(\s*)(\d*\.\d{2})/.test(output[i])) {
                  console.log("Found total");
                  flag = true;
               }
               if (/(?=\d\.\d{2})/.test(output[i])) {
                  console.log("its true");
                  console.log(output[i]);
                  const re = /((\s*\w+\s)+)(\s*)(\d*\.\d{2})/;
                  const hehe = re.exec(output[i]);
                  console.log(hehe);
                  console.log(hehe[1]);
                  console.log(hehe[hehe.length - 1]);
                  if (hehe[1].includes("Subtotal")) {
                     recieptTotal = hehe[hehe.length - 1];
                  } else if (
                     hehe[1].includes("Total") ||
                     hehe[1].includes("Tax")
                  ) {
                     console.log("got tax amount and tital");
                  } else {
                     const newItem = {
                        name: hehe[1],
                        itemPrice: parseFloat(hehe[hehe.length - 1]),
                        user: []
                     };
                     curTotal += parseFloat(hehe[hehe.length - 1]);
                     flatListData.push(newItem);
                     flag = true;
                  }
               } else {
                  console.log("false");
               }
            }
            if (curTotal != recieptTotal) {
               console.log("hhh" + curTotal);
               console.log("fff" + recieptTotal);
               alert("we have a problem");
            }

            if (flag == true) {
               this.setState({ isLoading: false, extractedText: result });
               flag = false;
            } else {
               this.setState({
                  isLoading: false,
                  hasErrored: true,
                  errorMessage: "ERROR"
               });
               flag = false;
            }
         })
         .catch(err => {
            this.setState({ hasErrored: true, errorMessage: err.message });
         });
   }

   createCalc = () => {
      for (var i = 0; i < userFlatList.length; i++) {
         userFlatList[i].items = [];
         for (var j = 0; j < flatListData.length; j++) {
            for (var k = 0; k < flatListData[j].user.length; k++) {
               if (userFlatList[i].name == flatListData[j].user[k].newUser) {
                  const addItem = {
                     addedItem: flatListData[j].name,
                     addedPrice: flatListData[j].user[k].newPrice
                  };
                  userFlatList[i].items.push(addItem);
               }
            }
         }
      }
      for (var i = 0; i < userFlatList.length; i++) {
         var sum = 0;
         for (var j = 0; j < userFlatList[i].items.length; j++) {
            sum = sum + parseFloat(userFlatList[i].items[j].addedPrice);
         }
         this.setState({ total: sum });
         userFlatList[i].price = sum;
      }
   };

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
               <View style={styles.change}>
                  <TouchableOpacity
                     onPress={() => {
                        this.selectImage();
                     }}
                  >
                     <Text style={styles.buttonFont}>Scan</Text>
                  </TouchableOpacity>
               </View>
               <View style={styles.change}>
                  <TouchableOpacity
                     onPress={() => {
                        //   if (this.state.tax == null || this.state.tip == null) {
                        //      Alert("Enter Tip or Tax");
                        //    } else {
                        this.createCalc();
                        console.log(userFlatList);
                        this.props.navigation.navigate("ChargeUnevenly", ,
                        {
                           imageURI: this.state.imageSource,
                           tax: this.state.tax,
                           tip: this.state.tip
                        });
                        //    }
                     }}
                  >
                     <Text style={styles.buttonFont}>Charge</Text>
                  </TouchableOpacity>
               </View>
            </View>

            <BasicFlatList style={{ marginTop: 10 }} />
            <View style={styles.row}>
               <View
                  style={{
                     borderBottomColor: "grey",
                     borderBottomWidth: 8,
                     width: "96%",
                     marginLeft: "2%",
                     marginRight: 20
                  }}
               />
            </View>

            <View style={styles.row}>
               <Text style={styles.fontSet}>%Tip</Text>
               <View style={styles.outputBox}>
                  <Text style={styles.output}>{}</Text>
               </View>
            </View>
            <View style={styles.row}>
               <Text style={styles.fontSet}>%Tax</Text>
               <View style={styles.outputBox}>
                  <Text style={styles.output}>{}</Text>
               </View>
            </View>
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
   outputBox: {
      borderRadius: 100,
      fontSize: 20,
      textAlign: "center",
      margin: 10,
      backgroundColor: "#82b85a",
      color: "#000000",
      width: 120,
      height: 40,
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
