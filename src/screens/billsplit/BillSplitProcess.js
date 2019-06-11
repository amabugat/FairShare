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
         tax: 0,
         autotax: 0,
         tip: 0,
         errorMessage: null,
         extractedText: null,
         hasErrored: false,
         imageSource: null,
         isLoading: false,
         zip: 0,
         lat: 0,
         lng: 0
      };
      this.selectImage = this.selectImage.bind(this);
   }

   async componentWillMount() {
      var that = this;
      await navigator.geolocation.getCurrentPosition(
         position => {
            console.log(position);
            that.setState({
               lat: position.coords.latitude,
               lng: position.coords.longitude
            });
            fetch(
               "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
                  position.coords.latitude +
                  "," +
                  position.coords.longitude +
                  "&key=AIzaSyDfAZDo1UpXtkp2dO9VaZ1VIWrLtc7TjQc"
            )
               .then(response => response.json())
               .then(responseJson => {
                  var result =
                     responseJson.results[0].address_components[6].long_name;
                  console.log(result);
                  that.setState({
                     zip: result
                  });
                  fetch(
                     "https://api.zip-tax.com/request/v40?key=FQMDodzmaEHJcRy3&postalcode=" +
                        result
                  )
                     .then(response => response.json())
                     .then(responseJson => {
                        //  console.log(responseJson.results)
                        var decimalTax = responseJson.results[0].taxSales * 100;
                        console.log(decimalTax);
                        that.setState({
                           tax: decimalTax.toString()
                        });
                     })
                     .catch(error => console.log(error));
               })

               .catch(error => console.log(error)); //to catch the errors if any
         },
         error => console.log(JSON.stringify(error)),
         { enableHighAccuracy: true, timeout: 5000 }
      );
      console.log(this.state.tax);

      if (that.state.zip == 0) {
         console.log("can't find zip");
      }
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
            var subTotal = 0;
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
                     subTotal = parseFloat(hehe[hehe.length - 1]);
                  } else if (
                     hehe[1].includes("Total") ||
                     hehe[1].includes("BALANCE")
                  ) {
                     console.log("got tax amount and tital");
                     recieptTotal = parseFloat(hehe[hehe.length - 1]);
                  } else if (hehe[1].includes("Tax")) {
                     console.log("tax");
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
               alert("items don't add up correctly, please double check");
            }
            if (recieptTotal != 0 && subTotal != 0) {
               var taxrate = ((subTotal / recieptTotal) * 100).toFixed(2);
               this.setState({
                  tax: taxrate
               });
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
         userFlatList[i].price =
            sum + sum * 0.01 * this.state.tip + sum * 0.01 * this.state.tax;
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
                        this.props.navigation.navigate("ChargeUnevenly", {
                           imageSource: this.state.imageSource
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
               <TextInput
                  style={styles.box}
                  keyboardType="numeric"
                  returnKeyType="done"
                  ref={ti => {
                     this.tipInput = ti;
                  }}
                  onChangeText={tip => this.setState({ tip: parseFloat(tip) })}
               />
            </View>
            <View style={styles.row}>
               <Text style={styles.fontSet}>%Tax</Text>
               <View style={styles.outputBox}>
                  <TextInput
                     style={styles.output}
                     keyboardType="numeric"
                     value={this.state.tax}
                     onChangeText={tax => this.setState({ tax })}
                     placeholder="tax%"
                  />
                  {/*<Text style={styles.output}>{this.state.autotax}</Text>*/}
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
      fontFamily: "Raleway-Regular",
      margin: 20,
      elevation: 3
   },
   cancelContainer: {
      borderRadius: 90,
      width: 120,
      height: 40,
      backgroundColor: "#F47983",
      marginRight: "2%",
      fontFamily: "Raleway-Regular",
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
      fontFamily: "Raleway-Regular",
      color: "#26A65B"
   },
   box: {
      borderRadius: 100,
      fontSize: 18,
      textAlign: "center",
      margin: 10,
      backgroundColor: "rgba(117,125,117,0.2)",
      color: "#000000",
      width: 120,
      height: 40,
      fontFamily: "Raleway-Regular"
   },
   output: {
      fontSize: 18,
      padding: 3,
      textAlign: "center",
      color: "#000000",
      fontFamily: "Raleway-Regular"
   },
   outputBox: {
      borderRadius: 100,
      fontSize: 18,
      textAlign: "center",
      margin: 10,
      backgroundColor: "#82b85a",
      color: "#000000",
      width: 120,
      height: 40,
      fontFamily: "Raleway-Regular"
   },
   change: {
      margin: 20,
      borderRadius: 90,
      width: 120,
      height: 40,
      backgroundColor: "#6C7A89",
      color: "#FFFFFF",
      fontFamily: "Raleway-Regular"
   },
   buttonFont: {
      fontSize: 20,
      marginTop: 7,
      fontFamily: "Raleway-Regular",
      color: "#FFFFFF",
      textAlign: "center"
   }
});
