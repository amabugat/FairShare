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

const logo = require("../images/logo.png");
const cardImage = require("../images/puppy-dog.jpg");

var data = []
export default class ViewRequestScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            items: data,
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
        var newData = [... that.state.items]
        var requestRef = firebase.database().ref('/Payments').child(uid).child('/Requesting');
        //Get requests from the DB
        await requestRef.on('child_added', async function(data){
            var dic= {};
            //Store request in dictionary
            dic = data.val();
            dic.ShowMore = false;
            //GET photo of user associated with that request
            //var userRef = firebase.database().ref('/Users').child(data.val().Charged);
            //await userRef.on('value', async function(userData){
            //  dic.PhotoUrl = userData.val().PhotoUrl
           //  })
           //Check if interest
            if(data.val().Interest != "NONE"){
                //  alert(interestTime)
                var interestTime = 100000;
                var timeStamp = data.val().InterestTimeStamp;
                var newAmount = data.val().Amount;
                //  alert(interestTime);
                var todayTime = new Date().getTime();
                if(data.val().Interest == "DAY"){
                    interestTime = (24*60*60*1000);
                }else if(data.val().Interest == "WEEK"){
                    interestTime = (24*60*60*1000*7);
                }else{
                    interestTime = (24*60*60*1000*30);
                }
                //Keep incrementing total with interest until time reached
                while((timeStamp +  interestTime) < todayTime){
                    newAmount = newAmount + (newAmount*data.val().InterestRate);
                    timeStamp = timeStamp + interestTime;
                }
                //set new variables if we did charge interest
                if(data.val().InterestTimeStamp != timeStamp ){
                    var userChargedRef = firebase.database().ref('/Payments').child(data.val().Charged).child('/GettingCharged');
                    var chargerUserRef = firebase.database().ref('/Payments').child(data.val().Requester).child('/Requesting');
                    userChargedRef.child(data.val().ReceiptID).update(
                        {
                            Amount: newAmount,
                            InterestTimeStamp : timeStamp,
                        });
                    chargerUserRef.child(data.val().ReceiptID).update(
                        {
                            Amount: newAmount,
                            InterestTimeStamp : timeStamp,
                        });

                    dic.InterestTimeStamp = timeStamp;
                    dic.Amount = newAmount;
                }
            }
            //store request into array
            newData.push(dic)
            that.setState({items : newData})
        });
        //if database deleted make sure updates are here.
        await requestRef.on('child_removed', function(data){
            var newData = [... that.state.items]
            for(var i = newData.length - 1; i >= 0; i--){
                if(newData[i].ReceiptID == data.ReceiptID){
                    newData.splice(i, 1);
                    break;
                }
            }
            that.setState({items : newData})
        });
    }

    //show more button pressed on the requests
    toggleShowMore(index){
      console.log(index)
      console.log(this.state.items[index])
      var newArray = this.state.items
      //toggle value
      if(this.state.items[index].ShowMore){
        newArray[index].ShowMore = false;
        //console.log(newArray[index])
      //  this.state.items[index].ShowMore = false;
      }else{
        newArray[index].ShowMore = true;
      //  this.state.items[index].ShowMore = true;
      }
      //save value
      this.setState({
        items: newArray
      })
    }

    //cancel button pressed so delete both
    cancelRequest(data){
        var paymentsRef = firebase.database().ref('/Payments');
        var paymentsUserRef = paymentsRef.child(data.Requester);
        var userRequestingRef = paymentsUserRef.child('/Requesting');

        var chargedUserRef = paymentsRef.child(data.Charged);
        var chargedUserTable = chargedUserRef.child('/GettingCharged');
        //remove both charged and requested
        chargedUserTable.child(data.ReceiptID).remove();
        userRequestingRef.child(data.ReceiptID).remove();
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.items.map((data, index) => {
                    return (
                        <Card style = {styles.cardStyle}>
                            <CardItem key = {index}>
                                <Left>
                                {/*data.PhotoUrl == null ? (<Thumbnail source={logo} />):
                                (<Image
                                    style={{
                                      borderRadius: 75,
                                      width: 25,
                                      height: 25,

                                    }}
                                    source={{ uri: data.PhotoUrl}}
                                />)*/}
                                    <Thumbnail source={logo} />
                                    <Body>
                                    {/*Switch back later*/}
                                    <Text>YOU ARE REQUESTING: {data.ChargedName}</Text>
                                    <Text note>Total: {data.Amount}</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            {data.ReceiptPic == null ? (
                                <CardItem cardBody key = {index}>
                                    <Text>No Photo</Text>
                                </CardItem>
                            ) : (
                                <CardItem cardBody key = {index}>
                                    <Image
                                        style={{
                                            resizeMode: "cover",
                                            width: null,
                                            height: 200,
                                            flex: 1
                                        }}
                                        source={{ uri: data.ReceiptPic}}
                                    />
                                </CardItem>
                            )}

                            {data.ShowMore == true ? (


                                  <CardItem>
                                        <Text>
                                              Description: {data.Description}{"\n"}

                                              Tax: {data.Tax}{"\n"}

                                              Interest: {data.Interest}{"\n"}

                                              Tip: {data.Tip}{"\n"}

                                              Timestamp: {data.TimeStamp}{"\n"}
                                        </Text>

                                        <Left>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.toggleShowMore(index)
                                                }
                                            >
                                            <Text style={{color:'blue'}}> Show Less! </Text>
                                            </TouchableOpacity>
                                        </Left>
                                  </CardItem>


                            ) : (
                                <CardItem cardBody key = {index}>
                                  <TouchableOpacity
                                      onPress={() =>
                                          this.toggleShowMore(index)
                                      }
                                  >
                                      <Text style={{color:'blue'}}> Show More! </Text>
                                  </TouchableOpacity>
                                </CardItem>
                            )}

                            <CardItem>
                              <TouchableOpacity
                                  onPress={() =>
                                      this.cancelRequest(data)
                                  }
                              >
                                  <Text style={{color:'red'}}> Cancel </Text>
                              </TouchableOpacity>
                            </CardItem>

                        </Card>
                    );
                })}
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
    },
    button1: {
        backgroundColor: '#01B9F5',
        padding:10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        fontFamily: "Raleway-Regular",
        color: 'white',
    },
});
