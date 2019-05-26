// import React from 'react';
// import {StyleSheet, Text, View, Button, TouchableOpacity, Image, PermissionsAndroid} from 'react-native';
// import {
//     Container,
//     Header,
//     Title,
//     Content,
//     Icon,
//     Card,
//     CardItem,
//     Thumbnail,
//     Left,
//     Body,
//     Right
// } from "native-base";
// import Geocoder from 'react-native-geocoding';
// //import {PermissionsAndroid} from 'react-native';
// export default class Camera extends React.Component {
//     constructor(props){
//         super(props);
//         this.state = {
//           lat: 0,
//           lng: 0,
//           address: "",
//           tax: 0,
//           zip: 0,
//         }
//     }
//
//   async componentWillMount(){
//         var that = this;
//
//       await navigator.geolocation.getCurrentPosition(position => {
//         that.setState({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         })
//
//
//       })
//
//       //geolocation.requestAuthorization();
//   //    var that = this;
//
//     //  Geocoder.init("AIzaSyDFyouQS3-6HaTjtyRp-wpEVogv6EVC_0s");
//       // await navigator.geolocation.getCurrentPosition(position => {
//       //   that.setState({
//       //     lat: position.coords.latitude,
//       //     lng: position.coords.longitude,
//       //   })
//       //
//       //
//       // })
//       // await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=34.1397,-118.0353&key=AIzaSyDfAZDo1UpXtkp2dO9VaZ1VIWrLtc7TjQc')
//       // .then(response => response.json())
//       // .then((responseJson)=> {
//       //   // this.setState({
//       //   //  tax: responseJson.taxSales,
//       //   // })
//       //   //alert(responseJson)
//       //   var addy = responseJson.results[0].address_components[0].long_name;
//       //   var result = responseJson.results[0].address_components[6].long_name;
//       //   console.log(result)
//       //   that.setState({
//       //     zip: result,
//       //     address: addy
//       //   })
//       //   // fetch("https://api.zip-tax.com/request/v40?key=FQMDodzmaEHJcRy3&postalcode="+ result)
//       //   //      .then(response => response.json())
//       //   //      .then((responseJson)=> {
//       //   //        this.setState({
//       //   //         tax: responseJson.taxSales,
//       //   //        })
//       //   //      })
//       //   //      .catch(error=>console.log(error)) //to catch the errors if any
//       //    })
//       //    // .catch(error => console.log(error));
//       // .catch(error=>console.log(error)) //to catch the errors if any
//       //
//       //  fetch("https://api.zip-tax.com/request/v40?key=FQMDodzmaEHJcRy3&postalcode=" + this.state.zip)
//       //      .then(response => response.json())
//       //      .then((responseJson)=> {
//       //        console.log(responseJson.results)
//       //        var decimalTax = responseJson.results[0].taxSales*100;
//       //        this.setState({
//       //         tax: decimalTax,
//       //        })
//       //      })
//       //      .catch(error=>console.log(error)) //to catch the errors if any
//       }
//
//
//     render() {
//         return (
//             <View style={styles.container}>
//               <Text>Lat: {this.state.lat} </Text>
//               <Text>Lng: {this.state.lng} </Text>
//               <Text> Address: {this.state.address} </Text>
//               <Text> Tax: {this.state.tax} </Text>
//               <Text> Tax: {this.state.zip} </Text>
//
//             </View>
//
//         );
//     }
//
//
//
//
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#3d3e52',
//         alignItems: 'center',
//         justifyContent: 'flex-start',
//     },
//     cardStyle: {
//         width: "80%",
//         // height:"50%",
//         // paddingVertical: 5,
//     },
//     button1: {
//         // width: '30%',
//         backgroundColor: '#559535',
//         // paddingTop: 10,
//         // paddingBottom: 10,
//         padding:10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         // marginBottom:10,
//         // marginTop:10,
//         elevation: 3,
//     },
//     buttonText: {
//         fontFamily: "Raleway-Regular",
//         color: 'white',
//     },
// });

import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
    PixelRatio, StyleSheet
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNTesseractOcr from 'react-native-tesseract-ocr';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

const Button = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableOpacity;
const imagePickerOptions = {
    quality: 1.0,
    maxWidth: 2000,
    maxHeight: 3000,
    storageOptions: {
        skipBackup: true,
    },
};
const tessOptions = {
    whitelist: null,
    blacklist: null
};

class Camera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            extractedText: null,
            hasErrored: false,
            imageSource: null,
            isLoading: false,
        };
        this.selectImage = this.selectImage.bind(this);
    }
    componentDidMount(){
      console.log("in mount")
      var exstring= 'Spagetti pasta      2.00'
      if(/(?=\d\.\d{2})/.test(exstring)){
        console.log("its true")
      }
      ///Roger(?= Waters)/.test('Roger is my dog') //false
      const re = /((\w+\s)+)(\s+)(\d\.\d{2})/
      //\d{2}
      const hehe = re.exec(exstring)
      console.log(hehe);
      console.log(hehe.length)
      console.log(hehe[1])
      console.log(hehe[hehe.length-1])

      var that = this
      var uid = '1R1vjOJ10dOAVjUta1WPKSFTqQI3'
      var userRef = firebase.database().ref('/Users').child(uid);
      userRef.on('value', function(data){
        console.log(data.val())
        // that.setState({
        //   deviceID: data.val().DeviceID
        // })
      })


    }

    selectImage() {
        this.setState({ isLoading: true });

        ImagePicker.showImagePicker(imagePickerOptions, (response) => {
            if (response.didCancel) {
                this.setState({ isLoading: false });
            } else if (response.error) {
                this.setState({ isLoading: false, hasErrored: true, errorMessage: response.error });
            } else {
                const source = { uri: response.uri };
                this.setState({ imageSource: source, hasErrored: false, errorMessage: null }, this.extractTextFromImage(response.path));
            }
        });
    }

    extractTextFromImage(imagePath) {
        RNTesseractOcr.recognize(imagePath, 'LANG_ENGLISH', tessOptions)
            // .then((result)=> {
            //     const regex = /\d+.?\d*$/; //regex matching decimal value at end of line
            //     let newResult = result;
            //     console.log(newResult);
            //
            //     return newResult
            //         .replace(/[|'"]+/g, '')
            //         .split('\n')
            //         .map(line => {
            //             line = line.trim(); //trim whitespace
            //             let index = line.search(regex); //returns index of beginning of match
            //             return [
            //                 line
            //                     .substring(0, index)
            //                     .trim(),
            //                 line
            //                    s .substring(index)
            //                     .trim()
            //             ]; //return array of two trimmed strings
            //         });
            // })
            .then((result) => {
                var output = result.split('\n');
                var item = [];
                var price = [];
                var test = 0;
                // const re = /(\w+)\s(\d\.\d{2})/
                // const hehe = re.exec('Spagetti     2.00')
                // console.log(hehe);
                for(var i = 0; i < output.length; i++)
                {
                    // if(output[i].includes('Grand'))
                    // {
                    //     item.push(output[i]);
                    //
                    //         price.push(output[i].split(' '));
                    //  }
                    if(/(?=\d\.\d{2})/.test(output[i])){
                      console.log("its true")
                      const re = /((\w+\s)+)(\s+)(\d\.\d{2})/
                      //\d{2}
                      const hehe = re.exec(output[i])
                      console.log(hehe);
                      console.log(hehe[1])
                      console.log(hehe[hehe.length-1])
                      item.push(hehe[1]);
                      price.push(hehe[hehe.length-1]);
                    }

                    // const re = /((\w+\s)+)(\s+)(\d\.\d{2})/
                    // //\d{2}
                    // const hehe = re.exec(exstring)
                    // console.log(hehe);
                    // console.log(hehe.length)
                    // console.log(hehe[1])
                    // console.log(hehe[hehe.length-1])


                }
              //  test = price[0][2];
                console.log(test);
                console.log(price);
                // console.log(item);
                this.setState({ isLoading: false, extractedText: result});
                // var test = output.match(/(.*)\sTotal.+/g);
                // console.log(test);
                // console.log(result.split('\n'));
            })
            .catch((err) => {
                this.setState({ hasErrored: true, errorMessage: err.message });
            });
    }

    render() {
        const { errorMessage, extractedText, hasErrored, imageSource, isLoading } = this.state;
        return (
            <View style={styles.container}>
                <Button onPress={this.selectImage} >
                    <View style={[styles.image, styles.imageContainer, !imageSource && styles.rounded]}>
                        {
                            imageSource === null
                                ? <Text>Tap me!</Text>
                                : <Image style={styles.image} source={imageSource} />
                        }
                    </View>
                </Button>
                {
                    isLoading
                        ? <ActivityIndicator size="large" />
                        : (
                            hasErrored
                                ? <Text>{errorMessage}</Text>
                                : <Text>{extractedText}</Text>
                        )
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        margin: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    imageContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    image: {
        width: 150,
        height: 300,
    },
    rounded: {
        borderRadius: 75,
    }
});

Camera.navigationOptions = {
    title: 'Image Picker Example',
};

export default Camera;




// // import React from 'react';
// // import {StyleSheet, Text, View, Button, TouchableOpacity, Image} from 'react-native';
// // import {
// //     Container,
// //     Header,
// //     Title,
// //     Content,
// //     Icon,
// //     Card,
// //     CardItem,
// //     Thumbnail,
// //     Left,
// //     Body,
// //     Right
// // } from "native-base";
// // import Landing from './Landing.js';
// // import firebase from '@firebase/app';
// // import '@firebase/auth';
// // import '@firebase/database';
// //
// //
// // import ImagePicker from 'react-native-image-picker';
// //
// //
// // const options = {
// //   title: 'Select Avatar',
// //   takePhotoButtonTitle: 'Take photo',
// //   chooseFromLibraryButtonTitle: 'choose from Library',
// // };
// //
// // export default class Camera extends React.Component {
// //
// //     constructor(props){
// //         super(props);
// //
// //         // frontend display of list from react native
// //         // this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 != r2})
// //
// //         this.state = {
// //           avatarSource:null
// //         }
// //     }
// //
// //     // async componentDidMount(){
// //     //
// //     // }
// //     picFcn(){
// //       ImagePicker.showImagePicker(options, (response) => {
// //         console.log('Response = ', response);
// //         alert(response.uri);
// //
// //         if (response.didCancel) {
// //           console.log('User cancelled image picker');
// //         } else if (response.error) {
// //           console.log('ImagePicker Error: ', response.error);
// //         } else if (response.customButton) {
// //           console.log('User tapped custom button: ', response.customButton);
// //         } else {
// //           //const source = { uri: response.uri };
// //           var source = response.uri ;
// //
// //           // You can also display the image using data:
// //           // const source = { uri: 'data:image/jpeg;base64,' + response.data };
// //           this.setState({
// //             avatarSource: source,
// //           });
// //         }
// //       });
// //     }
// //
// //     async storeFcn(){
// //       var storage = firebase.storage();
// //       var storageRef = storage.ref();
// //       var recieptRef = storageRef.child('Reciepts');
// // //      var recieptChargeRef = recieptRef.child(recieptIDKEY);
// //        var recieptChargeRef = recieptRef.child('Test');
// //        await recieptChargeRef.put(this.state.avatarSource).then(function(snapshot){
// //          alert('yay it worked');
// //        })
// //     }
// //
// //     getFromFirebase(){
// //       //var starsRef = storageRef.child('Reciepts/' +recieptIDKET);
// //      var starsRef = storageRef.child('Reciepts/' +'Test');
// // // Get the download URL
// //       starsRef.getDownloadURL().then(function(url) {
// //         // Insert url into an <img> tag to "download"
// //
// //       })
// //
// //         // A full list of error codes is available at
// //
// //       }
// //
// //
// //
// //     render() {
// //         return (
// //             <View style={styles.container}>
// //               <Text>Hi </Text>
// //               <Image
// //                  style={{width: 66, height: 58}}
// //                  source={{uri: this.state.avatarSource}}
// //                />
// //               <TouchableOpacity onPress = {this.picFcn}>
// //                 <Text>Select Image</Text>
// //               </TouchableOpacity>
// //
// //               <TouchableOpacity onPress = {this.storeFcn}>
// //                 <Text>store Image</Text>
// //               </TouchableOpacity>
// //             </View>
// //
// //         );
// //     }
// //
// //
// //
// //
// // }
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#3d3e52',
// //         alignItems: 'center',
// //         justifyContent: 'flex-start',
// //     },
// //     cardStyle: {
// //         width: "80%",
// //         // height:"50%",
// //         // paddingVertical: 5,
// //     },
// //     button1: {
// //         // width: '30%',
// //         backgroundColor: '#559535',
// //         // paddingTop: 10,
// //         // paddingBottom: 10,
// //         padding:10,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         // marginBottom:10,
// //         // marginTop:10,
// //         elevation: 3,
// //     },
// //     buttonText: {
// //         fontFamily: "Raleway-Regular",
// //         color: 'white',
// //     },
// // });
// import React from 'react';
// import RNTesseractOcr from 'react-native-tesseract-ocr';
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
// export default class Camera extends React.Component {
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
//   componentDidMount(){
//       alert("hi;")
//       console.log("here")
//       RNTesseractOcr
//           .startOcr("../images/receipt.jpg", "LANG_ENGLISH")
//           .then((result) => {
//
//               const regex = /\d+.?\d*$/; //regex matching decimal value at end of line
//               let newResult = result;
//               console.log(newResult);
//
//               return newResult
//                   .replace(/[|'"]+/g, '')
//                   .split('\n')
//                   .map(line => {
//                       line = line.trim(); //trim whitespace
//                       let index = line.search(regex); //returns index of beginning of match
//                       return [
//                           line
//                               .substring(0, index)
//                               .trim(),
//                           line
//                               .substring(index)
//                               .trim()
//                       ]; //return array of two trimmed strings
//                   });
//
//           })
//           .then((result) => {
//            //   this.saveReceipt(result);
//            //  Actions.ConfirmItemDetails();
//               console.log(result);
//               alert(result);
//           })
//           .catch((err) => {
//               console.log("OCR Error: ", err);
//           })
//           .done(console.log("done!"));
//
//   }
//
//
//     selectPhotoTapped() {
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
//
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
//
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
// //
// // import {
// //   AppRegistry,
// //   StyleSheet,
// //   Text,
// //   View
// // } from 'react-native';
// // import firebase from 'firebase'
// // import RNFetchBlob from 'react-native-fetch-blob'
// // import CameraRollPicker from 'react-native-camera-roll-picker'
// // export default class Gallery extends Component {
// //
// //   getSelectedImages = (selectedImages, currentImage) => {
// //
// //     const image = currentImage.uri
// //
// //     const Blob = RNFetchBlob.polyfill.Blob
// //     const fs = RNFetchBlob.fs
// //     window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
// //     window.Blob = Blob
// //
// //
// //     let uploadBlob = null
// //     const imageRef = firebase.storage().ref('posts').child("test.jpg")
// //     let mime = 'image/jpg'
// //     fs.readFile(image, 'base64')
// //       .then((data) => {
// //         return Blob.build(data, { type: `${mime};BASE64` })
// //     })
// //     .then((blob) => {
// //         uploadBlob = blob
// //         return imageRef.put(blob, { contentType: mime })
// //       })
// //       .then(() => {
// //         uploadBlob.close()
// //         return imageRef.getDownloadURL()
// //       })
// //       .then((url) => {
// //         // URL of the image uploaded on Firebase storage
// //         console.log(url);
// //
// //       })
// //       .catch((error) => {
// //         console.log(error);
// //
// //       })
// //
// //   }
// //   render() {
// //
// //     return (
// //       <View style={styles.gallery}>
// //         <CameraRollPicker selected={[]} maximum={1} callback={this.getSelectedImages} />
// //         <Text style={styles.welcome}>
// //           Image Gallery
// //         </Text>
// //       </View>
// //     );
// //   }
// // }
// //
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#F5FCFF',
// //   },
// //   gallery: {
// //     fontSize: 20,
// //     textAlign: 'center',
// //     margin: 10,
// //   }
// // });
