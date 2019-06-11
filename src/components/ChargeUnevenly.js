import React from "react";
import {
   ScrollView,
   StyleSheet,
   Text,
   View,
   TextInput,
   TouchableOpacity,
   PixelRatio,
   Image,
   Component,
   FlatList,
   Picker
} from "react-native";
import ProfileImage from "../screens/profilePage/ProfileImage";
import userFlatList from "../data/userFlatList";
import flatListData from "../data/flatListData";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";
import "@firebase/storage";

var data = [];

export default class ChargeUnevenly extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         paymentTitle: "",
         emailID: "",
         email: "",
         chargeDescription: "",
         chargingPeople: data,
         interest: 0,
         interestRate: 0,
         tax: 0,
         tip: 0,
         fullName: "",
         userID: 0,
         refresh: false,
         avatarSource: this.props.navigation.state.params.imageSource
      };
      this.chargeALL = this.chargeALL.bind(this);
      this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
   }
   componentDidMount() {
      var user = firebase.auth().currentUser;
      var uid = user.uid;
      var that = this;
      if (user == null) {
         alert("not logged in");
         //return to home screen
         return;
      }
      var userDBref = firebase
         .database()
         .ref("/Users")
         .child(uid);

      //set the states with info in users table
      userDBref.on("value", function(snapshot) {
         userData = snapshot.val();
         that.setState({
            userID: uid,
            fullName: userData.FullName
         });
      });
   }

   sendNotification(token, name, price) {
      console.log("pressed");
      let body = {
         to: token,
         notification: {
            title: "Pay Your Recent Bill",
            body:
               "You are charged " +
               "by " +
               name +
               " for " +
               "$" +
               price.toFixed(2) +
               "\n" +
               "Payment Title: " +
               this.state.paymentTitle +
               "\n" +
               "Describtion: " +
               this.state.chargeDescription,
            sound: "default"
         },
         priority: 10
      };
      this._send(JSON.stringify(body), "notification");
   }

   _send(body, type) {
      console.log("close to send");
      let headers = new Headers({
         "Content-Type": "application/json",
         Authorization: "key=AIzaSyCIn2th7KX6-5quHBnI4OudKTVPL9jwmNg"
      });

      fetch("https://gcm-http.googleapis.com/gcm/send", {
         method: "POST",
         headers: headers,
         body: body
      });

      console.log("fetched");
   }

   selectPhotoTapped() {
      const options = {
         quality: 1.0,
         maxWidth: 500,
         maxHeight: 500,
         storageOptions: {
            skipBackup: true
         }
      };

      ImagePicker.showImagePicker(options, response => {
         console.log("Response = ", response);

         if (response.didCancel) {
            console.log("User cancelled photo picker");
         } else if (response.error) {
            console.log("ImagePicker Error: ", response.error);
         } else if (response.customButton) {
            console.log("User tapped custom button: ", response.customButton);
         } else {
            let source = { uri: response.uri };

            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };

            this.setState({
               avatarSource: source
            });
         }
      });
   }

   chargeALL() {
      var user = firebase.auth().currentUser;
      var uid = user.uid;
      var that = this;
      if (user == null) {
         alert("not logged in");
         return;
      }
      var userRef = firebase
         .database()
         .ref("/Users")
         .child(uid);
      var currentTimeStamp = new Date().getTime();
      if (this.state.avatarSource != null) {
         const image = this.state.avatarSource.uri;

         const Blob = RNFetchBlob.polyfill.Blob;
         const fs = RNFetchBlob.fs;
         window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
         window.Blob = Blob;
         //    alert("after window blob")

         let uploadBlob = null;
         var paymentuidkey = firebase
            .database()
            .ref("/NewKey")
            .push().key;
         const imageRef = firebase
            .storage()
            .ref("reciepts")
            .child(paymentuidkey);
         //  alert("do i even get here")

         let mime = "image/jpg";
         //var currentTimeStamp = new Date().getTime()
         //  alert(currentTimeStamp)

         fs.readFile(image, "base64")
            .then(data => {
               //        alert("return blob")
               return Blob.build(data, { type: `${mime};BASE64` });
            })
            .then(blob => {
               uploadBlob = blob;
               //        alert("put blob")
               //      alert(blob)
               return imageRef.put(blob, { contentType: mime });
            })
            .then(() => {
               uploadBlob.close();
               //      alert("close blob")
               return imageRef.getDownloadURL();
            })
            .then(url => {
               var receiptpicURL = url;
               var userRequestRef = firebase
                  .database()
                  .ref("/Payments")
                  .child(uid)
                  .child("/Requesting");
               for (i = 0; i < userFlatList.length; i++) {
                  if (uid == userFlatList[i].userID) {
                     continue;
                  }
                  var chargedRef = firebase
                     .database()
                     .ref("/Payments")
                     .child(userFlatList[i].userID)
                     .child("/GettingCharged");
                  var key = chargedRef.push().key;
                  //  alert(key)
                  chargedRef.child(key).set({
                     PaymentTitle: that.state.paymentTitle,
                     ReceiptID: key,
                     Description: that.state.chargeDescription,
                     Amount: userFlatList[i].price,
                     OriginalAmount: userFlatList[i].price,
                     Tip: that.state.tip,
                     Tax: that.state.tax,
                     Requester: uid,
                     Charged: userFlatList[i].userID,
                     RequesterName: that.state.fullName,
                     ChargedName: userFlatList[i].name,
                     ReceiptPic: receiptpicURL,
                     PhotoKey: paymentuidkey,
                     TimeStamp: currentTimeStamp,
                     InterestTimeStamp: currentTimeStamp,
                     Interest: that.state.interest,
                     InterestRate: that.state.interestRate * 0.01,
                     Paid: false
                  });
                  userRequestRef.child(key).set({
                     PaymentTitle: that.state.paymentTitle,
                     ReceiptID: key,
                     Description: that.state.chargeDescription,
                     Amount: userFlatList[i].price,
                     OriginalAmount: userFlatList[i].price,
                     Tip: that.state.tip,
                     Tax: that.state.tax,
                     Requester: uid,
                     Charged: userFlatList[i].userID,
                     RequesterName: that.state.fullName,
                     ChargedName: userFlatList[i].name,
                     ReceiptPic: receiptpicURL,
                     PhotoKey: paymentuidkey,
                     TimeStamp: currentTimeStamp,
                     InterestTimeStamp: currentTimeStamp,
                     Interest: that.state.interest,
                     InterestRate: that.state.interestRate * 0.01,
                     Paid: false
                  });

                  this.sendNotification(
                     userFlatList[i].deviceId,
                     user.displayName,
                     userFlatList[i].price
                  );
               }
               this.props.navigation.navigate("Activity");
            })
            .catch(error => {
               console.log(error);
            });
      } else {
         var userRequestRef = firebase
            .database()
            .ref("/Payments")
            .child(uid)
            .child("/Requesting");

         for (i = 0; i < userFlatList.length; i++) {
            if (uid == userFlatList[i].userID) {
               continue;
            }
            var chargedRef = firebase
               .database()
               .ref("/Payments")
               .child(userFlatList[i].userID)
               .child("/GettingCharged");
            var key = chargedRef.push().key;

            //  alert(key)
            chargedRef.child(key).set({
               PaymentTitle: that.state.paymentTitle,
               ReceiptID: key,
               Description: that.state.chargeDescription,
               Amount: userFlatList[i].price,
               OriginalAmount: userFlatList[i].price,
               Tip: that.state.tip,
               Tax: that.state.tax,
               Requester: uid,
               Charged: userFlatList[i].userID,
               RequesterName: that.state.fullName,
               ChargedName: userFlatList[i].name,
               ReceiptPic: null,
               PhotoKey: null,
               TimeStamp: currentTimeStamp,
               InterestTimeStamp: currentTimeStamp,
               Interest: that.state.interest,
               InterestRate: that.state.interestRate * 0.01,
               Paid: false
            });
            userRequestRef.child(key).set({
               PaymentTitle: that.state.paymentTitle,
               ReceiptID: key,
               Description: that.state.chargeDescription,
               Amount: userFlatList[i].price,
               OriginalAmount: userFlatList[i].price,
               Tip: that.state.tip,
               Tax: that.state.tax,
               Requester: uid,
               Charged: userFlatList[i].userID,
               RequesterName: that.state.fullName,
               ChargedName: userFlatList[i].name,
               ReceiptPic: null,
               PhotoKey: null,
               TimeStamp: currentTimeStamp,
               InterestTimeStamp: currentTimeStamp,
               Interest: that.state.interest,
               InterestRate: that.state.interestRate * 0.01,
               Paid: false
            });

            this.sendNotification(
               userFlatList[i].deviceId,
               user.displayName,
               userFlatList[i].price
            );
         }
         this.props.navigation.navigate("Activity");
      }
   }

   chargeUser(data) {
      var user = firebase.auth().currentUser;
      var uid = user.uid;
      var that = this;
      if (user == null) {
         alert("not logged in");
         return;
      }

      var index = 0;
      for (var i = 0; i < userFlatList.length; i++) {
         if (userFlatList[i].userID == data) {
            index = i;
            break;
         }
      }
      if (data == uid) {
         userFlatList.splice(index, 1);
         this.setState({
            refresh: !this.state.refresh
         });
         return;
      }

      var userRef = firebase
         .database()
         .ref("/Users")
         .child(uid);
      //  alert("in charge people")
      var currentTimeStamp = new Date().getTime();
      if (this.state.avatarSource != null) {
         const image = this.state.avatarSource.uri;

         const Blob = RNFetchBlob.polyfill.Blob;
         const fs = RNFetchBlob.fs;
         window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
         window.Blob = Blob;
         //    alert("after window blob")

         let uploadBlob = null;
         var paymentuidkey = firebase
            .database()
            .ref("/NewKey")
            .push().key;
         const imageRef = firebase
            .storage()
            .ref("reciepts")
            .child(paymentuidkey);
         //  alert("do i even get here")

         let mime = "image/jpg";
         //var currentTimeStamp = new Date().getTime()
         //  alert(currentTimeStamp)

         fs.readFile(image, "base64")
            .then(data => {
               //        alert("return blob")
               return Blob.build(data, { type: `${mime};BASE64` });
            })
            .then(blob => {
               uploadBlob = blob;
               //        alert("put blob")
               //      alert(blob)
               return imageRef.put(blob, { contentType: mime });
            })
            .then(() => {
               uploadBlob.close();
               //      alert("close blob")
               return imageRef.getDownloadURL();
            })
            .then(url => {
               var receiptpicURL = url;
               var userRequestRef = firebase
                  .database()
                  .ref("/Payments")
                  .child(uid)
                  .child("/Requesting");
               var chargedRef = firebase
                  .database()
                  .ref("/Payments")
                  .child(userFlatList[index].userID)
                  .child("/GettingCharged");
               var key = chargedRef.push().key;
               //  alert(key)
               chargedRef.child(key).set({
                  PaymentTitle: that.state.paymentTitle,
                  ReceiptID: key,
                  Description: that.state.chargeDescription,
                  Amount: userFlatList[index].price,
                  OriginalAmount: userFlatList[index].price,
                  Tip: that.state.tip,
                  Tax: that.state.tax,
                  Requester: uid,
                  Charged: userFlatList[index].userID,
                  RequesterName: that.state.fullName,
                  ChargedName: userFlatList[index].name,
                  ReceiptPic: receiptpicURL,
                  PhotoKey: paymentuidkey,
                  TimeStamp: currentTimeStamp,
                  InterestTimeStamp: currentTimeStamp,
                  Interest: userFlatList[index].interest,
                  InterestRate: userFlatList[index].interestRate * 0.01,
                  Paid: false
               });
               userRequestRef.child(key).set({
                  PaymentTitle: that.state.paymentTitle,
                  ReceiptID: key,
                  Description: that.state.chargeDescription,
                  Amount: userFlatList[index].price,
                  OriginalAmount: userFlatList[index].price,
                  Tip: that.state.tip,
                  Tax: that.state.tax,
                  Requester: uid,
                  Charged: userFlatList[index].userID,
                  RequesterName: that.state.fullName,
                  ChargedName: userFlatList[index].name,
                  ReceiptPic: receiptpicURL,
                  PhotoKey: paymentuidkey,
                  TimeStamp: currentTimeStamp,
                  InterestTimeStamp: currentTimeStamp,
                  Interest: userFlatList[index].interest,
                  InterestRate: userFlatList[index].interestRate * 0.01,
                  Paid: false
               });

               this.sendNotification(
                  userFlatList[index].deviceId,
                  user.displayName,
                  userFlatList[index].price
               );
            })
            .catch(error => {
               console.log(error);
            });
      } else {
         var userRequestRef = firebase
            .database()
            .ref("/Payments")
            .child(uid)
            .child("/Requesting");

         var chargedRef = firebase
            .database()
            .ref("/Payments")
            .child(userFlatList[index].userID)
            .child("/GettingCharged");
         var key = chargedRef.push().key;

         //  alert(key)
         chargedRef.child(key).set({
            PaymentTitle: that.state.paymentTitle,
            ReceiptID: key,
            Description: that.state.chargeDescription,
            Amount: userFlatList[index].price,
            OriginalAmount: userFlatList[index].price,
            Tip: that.state.tip,
            Tax: that.state.tax,
            Requester: uid,
            Charged: userFlatList[index].userID,
            RequesterName: that.state.fullName,
            ChargedName: userFlatList[index].name,
            ReceiptPic: null,
            PhotoKey: null,
            TimeStamp: currentTimeStamp,
            InterestTimeStamp: currentTimeStamp,
            Interest: userFlatList[index].interest,
            InterestRate: userFlatList[index].interestRate * 0.01,
            Paid: false
         });
         userRequestRef.child(key).set({
            PaymentTitle: that.state.paymentTitle,
            ReceiptID: key,
            Description: that.state.chargeDescription,
            Amount: userFlatList[index].price,
            OriginalAmount: userFlatList[index].price,
            Tip: that.state.tip,
            Tax: that.state.tax,
            Requester: uid,
            Charged: userFlatList[index].userID,
            RequesterName: that.state.fullName,
            ChargedName: userFlatList[index].name,
            ReceiptPic: null,
            PhotoKey: null,
            TimeStamp: currentTimeStamp,
            InterestTimeStamp: currentTimeStamp,
            Interest: userFlatList[index].interest,
            InterestRate: userFlatList[index].interestRate * 0.01,
            Paid: false
         });

         this.sendNotification(
            userFlatList[index].deviceId,
            user.displayName,
            userFlatList[index].price
         );
      }
      userFlatList.splice(index, 1);
      this.setState({
         refresh: !this.state.refresh
      });
      if (userFlatList.length == 0) {
         this.props.navigation.navigate("Activity");
      }
   }

   setInterest(value, userID) {
      for (var i = 0; i < userFlatList.length; i++) {
         if (userFlatList[i].userID == userID) {
            userFlatList[i].interest = value;
            break;
         }
      }
      console.log(this.state.refresh);
      this.setState({
         refresh: !this.state.refresh
      });
   }

   render() {
      return (
         <ScrollView>
            <View style={styles.container}>
               {/*<ScrollView>*/}
               <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                  <View
                     style={[
                        styles.avatar,
                        styles.avatarContainer,
                        { marginTop: 20, marginBottom: 20 }
                     ]}
                  >
                     {this.state.avatarSource === null ? (
                        <Text>Select a Photo</Text>
                     ) : (
                        <Image
                           style={styles.avatar}
                           source={this.state.avatarSource}
                        />
                     )}
                  </View>
               </TouchableOpacity>

               <FlatList
                  data={userFlatList}
                  width="100%"
                  extraData={this.state}
                  keyExtractor={index => index.toString()}
                  renderItem={({ item }) => (
                     <View>
                        <View
                           style={{
                              flex: 1,
                              flexDirection: "row",
                              justifyContent: "space-around",
                              backgroundColor: "white"
                           }}
                        >
                           <Text style={styles.UserListItem}>
                              {" "}
                              {item.name}{" "}
                           </Text>
                           <Text style={styles.UserListItem}> pays </Text>
                           <Text style={styles.UserListItem}>
                              ${item.price.toFixed(2)}
                           </Text>
                        </View>
                        <View
                           style={{
                              flex: 1,
                              flexDirection: "row",
                              justifyContent: "space-around",
                              backgroundColor: "white"
                           }}
                        >
                           <View style={{ alignItems: "center" }}>
                              <Picker
                                 selectedValue={item.interest}
                                 style={{ height: 35, width: 150 }}
                                 onValueChange={(itemValue, itemIndex) =>
                                    this.setInterest(itemValue, item.userID)
                                 }
                              >
                                 <Picker.Item
                                    label="No Interest"
                                    value="NONE"
                                 />
                                 <Picker.Item label="Daily" value="DAY" />
                                 <Picker.Item label="Weekly" value="WEEK" />
                                 <Picker.Item label="Monthly" value="MONTH" />
                              </Picker>
                           </View>

                           {item.interest != "NONE" && (
                              <TextInput
                                 style={styles.textInput3}
                                 keyboardType="numeric"
                                 placeholder="interest rate %"
                                 onChangeText={interestRate =>
                                    (item.interestRate = interestRate)
                                 }
                              />
                           )}

                           <TouchableOpacity
                              style={styles.button1}
                              onPress={() => this.chargeUser(item.userID)}
                           >
                              <Text style={styles.buttonText}>Charge</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  )}
               />

               {/*<Text style={styles.name}>{this.state.emailID}</Text>*/}

               <TextInput
                  style={styles.textInput1}
                  placeholder="Payment Title "
                  onChangeText={paymentTitle => this.setState({ paymentTitle })}
               />
               <TextInput
                  style={styles.textInput2}
                  placeholder="Description "
                  onChangeText={chargeDescription =>
                     this.setState({ chargeDescription })
                  }
               />

               <TouchableOpacity
                  style={styles.button2}
                  onPress={this.chargeALL.bind(this)}
               >
                  <Text style={styles.buttonText}> Charge Users </Text>
               </TouchableOpacity>

               <View>
                  {this.state.chargingPeople.map((data, index) => {
                     return <Text>{data.fullName}</Text>;
                  })}
               </View>
               {/*</ScrollView>*/}
            </View>
         </ScrollView>
      );
   }
}

const styles = StyleSheet.create({
   UserListItem: {
      fontFamily: "Raleway-Bold",
      color: "black",
      padding: 25,
      paddingLeft: 15,
      fontSize: 15
   },
   container: {
      flex: 1,
      backgroundColor: "#fcfcfe",
      alignItems: "center",
      justifyContent: "space-around",
      flexDirection: "column"
   },
   wrapper: {
      flex: 1
   },
   avatarContainer: {
      borderColor: "#9B9B9B",
      borderWidth: 1 / PixelRatio.get(),
      justifyContent: "center",
      alignItems: "center"
   },
   avatar: {
      borderRadius: 75,
      width: 150,
      height: 150
   },
   name: {
      fontFamily: "Raleway-Regular",
      marginTop: 20,
      fontSize: 20,
      color: "#3d3e52",
      fontWeight: "bold"
   },
   button1: {
      fontFamily: "Raleway-Regular",
      width: "20%",
      borderRadius: 90,
      backgroundColor: "#559535",
      paddingTop: 10,
      paddingBottom: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 10,
      height: 35
   },
   button2: {
      fontFamily: "Raleway-Regular",
      width: "50%",
      backgroundColor: "#559535",
      paddingTop: 10,
      borderRadius: 90,
      paddingBottom: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 10,
      height: 35
   },
   buttonText: {
      color: "white"
   },
   textInput1: {
      fontFamily: "Raleway-Regular",
      marginTop: 10,
      borderRadius: 100,
      backgroundColor: "rgba(117,125,117,0.2)",
      width: "50%",
      textAlign: "center",
      height: 35
   },
   textInput2: {
      fontFamily: "Raleway-Regular",
      marginBottom: 10,
      marginTop: 10,
      borderRadius: 100,
      textAlign: "center",
      backgroundColor: "rgba(117,125,117,0.2)",
      width: "50%",
      height: 35
   },
   textInput3: {
      fontFamily: "Raleway-Regular",
      marginTop: 10,
      borderRadius: 100,
      backgroundColor: "rgba(117,125,117,0.2)",
      width: "30%",
      textAlign: "center",
      height: 35
   }
});
