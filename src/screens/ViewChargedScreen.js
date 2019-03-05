import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';


var data = []
export default class ViewChargedScreen extends React.Component {

  constructor(props){
    super(props);

    // frontend display of list from react native
    // this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 != r2})

    this.state = {
      listViewData: data,
      userID: "",
      userName: "",
    }
  }

  async componentDidMount(){
    var that = this;
    var user = firebase.auth().currentUser;
    if(user == null){
      alert("not logged in");
      this.props.navigation.navigate('Home');
      return;
    }
    var uid = user.uid;
    var newData = [... that.state.listViewData]
    var requestRef = firebase.database().ref('/Payments').child(uid).child('/GettingCharged');
    await requestRef.on('child_added', function(data){
            newData.push(data)
            that.setState({listViewData : newData})
         });

   //have a child removed function
         //that.setState({listViewData : newData})
  }

    render() {
        return (
            <View style={styles.container}>
            <Text> You're Requesting </Text>
                {this.state.listViewData.map((data, index) => {
                    return(
                      <View>
                        <Text>Total: ${data.val().Amount}</Text>
                        <Text>Description: {data.val().Description}</Text>
                        <Text>Charing: {data.val().Charged}</Text>

                      </View>
                    );
                })}

            </View>
        );
    }

    //Pay Charged function
    //connect to payment api/ get venmo or something confirmation
    //mark thing as paid both in charged and also in request for the person who requested interval

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3d3e52',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button1: {
        width: '30%',
        backgroundColor: '#559535',
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10,
        marginTop:10,
        elevation: 3,
    },
    button2: {
        width: '30%',
        backgroundColor: '#559535',
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10,
        marginTop:10,
        elevation: 3,
    },
    buttonText: {
        fontFamily: "Raleway-Regular",
        color: 'white',
    },
});
