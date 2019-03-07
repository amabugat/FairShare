import React, {Component} from 'react';
import{
  AppRegistry, FlatList, StyleSheet, Text, View, Image, Alert,
  Platform, TouchableHighlight, Dimensions, TextInput
} from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';

var screen = Dimensions.get('window');
export default class AddModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      newName: '',
      newPrice: ''
    }
  }

  showAddModal = () => {
    this.refs.myModal.open();
  }

  render(){
    return(
      <Modal
        ref={"myModal"}
        style={{
          justifyContent: 'center',
          borderRadius: 50,
          shadowRadius: 10,
          backgroundColor: '#26A65B',
          width: screen.width - 80,
          height: 280

        }}
        position='center'
        backdrop={false}
        onClose={()=>{
          alert("Modal Closed")
        }}
      >
        <Text style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 40
          }}>New Item's Name</Text>

        <TextInput
          style={{
              height: 60,
              fontSize: 16,
              borderBottomColor: 'black',
              marginLeft: 30,
              marginRight: 30,
              marginTop: 20,
              marginBottom: 10,
              borderBottomWidth: 1
          }}
          onChangeText={(text) => this.setState({ newName: text })}
          placeholder="Enter new item's name"
          value={this.state.newName}
        />
        <TextInput
              style={{
                  height: 60,
                  fontSize: 16,
                  borderBottomColor: 'black',
                  marginLeft: 30,
                  marginRight: 30,
                  marginTop: 10,
                  marginBottom: 20,
                  borderBottomWidth: 1
               }}

               onChangeText={(text) => this.setState({ newPrice: text })}
               placeholder="Enter new item's price"
               value={this.state.newPrice}
        />
               <Button
                   style={{ fontSize: 18, color: 'white' }}
                   containerStyle={{
                       padding: 8,
                       marginLeft: 70,
                       marginRight: 70,
                       height: 40,
                       borderRadius: 6,
                       backgroundColor: 'mediumseagreen'
                   }}
                   onPress={() => {
                        if (this.state.newName.length == 0 || this.state.newPrice.length == 0) {
                           alert("You must enter item's name and price");
                           return;
                       }
                       const newItem = {
                           name: this.state.newName,
                           price: this.state.newPrice,
                       };
                       flatListData.push(newItem);
                       this.refs.myModal.close();
                   }}>
                   Save
               </Button>
      </Modal>
    );
  }
}
