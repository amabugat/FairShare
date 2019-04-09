import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, Image} from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Icon,
    Card,
    CardItem,
    Thumbnail,
    Left,
    Body,
    Right
} from "native-base";
import Landing from './Landing.js';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

import ImagePicker from 'react-native-image-picker';


const options = {
  title: 'Select Avatar',
  takePhotoButtonTitle: 'Take photo',
  chooseFromLibraryButtonTitle: 'choose from Library',
};

export default class Camera extends React.Component {

    constructor(props){
        super(props);

        // frontend display of list from react native
        // this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 != r2})

        this.state = {
          avatarSource:null
        }
    }

    // async componentDidMount(){
    //
    // }
    picFcn(){
      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };

          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.setState({
            avatarSource: source,
          });
        }
      });
    }


    render() {
        return (
            <View style={styles.container}>
              <Text>Hi </Text>
              <TouchableOpacity onPress = {this.picFcn}>
                <Text>Select Image</Text>
              </TouchableOpacity>
            </View>

        );
    }




}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3d3e52',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    cardStyle: {
        width: "80%",
        // height:"50%",
        // paddingVertical: 5,
    },
    button1: {
        // width: '30%',
        backgroundColor: '#559535',
        // paddingTop: 10,
        // paddingBottom: 10,
        padding:10,
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom:10,
        // marginTop:10,
        elevation: 3,
    },
    buttonText: {
        fontFamily: "Raleway-Regular",
        color: 'white',
    },
});
