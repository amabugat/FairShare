import React from "react";
import {
   StyleSheet,
   Text,
   View,
   TextInput,
   TouchableOpacity,
   KeyboardAvoidingView,
   TouchableWithoutFeedback,
   Keyboard,
   PixelRatio,
   Image,
   ScrollView
} from "react-native";
import { Card, Avatar, ListItem, Icon, List } from "react-native-elements";
import ProfileImage from "./ProfileImage";
import DatePicker from "react-native-datepicker";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";
import "@firebase/storage";
export default class EditProfile extends React.Component {
   state = {
      firstName: "",
      lastName: "",
      password: "",
      phoneNum: "",
      email: "",
      userID: "",
      date: "",
      avatarSource: null,
      pic: false
   };
   componentDidMount() {
      var user = firebase.auth().currentUser;
      var uid = user.uid;
      var userDBref = firebase
         .database()
         .ref("/Users")
         .child(uid);
      var that = this;
      var userData = "";
      //  const snapshot = userDBref.once('value')
      userDBref.on("value", function(snapshot) {
         userData = snapshot.val();

         that.setState({
            firstName: userData.FirstName,
            lastName: userData.LastName,
            userID: uid,
            phoneNum: userData.PhoneNum,
            email: userData.Email,
            avatarSource: userData.PhotoURL
         });

         if (userData.PhotoURL != null) {
            that.setState({
               pic: true
            });
         }
      });
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

   render() {
      return (
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
               <View style={styles.container}>
                  <View style={styles.headerColumn}>
                     <TouchableOpacity
                        onPress={this.selectPhotoTapped.bind(this)}
                     >
                        <Avatar
                           style={styles.userImage}
                           rounded
                           size={120}
                           imageProps={{ resizeMode: "cover" }}
                           source={
                              this.state.avatarSource === null ? (
                                 <Text>Select a Photo</Text>
                              ) : (
                                 { uri: this.state.avatarSource }
                              )
                           }
                        />
                     </TouchableOpacity>
                  </View>

                  <TextInput
                     style={styles.textInput1}
                     placeholder="First Name"
                     value={this.state.firstName}
                     onChangeText={firstName => this.setState({ firstName })}
                  />

                  <View style={styles.separator} />

                  <TextInput
                     style={styles.textInput2}
                     value={this.state.lastName}
                     onChangeText={lastName => this.setState({ lastName })}
                     placeholder=" Last Name "
                  />

                  <View style={styles.separator} />

                  <TextInput
                     style={styles.textInput2}
                     keyboardType="numeric"
                     maxLength={10}
                     value={this.state.phoneNum}
                     onChangeText={phoneNum => this.setState({ phoneNum })}
                     placeholder="Phone Number"
                  />

                  <View style={styles.separator} />

                  <TextInput
                     style={styles.textInput2}
                     value={this.state.email}
                     placeholder="Email"
                  />

                  {/*<Text style={styles.textInput2}>{this.state.email}</Text>*/}

                  <View style={styles.separator} />

                  <DatePicker
                     style={{ width: 200 }}
                     date={this.state.date}
                     mode="date"
                     placeholder="select date"
                     format="YYYY-MM-DD"
                     minDate="1900-01-01"
                     maxDate="2018-12-31"
                     confirmBtnText="Confirm"
                     cancelBtnText="Cancel"
                     customStyles={{
                        dateIcon: {
                           position: "absolute",
                           left: 0,
                           top: 4,
                           marginLeft: 0
                        },
                        dateInput: {
                           marginLeft: 36
                        }
                        // ... You can check the source to find the other keys.
                     }}
                     onDateChange={date => {
                        this.setState({ date: date });
                     }}
                  />
                  {/*<Text style={styles.name}>DATE INPUT with datepicker </Text>*/}

                  <View style={styles.separator} />

                  <View style={styles.buttonRow}>
                     <TouchableOpacity
                        onPress={() =>
                           this.editProfile(
                              this.state.firstName,
                              this.state.lastName,
                              this.state.phoneNum,
                              this.state.date
                           )
                        }
                        style={styles.button2}
                     >
                        <Text style={styles.buttonText1}> Save </Text>
                     </TouchableOpacity>

                     <TouchableOpacity
                        onPress={() =>
                           this.props.navigation.navigate("Friends")
                        }
                        style={styles.button2}
                     >
                        <Text style={styles.buttonText2}> Cancel </Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </ScrollView>
         </TouchableWithoutFeedback>
      );
   }

   editProfile = (firstName, lastName, phoneNum, date) => {
      var that = this;
      var user = firebase.auth().currentUser;
      user
         .updateProfile({
            displayName: firstName + " " + lastName
         })
         .then(
            function() {
               // Profile updated successfully!
               // "Jane Q. User"
               var displayName = user.displayName;
               console.log(displayName);
            },
            function(error) {
               // An error happened.
               console.log(error);
            }
         );
      var uid = user.uid;
      var userDBref = firebase
         .database()
         .ref("/Users")
         .child(uid);

      if (this.state.avatarSource != null && this.state.pic == false) {
         const image = this.state.avatarSource.uri;

         const Blob = RNFetchBlob.polyfill.Blob;
         const fs = RNFetchBlob.fs;
         window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
         window.Blob = Blob;

         let uploadBlob = null;
         const imageRef = firebase
            .storage()
            .ref("Users")
            .child(uid);
         let mime = "image/jpg";
         fs.readFile(image, "base64")
            .then(data => {
               return Blob.build(data, { type: `${mime};BASE64` });
            })
            .then(blob => {
               uploadBlob = blob;
               return imageRef.put(blob, { contentType: mime });
            })
            .then(() => {
               uploadBlob.close();
               return imageRef.getDownloadURL();
            })
            .then(url => {
               // URL of the image uploaded on Firebase storage
               console.log(url);
               //  alert(url);
               userDBref.update({
                  FirstName: firstName,
                  LastName: lastName,
                  FullName: firstName + " " + lastName,
                  PhoneNum: phoneNum,
                  DateofBirth: date,
                  PhotoURL: url
               });
               this.props.navigation.navigate("ProfilePage");
            })
            .catch(error => {
               console.log(error);
            });
      } else {
         userDBref.update({
            FirstName: firstName,
            LastName: lastName,
            FullName: firstName + " " + lastName,
            PhoneNum: phoneNum,
            DateofBirth: date,
            PhotoURL: this.state.avatarSource
         });
         this.props.navigation.navigate("ProfilePage");
      }
   };
}

const styles = StyleSheet.create({
   container: {
      flex: 1
   },
   buttonRow: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-evenly"
   },
   separator: {
      height: 1,
      backgroundColor: "#CED0CE"
   },
   button1: {
      backgroundColor: "#559535",
      padding: 10,
      height: 40,
      borderRadius: 85,
      elevation: 3,
      marginTop: 200
   },
   button2: {
      backgroundColor: "#559535",
      height: 40,
      width: 95,
      borderRadius: 45,
      padding: 10,
      marginTop: 200,
      elevation: 3
   },
   textField: {
      fontFamily: "Raleway-Regular",
      textAlign: "center",
      color: "white",
      fontSize: 20,
      marginBottom: 15
   },
   buttonText1: {
      fontFamily: "Raleway-Regular",
      textAlign: "center",
      color: "white"
   },
   buttonText2: {
      fontFamily: "Raleway-Regular",
      textAlign: "center",
      color: "white"
   },
   headerColumn: {
      backgroundColor: "#559535",
      justifyContent: "center"
   },
   userImage: {
      borderColor: "white",
      borderRadius: 85,
      borderWidth: 3,
      height: 120,
      marginBottom: 15,
      width: 120,
      marginTop: 15,
      marginLeft: 125
   },
   cardContainer: {
      backgroundColor: "#FFF",
      borderWidth: 0,
      flex: 1,
      margin: 0,
      padding: 0
   },
   numberContainer: {
      backgroundColor: "#FFF",
      flex: 1,
      paddingTop: 30
   },
   emailContainer: {
      backgroundColor: "#FFF",
      flex: 1,
      paddingTop: 30
   },
   numberIconStyles: {
      marginLeft: 12
   },
   emailIconStyles: {
      marginLeft: 10
   },
   bodyText: {
      color: "black",
      paddingBottom: 3
   },
   emailTextStyle: {
      marginBottom: 5,
      marginLeft: 13
   },
   numberTextStyle: {
      marginTop: 5,
      marginLeft: 17
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
   }
});
