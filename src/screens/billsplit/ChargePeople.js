import React from "react";
import {
   AppRegistry,
   ScrollView,
   StyleSheet,
   Text,
   View,
   TextInput,
   TouchableOpacity,
   PixelRatio,
   Image,
   Picker,
   FlatList
} from "react-native";
import ProfileImage from "../profilePage/ProfileImage";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";
import "@firebase/storage";
import userSplitList from "../../data/userSplitList";

var data = [];

export default class ChargePeople extends React.Component {
   state = {
      avatarSource: null
   };
   constructor(props) {
      super(props);
      this.state = {
         paymentTitle: "",
         people: this.props.navigation.state.params.peps,
         result: this.props.navigation.state.params.amounts,
         tip: this.props.navigation.state.params.tip,
         tax: this.props.navigation.state.params.tax,
         emailID: "",
         email: "",
         chargeDescription: "",
         chargingPeople: data,
         interest: "NONE",
         interestRate: 0,
         refresh: false,
         avatarSource: null,
      };
      this.chargePeople = this.chargePeople.bind(this);
      //  this.chargeUser = this.chargeUser.bind(this);
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

   chargePeople() {
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
               // URL of the image uploaded on Firebase storage
               //console.log(url);
               //  alert(url)
               //  alert("current time" + currentTimeStamp)
               //    alert("chariging people length " +  that.state.chargingPeople.length)
               // alert(url);
               var receiptpicURL = url;
               var userRequestRef = firebase
                  .database()
                  .ref("/Payments")
                  .child(uid)
                  .child("/Requesting");
               for (i = 0; i < userSplitList.length; i++) {
                  if (userSplitList[i].userID == uid) {
                     continue;
                  }
                  var chargedRef = firebase
                     .database()
                     .ref("/Payments")
                     .child(userSplitList[i].userID)
                     .child("/GettingCharged");
                  var key = chargedRef.push().key;
                  //  alert(key)
                  chargedRef.child(key).set({
                     PaymentTitle: that.state.paymentTitle,
                     ReceiptID: key,
                     Description: that.state.chargeDescription,
                     Amount: userSplitList[i].price,
                     OriginalAmount: userSplitList[i].price,
                     Tip: that.state.tip,
                     Tax: that.state.tax,
                     Requester: uid,
                     Charged: userSplitList[i].userID,
                     RequesterName: that.state.fullName,
                     ChargedName: userSplitList[i].name,
                     ReceiptPic: receiptpicURL,
                     PhotoKey: paymentuidkey,
                     TimeStamp: currentTimeStamp,
                     InterestTimeStamp: currentTimeStamp,
                     Interest: userSplitList[i].interest,
                     InterestRate: userSplitList[i].interestRate * 0.01,
                     Paid: false
                  });
                  userRequestRef.child(key).set({
                     PaymentTitle: that.state.paymentTitle,
                     ReceiptID: key,
                     Description: that.state.chargeDescription,
                     Amount: userSplitList[i].price,
                     OriginalAmount: userSplitList[i].price,
                     Tip: that.state.tip,
                     Tax: that.state.tax,
                     Requester: uid,
                     Charged: userSplitList[i].userID,
                     RequesterName: that.state.fullName,
                     ChargedName: userSplitList[i].name,
                     ReceiptPic: receiptpicURL,
                     PhotoKey: paymentuidkey,
                     TimeStamp: currentTimeStamp,
                     InterestTimeStamp: currentTimeStamp,
                     Interest: userSplitList[i].interest,
                     InterestRate: userSplitList[i].interestRate * 0.01,
                     Paid: false
                  });

                  this.sendNotification(
                     userSplitList[i].deviceId,
                     user.displayName,
                     userSplitList[i].price
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

         for (i = 0; i < userSplitList.length; i++) {
            var chargedRef = firebase
               .database()
               .ref("/Payments")
               .child(userSplitList[i].userID)
               .child("/GettingCharged");
            if (userSplitList[i].userID == uid) {
               continue;
            }
            var key = chargedRef.push().key;

            //  alert(key)
            chargedRef.child(key).set({
               PaymentTitle: that.state.paymentTitle,
               ReceiptID: key,
               Description: that.state.chargeDescription,
               Amount: userSplitList[i].price,
               OriginalAmount: userSplitList[i].price,
               Tip: that.state.tip,
               Tax: that.state.tax,
               Requester: uid,
               Charged: userSplitList[i].userID,
               RequesterName: that.state.fullName,
               ChargedName: userSplitList[i].name,
               ReceiptPic: null,
               PhotoKey: null,
               TimeStamp: currentTimeStamp,
               InterestTimeStamp: currentTimeStamp,
               Interest: userSplitList[i].interest,
               InterestRate: userSplitList[i].interestRate * 0.01,
               Paid: false
            });
            userRequestRef.child(key).set({
               PaymentTitle: that.state.paymentTitle,
               ReceiptID: key,
               Description: that.state.chargeDescription,
               Amount: userSplitList[i].price,
               OriginalAmount: userSplitList[i].price,
               Tip: that.state.tip,
               Tax: that.state.tax,
               Requester: uid,
               Charged: userSplitList[i].userID,
               RequesterName: that.state.fullName,
               ChargedName: userSplitList[i].name,
               ReceiptPic: null,
               PhotoKey: null,
               TimeStamp: currentTimeStamp,
               InterestTimeStamp: currentTimeStamp,
               Interest: userSplitList[i].interest,
               InterestRate: userSplitList[i].interestRate * 0.01,
               Paid: false
            });

            this.sendNotification(
               userSplitList[i].deviceId,
               user.displayName,
               userSplitList[i].price
            );
         }
         this.props.navigation.navigate("Activity");
      }
   }

   setInterest(value, userID) {
      for (var i = 0; i < userSplitList.length; i++) {
         if (userSplitList[i].userID == userID) {
            userSplitList[i].interest = value;
            break;
         }
      }
      console.log(this.state.refresh);
      this.setState({
         refresh: !this.state.refresh
      });
   }

   chargeUser(data) {
      var user = firebase.auth().currentUser;
      var uid = user.uid;
      var that = this;
      var index = 0;
      if (user == null) {
         alert("not logged in");
         return;
      }
      var index = 0;
      for (var i = 0; i < userSplitList.length; i++) {
         if (userSplitList[i].userID == data) {
            index = i;
            break;
         }
      }
      if (data == uid) {
         userSplitList.splice(index, 1);
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
                  .child(userSplitList[index].userID)
                  .child("/GettingCharged");
               var key = chargedRef.push().key;
               //  alert(key)
               chargedRef.child(key).set({
                  PaymentTitle: that.state.paymentTitle,
                  ReceiptID: key,
                  Description: that.state.chargeDescription,
                  Amount: userSplitList[index].price,
                  OriginalAmount: userSplitList[index].price,
                  Tip: that.state.tip,
                  Tax: that.state.tax,
                  Requester: uid,
                  Charged: userSplitList[index].userID,
                  RequesterName: that.state.fullName,
                  ChargedName: userSplitList[index].name,
                  ReceiptPic: receiptpicURL,
                  PhotoKey: paymentuidkey,
                  TimeStamp: currentTimeStamp,
                  InterestTimeStamp: currentTimeStamp,
                  Interest: userSplitList[index].interest,
                  InterestRate: userSplitList[index].interestRate * 0.01,
                  Paid: false
               });
               userRequestRef.child(key).set({
                  PaymentTitle: that.state.paymentTitle,
                  ReceiptID: key,
                  Description: that.state.chargeDescription,
                  Amount: userSplitList[index].price,
                  OriginalAmount: userSplitList[index].price,
                  Tip: that.state.tip,
                  Tax: that.state.tax,
                  Requester: uid,
                  Charged: userSplitList[index].userID,
                  RequesterName: that.state.fullName,
                  ChargedName: userSplitList[index].name,
                  ReceiptPic: receiptpicURL,
                  PhotoKey: paymentuidkey,
                  TimeStamp: currentTimeStamp,
                  InterestTimeStamp: currentTimeStamp,
                  Interest: userSplitList[index].interest,
                  InterestRate: userSplitList[index].interestRate * 0.01,
                  Paid: false
               });

               this.sendNotification(
                  userSplitList[index].deviceId,
                  user.displayName,
                  userSplitList[index].price
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
            .child(userSplitList[index].userID)
            .child("/GettingCharged");
         var key = chargedRef.push().key;

         //  alert(key)
         chargedRef.child(key).set({
            PaymentTitle: that.state.paymentTitle,
            ReceiptID: key,
            Description: that.state.chargeDescription,
            Amount: userSplitList[index].price,
            OriginalAmount: userSplitList[index].price,
            Tip: that.state.tip,
            Tax: that.state.tax,
            Requester: uid,
            Charged: userSplitList[index].userID,
            RequesterName: that.state.fullName,
            ChargedName: userSplitList[index].name,
            ReceiptPic: null,
            PhotoKey: null,
            TimeStamp: currentTimeStamp,
            InterestTimeStamp: currentTimeStamp,
            Interest: userSplitList[index].interest,
            InterestRate: userSplitList[index].interestRate * 0.01,
            Paid: false
         });
         userRequestRef.child(key).set({
            PaymentTitle: that.state.paymentTitle,
            ReceiptID: key,
            Description: that.state.chargeDescription,
            Amount: userSplitList[index].price,
            OriginalAmount: userSplitList[index].price,
            Tip: that.state.tip,
            Tax: that.state.tax,
            Requester: uid,
            Charged: userSplitList[index].userID,
            RequesterName: that.state.fullName,
            ChargedName: userSplitList[index].name,
            ReceiptPic: null,
            PhotoKey: null,
            TimeStamp: currentTimeStamp,
            InterestTimeStamp: currentTimeStamp,
            Interest: userSplitList[index].interest,
            InterestRate: userSplitList[index].interestRate * 0.01,
            Paid: false
         });

         this.sendNotification(
            userSplitList[index].deviceId,
            user.displayName,
            userSplitList[index].price
         );
      }
      userSplitList.splice(index, 1);
      this.setState({
         refresh: !this.state.refresh
      });
      if (userSplitList.length == 0) {
         this.props.navigation.navigate("Activity");
      }
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
                  data={userSplitList}
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
                              onPress={
                                 () => this.chargeUser(item.userID)
                                 //this.chargePeople.bind(this)
                              }
                           >
                              <Text style={styles.buttonText}>Charge</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  )}
               />

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

               {this.state.interest != "NONE" && (
                  <TextInput
                     style={styles.textInput1}
                     keyboardType="numeric"
                     placeholder="interest rate %"
                     onChangeText={interestRate =>
                        this.setState({ interestRate })
                     }
                  />
               )}

               <TouchableOpacity
                  style={styles.button2}
                  onPress={this.chargePeople.bind(this)}
               >
                  <Text style={styles.buttonText}>Charge Users</Text>
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

   findUID = async email => {
      var ref = firebase.database().ref("/Users");
      var uid = "";
      var that = this;

      await ref
         .orderByChild("Email")
         .equalTo(email)
         .limitToFirst(1)
         .once("value", snapshot => {
            if (snapshot.numChildren() === 0) {
               alert("User not found");
               return;
            } else {
               snapshot.forEach(user => {
                  // console.log(user.key);
                  if (user.child("userID").val()) {
                     var newData = [...that.state.chargingPeople];
                     var dataDic = {
                        userID: user.child("userID").val(),
                        fullName: user.child("FullName").val()
                     };
                     newData.push(dataDic);

                     that.setState({
                        emailID: user.child("userID").val(),
                        chargingPeople: newData
                     });
                     // that.state.chargingPeople.append(user.child("userID").val()) //dont know if will work
                  } else {
                     alert("User with email " + email + " does not have a uid");
                  }
               });
            }
         });
      return;
   };
}

const styles = StyleSheet.create({
   UserListItem: {
      fontFamily: "Raleway-Bold",
      color: "black",
      padding: 25,
      paddingLeft: 15,
      fontSize: 15
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
      backgroundColor: "#559535",
      paddingTop: 10,
      paddingBottom: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 10,
      color: "#fcfcfe",
      borderRadius: 90,
      height: 35
   },
   button2: {
      fontFamily: "Raleway-Regular",
      width: "50%",
      backgroundColor: "#559535",
      paddingTop: 10,
      paddingBottom: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 10,
      borderRadius: 90,
      height: 35
   },
   buttonText: {
      color: "white",
      fontFamily: "Raleway-Regular"
   }
});

//
//
//
// import React from 'react';
// import { AppRegistry, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, PixelRatio, Image} from 'react-native';
// import ProfileImage from '../profilePage/ProfileImage'
// import ImagePicker from 'react-native-image-picker';
// import RNFetchBlob from 'react-native-fetch-blob';
// import firebase from '@firebase/app';
// import '@firebase/auth';
// import '@firebase/database';
// import '@firebase/storage';
//
//
//
// var data = []
//
// export default class ChargePeople extends React.Component {
//   state = {
//     avatarSource: null,
//
//   };
//     constructor(props) {
//         super(props);
//         this.state = {
//             paymentTitle: "",
//             people: this.props.navigation.state.params.peps,
//             result: this.props.navigation.state.params.amounts,
//             tip: this.props.navigation.state.params.tip,
//             tax: this.props.navigation.state.params.tax,
//             emailID: "",
//             email: "",
//             chargeDescription: "",
//             chargingPeople: data,
//
//         };
//         this.chargePeople = this.chargePeople.bind(this);
//         this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
//     }
//     componentDidMount(){
//         var user = firebase.auth().currentUser;
//         var uid = user.uid;
//         var that = this
//         if(user == null){
//             alert("not logged in");
//             //return to home screen
//             return;
//         }
//         var userDBref = firebase.database().ref('/Users').child(uid)
//
// //set the states with info in users table
//         userDBref.on('value', function(snapshot){
//             userData = snapshot.val();
//             that.setState({
//                 userID: uid,
//                 fullName: userData.FullName,
//             });
//         })
//
//
//
//     }
//
//     selectPhotoTapped() {
//       const options = {
//         quality: 1.0,
//         maxWidth: 500,
//         maxHeight: 500,
//         storageOptions: {
//           skipBackup: true,
//         },
//       };
//
//       ImagePicker.showImagePicker(options, (response) => {
//         console.log('Response = ', response);
//
//         if (response.didCancel) {
//           console.log('User cancelled photo picker');
//         } else if (response.error) {
//           console.log('ImagePicker Error: ', response.error);
//         } else if (response.customButton) {
//           console.log('User tapped custom button: ', response.customButton);
//         } else {
//           let source = { uri: response.uri };
//
//           // You can also display the image using data:
//           // let source = { uri: 'data:image/jpeg;base64,' + response.data };
//
//           this.setState({
//             avatarSource: source,
//           });
//         }
//       });
//     }
//
//
//     chargePeople(){
//         var user = firebase.auth().currentUser;
//         var uid = user.uid;
//         var that = this
//         if(user == null){
//             alert("not logged in");
//             return;
//         }
//         alert("in charge people")
//         const image = this.state.avatarSource.uri
//
//         const Blob = RNFetchBlob.polyfill.Blob
//         const fs = RNFetchBlob.fs
//         window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
//         window.Blob = Blob
//     //    alert("after window blob")
//
//         let uploadBlob = null
//         var paymentuidkey = firebase.database().ref('/NewKey').push().key
//         const imageRef = firebase.storage().ref('reciepts').child(paymentuidkey)
//       //  alert("do i even get here")
//
//         let mime = 'image/jpg'
//         var currentTimeStamp = new Date().getTime()
//       //  alert(currentTimeStamp)
//
//         fs.readFile(image, 'base64')
//           .then((data) => {
//     //        alert("return blob")
//             return Blob.build(data, { type: `${mime};BASE64` })
//
//         })
//         .then((blob) => {
//             uploadBlob = blob
//     //        alert("put blob")
//       //      alert(blob)
//             return imageRef.put(blob, { contentType: mime })
//           })
//           .then(() => {
//             uploadBlob.close()
//       //      alert("close blob")
//             return imageRef.getDownloadURL()
//           })
//           .then((url) => {
//             // URL of the image uploaded on Firebase storage
//             console.log(url);
//           //  alert(url)
//           //  alert("current time" + currentTimeStamp)
//         //    alert("chariging people length " +  that.state.chargingPeople.length)
//             // alert(url);
//             var receiptpicURL = url
//             var userRequestRef = firebase.database().ref('/Payments').child(uid).child('/Requesting')
//             for(i = 0; i < that.state.chargingPeople.length; i++){
//                 var chargedRef = firebase.database().ref('/Payments').child(that.state.chargingPeople[i].userID).child('/GettingCharged')
//                 var key = chargedRef.push().key;
//                 alert(key)
//                 chargedRef.child(key).set(
//                     {
//                         PaymentTitle: that.state.paymentTitle,
//                         ReceiptID: key,
//                         Description: that.state.chargeDescription,
//                         Amount: that.state.result,
//                         Tip: that.state.tip,
//                         Tax: that.state.tax,
//                         Requester: uid,
//                         Charged: that.state.chargingPeople[i].userID,
//                         RequesterName: that.state.fullName,
//                         ChargedName: that.state.chargingPeople[i].fullName,
//                         ReceiptPic: receiptpicURL,
//                         PhotoKey: paymentuidkey,
//                         TimeStamp: currentTimeStamp,
//                         Paid: false,
//                     }
//                 );
//                 userRequestRef.child(key).set(
//                     {
//                         PaymentTitle: that.state.paymentTitle,
//                         ReceiptID: key,
//                         Description: that.state.chargeDescription,
//                         Amount: that.state.result,
//                         Tip: that.state.tip,
//                         Tax: that.state.tax,
//                         Requester: uid,
//                         Charged: that.state.chargingPeople[i].userID,
//                         RequesterName: that.state.fullName,
//                         ChargedName: that.state.chargingPeople[i].fullName,
//                         ReceiptPic: receiptpicURL,
//                         PhotoKey: paymentuidkey,
//                         TimeStamp: currentTimeStamp,
//                         Paid: false,
//                     }
//                 );
//             }
//             this.props.navigation.navigate('Activity')
//           })
//           .catch((error) => {
//             console.log(error);
//
//           })
//
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 {/*<ScrollView>*/}
//                     <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
//                       <View
//                         style={[
//                           styles.avatar,
//                           styles.avatarContainer,
//                           { marginTop:20, marginBottom: 20 },
//                         ]}
//                       >
//                         {this.state.avatarSource === null ? (
//                           <Text>Select a Photo</Text>
//                         ) : (
//                           <Image style={styles.avatar} source={this.state.avatarSource} />
//                         )}
//                       </View>
//                     </TouchableOpacity>
//
//                     <Text style={styles.name}>Splitting between {this.state.people} people</Text>
//                     <Text style={styles.name}>Split Cost: {this.state.result.toFixed(2)} per person</Text>
//                     {/*<Text style={styles.name}>{this.state.emailID}</Text>*/}
//
//                     <TextInput
//                         style={styles.textInput1}
//                         placeholder='Payment Title '
//                         onChangeText={(paymentTitle) => this.setState({paymentTitle})}
//                     />
//                     <TextInput
//                         style={styles.textInput1}
//                         placeholder='Description '
//                         onChangeText={(chargeDescription) => this.setState({chargeDescription})}
//                     />
//                     <TextInput
//                         style={styles.textInput1}
//                         placeholder='Email '
//                         onChangeText={(email) => this.setState({email})}
//                     />
//                     <TouchableOpacity
//                         style={styles.button1}
//                         onPress={() => this.findUID(this.state.email)
//                         } >
//                         <Text> Find emailID </Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={styles.button1}
//                         onPress={ this.chargePeople.bind(this)
//                         } >
//                         <Text> Charge Users </Text>
//                     </TouchableOpacity>
//
//                     <View>
//                         {this.state.chargingPeople.map((data, index) => {
//                             return(
//                                 <Text>{data.fullName}</Text>
//                             );
//                         })}
//                     </View>
//                 {/*</ScrollView>*/}
//             </View>
//         );
//     }
//
//     findUID = async (email) => {
//         var ref = firebase.database().ref("/Users");
//         var uid = "";
//         var that = this;
//
//         await ref.orderByChild("Email").equalTo(email).limitToFirst(1)
//             .once("value", snapshot => {
//
//                 if (snapshot.numChildren() === 0) {
//                     alert("User not found");
//                     return;
//                 } else {
//                     snapshot.forEach( user => {
//                         // console.log(user.key);
//                         if (user.child("userID").val()) {
//                             var newData = [... that.state.chargingPeople]
//                             var dataDic = {
//                                 userID: user.child("userID").val(),
//                                 fullName: user.child("FullName").val()
//                             }
//                             newData.push(dataDic)
//
//                             that.setState(
//                                 {
//                                     emailID : user.child("userID").val(),
//                                     chargingPeople : newData
//                                 });
//                             // that.state.chargingPeople.append(user.child("userID").val()) //dont know if will work
//
//                         } else {
//                             alert("User with email " + email + " does not have a uid");
//                         }
//                     });
//                 }
//             });
//         return;
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fcfcfe',
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'column',
//     },
//     wrapper: {
//         flex: 1,
//     },
//     avatarContainer: {
//       borderColor: '#9B9B9B',
//       borderWidth: 1 / PixelRatio.get(),
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     avatar: {
//       borderRadius: 75,
//       width: 150,
//       height: 150,
//     },
//     name:{
//         fontFamily: "Raleway-Regular",
//         marginTop:20,
//         fontSize:20,
//         color:'#3d3e52',
//         fontWeight:'bold',
//     },
//     button1: {
//         fontFamily: "Raleway-Regular",
//         width: '30%',
//         backgroundColor: '#559535',
//         paddingTop: 10,
//         paddingBottom: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom:10,
//         marginTop:10,
//         elevation: 3,
//         color: "#fcfcfe"
//     },
//     button2: {
//         fontFamily: "Raleway-Regular",
//         width: '30%',
//         backgroundColor: '#3d3e52',
//         paddingTop: 10,
//         paddingBottom: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom:10,
//         marginTop:10,
//         elevation: 3,
//     },
//     buttonText: {
//         color: 'white',
//     },
//     textInput1:{
//         fontFamily: "Raleway-Regular",
//         marginTop:10,
//     },
//     textInput2:{
//         fontFamily: "Raleway-Regular",
//         marginBottom:10,
//         marginTop:10,
//     }
//     // textInput1:{
//     //     //fontFamily: "Raleway-Regular",
//     //     height: 40, width: "95%", borderColor: 'gray', borderWidth: 1,  marginBottom: 20,
//     //     paddingLeft: 10,
//     // },
//     // textInput2:{
//     //     height: 40, width: "95%", borderColor: 'gray', borderWidth: 1,  marginBottom: 20,
//     //     paddingLeft: 10,
//     //     //fontFamily: "Raleway-Regular",
//     // }
// });

// import React from 'react';
// import {
//   AppRegistry,
//   Image,
//   PixelRatio,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import ImagePicker from 'react-native-image-picker';
// import RNFetchBlob from 'react-native-fetch-blob';
// import firebase from '@firebase/app';
// import '@firebase/auth';
// import '@firebase/database';
// import '@firebase/storage';
//
// export default class ChargePeople extends React.Component {
//   state = {
//     avatarSource: null,
//     videoSource: null,
//   };
//
//   constructor(props) {
//     super(props);
//
//     this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
//     this.selectVideoTapped = this.selectVideoTapped.bind(this);
//     this.storeFcn = this.storeFcn.bind(this);
//   }
//
//   selectPhotoTapped() {
//     const options = {
//       quality: 1.0,
//       maxWidth: 500,
//       maxHeight: 500,
//       storageOptions: {
//         skipBackup: true,
//       },
//     };
//
//     ImagePicker.showImagePicker(options, (response) => {
//       console.log('Response = ', response);
//
//       if (response.didCancel) {
//         console.log('User cancelled photo picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else if (response.customButton) {
//         console.log('User tapped custom button: ', response.customButton);
//       } else {
//         let source = { uri: response.uri };
//
//         // You can also display the image using data:
//         // let source = { uri: 'data:image/jpeg;base64,' + response.data };
//
//         this.setState({
//           avatarSource: source,
//         });
//       }
//     });
//   }
//
//   selectVideoTapped() {
//     const options = {
//       title: 'Video Picker',
//       takePhotoButtonTitle: 'Take Video...',
//       mediaType: 'video',
//       videoQuality: 'medium',
//     };
//
//
//
//     ImagePicker.showImagePicker(options, (response) => {
//       console.log('Response = ', response);
//
//       if (response.didCancel) {
//         console.log('User cancelled video picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else if (response.customButton) {
//         console.log('User tapped custom button: ', response.customButton);
//       } else {
//         this.setState({
//           videoSource: response.uri,
//         });
//       }
//     });
//   }
//
//   storeFcn(){
//     alert("in storefcn")
// //     var storage = firebase.storage();
// //     var storageRef = storage.ref();
// //     var recieptRef = storageRef.child('Reciepts');
// // //      var recieptChargeRef = recieptRef.child(recieptIDKEY);
// //      var recieptChargeRef = recieptRef.child('Test');
// //      recieptChargeRef.put(this.state.avatarSource.uri).then(function(snapshot){
// //        alert('yay it worked');
//         const image = this.state.avatarSource.uri
//
//         const Blob = RNFetchBlob.polyfill.Blob
//         const fs = RNFetchBlob.fs
//         window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
//         window.Blob = Blob
//
//
//         let uploadBlob = null
//         const imageRef = firebase.storage().ref('posts').child("test.jpg")
//         let mime = 'image/jpg'
//         fs.readFile(image, 'base64')
//           .then((data) => {
//             return Blob.build(data, { type: `${mime};BASE64` })
//         })
//         .then((blob) => {
//             uploadBlob = blob
//             return imageRef.put(blob, { contentType: mime })
//           })
//           .then(() => {
//             uploadBlob.close()
//             return imageRef.getDownloadURL()
//           })
//           .then((url) => {
//             // URL of the image uploaded on Firebase storage
//             console.log(url);
//             alert(url);
//
//           })
//           .catch((error) => {
//             console.log(error);
//
//           })
//      }
//
//
//   render() {
//     return (
//       <View style={styles.container}>
//         <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
//           <View
//             style={[
//               styles.avatar,
//               styles.avatarContainer,
//               { marginBottom: 20 },
//             ]}
//           >
//             {this.state.avatarSource === null ? (
//               <Text>Select a Photo</Text>
//             ) : (
//               <Image style={styles.avatar} source={this.state.avatarSource} />
//             )}
//           </View>
//         </TouchableOpacity>
//
//         <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
//           <View style={[styles.avatar, styles.avatarContainer]}>
//             <Text>Select a Video</Text>
//           </View>
//         </TouchableOpacity>
//
//         <TouchableOpacity onPress={this.storeFcn.bind(this)}>
//           <View style={[styles.avatar, styles.avatarContainer]}>
//             <Text>storePic</Text>
//           </View>
//         </TouchableOpacity>
//
//
//         {this.state.videoSource && (
//           <Text style={{ margin: 8, textAlign: 'center' }}>
//             {this.state.videoSource}
//           </Text>
//         )}
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   avatarContainer: {
//     borderColor: '#9B9B9B',
//     borderWidth: 1 / PixelRatio.get(),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatar: {
//     borderRadius: 75,
//     width: 150,
//     height: 150,
//   },
// });

// import React from 'react';
// import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
// import ProfileImage from '../profilePage/ProfileImage'
// import firebase from '@firebase/app';
// import '@firebase/auth';
// import '@firebase/database';
//
//
// var data = []
//
// export default class ChargePeople extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             paymentTitle: "",
//             people: this.props.navigation.state.params.peps,
//             result: this.props.navigation.state.params.amounts,
//             tip: this.props.navigation.state.params.tip,
//             tax: this.props.navigation.state.params.tax,
//             emailID: "",
//             email: "",
//             chargeDescription: "",
//             chargingPeople: data,
//         };
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <ScrollView>
//
//                     <ProfileImage/>
//                     <Text style={styles.name}>Please enter {this.state.people} User Email</Text>
//                     <Text style={styles.name}>{this.state.result} per person</Text>
//                     <Text style={styles.name}>{this.state.emailID}</Text>
//                     <TextInput
//                         style={styles.textInput1}
//                         placeholder='Description '
//                         autoCapitalize={'none'}
//                         onChangeText={(chargeDescription) => this.setState({chargeDescription})}
//                     />
//                     <TextInput
//                         style={styles.textInput1}
//                         placeholder='Email '
//                         autoCapitalize={'none'}
//                         onChangeText={(email) => this.setState({email})}
//                     />
//                     <TouchableOpacity
//                         style={styles.button1}
//                         onPress={() => this.findUID(this.state.email)
//                         } >
//                         <Text> Find emailID </Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={styles.button1}
//                         onPress={() => this.chargePeople(this.state)
//                         } >
//                         <Text> Charge Them </Text>
//                     </TouchableOpacity>
//
//
//                     <View>
//                         {this.state.chargingPeople.map((data, index) => {
//                             return(
//                                 <Text>{data}</Text>
//                             );
//                         })}
//                     </View>
//
//                 </ScrollView>
//             </View>
//         );
//     }
//
//     findUID = async (email) => {
//         var ref = firebase.database().ref("/Users");
//         var uid = "";
//         var that = this;
//         await ref.orderByChild("Email").equalTo(email).limitToFirst(1)
//             .once("value", snapshot => {
//                 // console.log(snapshot);
//                 // console.log(snapshot.key);
//
//                 if (snapshot.numChildren() === 0) {
//                     alert("User not found");
//                     return;
//                 } else {
//                     snapshot.forEach( user => {
//                         // console.log(user.key);
//                         if (user.child("userID").val()) {
//                             if(that.state.chargingPeople.length >= that.state.people)
//                             {
//                                 alert("you have reached the maximum number of users to charge");
//                                 return;
//                             }
//                             var newData = [... that.state.chargingPeople]
//                             newData.push(user.child("userID").val())
//
//                             that.setState(
//                                 {
//                                     emailID : user.child("userID").val(),
//                                     chargingPeople : newData
//                                 });
//                             // that.state.chargingPeople.append(user.child("userID").val()) //dont know if will work
//
//                         } else {
//                             alert("User with email " + email + " does not have a uid");
//                         }
//                     });
//                 }
//             });
//         return;
//     }
//
//     chargePeople = async (state) => {
//         var user = firebase.auth().currentUser;
//         var uid = user.uid;
//         var that = this
//         if(user == null){
//             alert("not logged in");
//             return;
//         }
//         // var userRef = firebase.database().ref('/Users').child(uid)
//         // // var userFullName = userRef.child("FullName").val()
//         var userRequestRef = firebase.database().ref('/Payments').child(uid).child('/Requesting')
//         for(i = 0; i < state.chargingPeople.length; i++){
//             //  console.log(state.chargingPeople[i]);
//             var chargedRef = firebase.database().ref('/Payments').child(state.chargingPeople[i].userID).child('/GettingCharged')
//             var key = chargedRef.push().key;
//             chargedRef.child(key).set(
//                 {
//                     PaymentTitle: that.state.paymentTitle,
//                     ReceiptID: key,
//                     Description: that.state.chargeDescription,
//                     Amount: that.state.result,
//                     Tip: that.state.tip,
//                     Tax: that.state.tax,
//                     Requester: uid,
//                     Charged: that.state.chargingPeople[i].userID,
//                     RequesterName: that.state.fullName,
//                     ChargedName: that.state.chargingPeople[i].fullName,
//                     ReceiptPic: "",
//                     Paid: false,
//                 }
//             );
//             userRequestRef.child(key).set(
//                 {
//                     PaymentTitle: that.state.paymentTitle,
//                     ReceiptID: key,
//                     Description: that.state.chargeDescription,
//                     Amount: that.state.result,
//                     Tip: that.state.tip,
//                     Tax: that.state.tax,
//                     Requester: uid,
//                     Charged: that.state.chargingPeople[i].userID,
//                     RequesterName: that.state.fullName,
//                     ChargedName: that.state.chargingPeople[i].fullName,
//                     ReceiptPic: "",
//                     Paid: false,
//                 }
//             );
//             //    alert(state.chargingPeople[i])
//
//         }
//         this.props.navigation.navigate('Friends')
//     }
//
//
//
// //     joinByEmail(email) {
// //   var ref = firebase.database().ref("/Users");
// //   var uid = "";
// //   ref.orderByChild("Email").equalTo(email).limitToFirst(1)
// //     .once("value", snapshot => {
// //       // console.log(snapshot);
// //       // console.log(snapshot.key);
// //
// //       if (snapshot.numChildren() === 0) {
// //         alert("User not found");
// //         return;
// //       } else {
// //         snapshot.forEach( user => {
// //           // console.log(user.key);
// //           if (user.child("HouseID").val()) {
// //             this.joinHouse(user.child("HouseID").val());
// //           } else {
// //             alert("User with email " + email + " does not have a house with us");
// //           }
// //         });
// //       }
// //     });
// //
// //   return;
// // }
// }
//
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fcfcfe',
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'column',
//     },
//     wrapper: {
//         flex: 1,
//     },
//     name:{
//         //fontFamily: "Futura-Medium-Italic",
//         fontStyle: 'italic',
//         marginTop:20,
//         fontSize:20,
//         color:'#559535',
//         fontWeight:'bold',
//     },
//     button1: {
//         //fontFamily: "Raleway-Regular",
//         width: '30%',
//         backgroundColor: '#559535',
//         paddingTop: 10,
//         paddingBottom: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom:10,
//         marginTop:10,
//         elevation: 3,
//     },
//     button2: {
//         //fontFamily: "Raleway-
//         width: '30%',
//         backgroundColor: '#3d3e52',
//         paddingTop: 10,
//         paddingBottom: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom:10,
//         marginTop:10,
//         elevation: 3,
//     },
//     buttonText: {
//         color: 'white',
//     },
//     textInput1:{
//         //fontFamily: "Raleway-Regular",
//         height: 40, width: "95%", borderColor: 'gray', borderWidth: 1,  marginBottom: 20,
//         paddingLeft: 10,
//     },
//     textInput2:{
//         height: 40, width: "95%", borderColor: 'gray', borderWidth: 1,  marginBottom: 20,
//         paddingLeft: 10,
//         //fontFamily: "Raleway-Regular",
//     }
// });
