// import React from 'react';
// import {StyleSheet, Text, View, Button, TouchableOpacity, Image} from 'react-native';
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
// import Landing from './Landing.js';
// import firebase from '@firebase/app';
// import '@firebase/auth';
// import '@firebase/database';
//
//
// import ImagePicker from 'react-native-image-picker';
//
//
// const options = {
//   title: 'Select Avatar',
//   takePhotoButtonTitle: 'Take photo',
//   chooseFromLibraryButtonTitle: 'choose from Library',
// };
//
// export default class Camera extends React.Component {
//
//     constructor(props){
//         super(props);
//
//         // frontend display of list from react native
//         // this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 != r2})
//
//         this.state = {
//           avatarSource:null
//         }
//     }
//
//     // async componentDidMount(){
//     //
//     // }
//     picFcn(){
//       ImagePicker.showImagePicker(options, (response) => {
//         console.log('Response = ', response);
//         alert(response.uri);
//
//         if (response.didCancel) {
//           console.log('User cancelled image picker');
//         } else if (response.error) {
//           console.log('ImagePicker Error: ', response.error);
//         } else if (response.customButton) {
//           console.log('User tapped custom button: ', response.customButton);
//         } else {
//           //const source = { uri: response.uri };
//           var source = response.uri ;
//
//           // You can also display the image using data:
//           // const source = { uri: 'data:image/jpeg;base64,' + response.data };
//           this.setState({
//             avatarSource: source,
//           });
//         }
//       });
//     }
//
//     async storeFcn(){
//       var storage = firebase.storage();
//       var storageRef = storage.ref();
//       var recieptRef = storageRef.child('Reciepts');
// //      var recieptChargeRef = recieptRef.child(recieptIDKEY);
//        var recieptChargeRef = recieptRef.child('Test');
//        await recieptChargeRef.put(this.state.avatarSource).then(function(snapshot){
//          alert('yay it worked');
//        })
//     }
//
//     getFromFirebase(){
//       //var starsRef = storageRef.child('Reciepts/' +recieptIDKET);
//      var starsRef = storageRef.child('Reciepts/' +'Test');
// // Get the download URL
//       starsRef.getDownloadURL().then(function(url) {
//         // Insert url into an <img> tag to "download"
//
//       })
//
//         // A full list of error codes is available at
//
//       }
//
//
//
//     render() {
//         return (
//             <View style={styles.container}>
//               <Text>Hi </Text>
//               <Image
//                  style={{width: 66, height: 58}}
//                  source={{uri: this.state.avatarSource}}
//                />
//               <TouchableOpacity onPress = {this.picFcn}>
//                 <Text>Select Image</Text>
//               </TouchableOpacity>
//
//               <TouchableOpacity onPress = {this.storeFcn}>
//                 <Text>store Image</Text>
//               </TouchableOpacity>
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
import React from 'react';
import {
  AppRegistry,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import '@firebase/storage';

export default class Camera extends React.Component {
  state = {
    avatarSource: null,
    videoSource: null,
  };

  constructor(props) {
    super(props);

    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.selectVideoTapped = this.selectVideoTapped.bind(this);
    this.storeFcn = this.storeFcn.bind(this);
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  selectVideoTapped() {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium',
    };



    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          videoSource: response.uri,
        });
      }
    });
  }

  storeFcn(){
    alert("in storefcn")
//     var storage = firebase.storage();
//     var storageRef = storage.ref();
//     var recieptRef = storageRef.child('Reciepts');
// //      var recieptChargeRef = recieptRef.child(recieptIDKEY);
//      var recieptChargeRef = recieptRef.child('Test');
//      recieptChargeRef.put(this.state.avatarSource.uri).then(function(snapshot){
//        alert('yay it worked');
        const image = this.state.avatarSource.uri

        const Blob = RNFetchBlob.polyfill.Blob
        const fs = RNFetchBlob.fs
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
        window.Blob = Blob


        let uploadBlob = null
        const imageRef = firebase.storage().ref('posts').child("test.jpg")
        let mime = 'image/jpg'
        fs.readFile(image, 'base64')
          .then((data) => {
            return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
            uploadBlob = blob
            return imageRef.put(blob, { contentType: mime })
          })
          .then(() => {
            uploadBlob.close()
            return imageRef.getDownloadURL()
          })
          .then((url) => {
            // URL of the image uploaded on Firebase storage
            console.log(url);
            alert(url);

          })
          .catch((error) => {
            console.log(error);

          })
     }


  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View
            style={[
              styles.avatar,
              styles.avatarContainer,
              { marginBottom: 20 },
            ]}
          >
            {this.state.avatarSource === null ? (
              <Text>Select a Photo</Text>
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer]}>
            <Text>Select a Video</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.storeFcn.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer]}>
            <Text>storePic</Text>
          </View>
        </TouchableOpacity>


        {this.state.videoSource && (
          <Text style={{ margin: 8, textAlign: 'center' }}>
            {this.state.videoSource}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },
});
//
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';
// import firebase from 'firebase'
// import RNFetchBlob from 'react-native-fetch-blob'
// import CameraRollPicker from 'react-native-camera-roll-picker'
// export default class Gallery extends Component {
//
//   getSelectedImages = (selectedImages, currentImage) => {
//
//     const image = currentImage.uri
//
//     const Blob = RNFetchBlob.polyfill.Blob
//     const fs = RNFetchBlob.fs
//     window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
//     window.Blob = Blob
//
//
//     let uploadBlob = null
//     const imageRef = firebase.storage().ref('posts').child("test.jpg")
//     let mime = 'image/jpg'
//     fs.readFile(image, 'base64')
//       .then((data) => {
//         return Blob.build(data, { type: `${mime};BASE64` })
//     })
//     .then((blob) => {
//         uploadBlob = blob
//         return imageRef.put(blob, { contentType: mime })
//       })
//       .then(() => {
//         uploadBlob.close()
//         return imageRef.getDownloadURL()
//       })
//       .then((url) => {
//         // URL of the image uploaded on Firebase storage
//         console.log(url);
//
//       })
//       .catch((error) => {
//         console.log(error);
//
//       })
//
//   }
//   render() {
//
//     return (
//       <View style={styles.gallery}>
//         <CameraRollPicker selected={[]} maximum={1} callback={this.getSelectedImages} />
//         <Text style={styles.welcome}>
//           Image Gallery
//         </Text>
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
//   gallery: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   }
// });
