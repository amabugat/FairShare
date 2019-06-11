import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, Image} from 'react-native';
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
export default class ViewHistoryScreen extends React.Component {

    constructor(props){
        super(props);

        // frontend display of list from react native
        // this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 != r2})

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
        var requestRef = firebase.database().ref('/Payments').child(uid).child('/History');
        await requestRef.on('child_added', async function(data){
            var dic = {};
            dic = data.val();
            dic.ShowMore = false;
            dic.PhotoUrl = 0;
            if(uid == dic.Requester){
              var photoRef = firebase
                 .database()
                 .ref("/Users")
                 .child(data.val().Charged);
              await photoRef.on('value', function(snapshot){
                dic.PhotoUrl = snapshot.val().PhotoURL
              })
            }else{
              var photoRef = firebase
                 .database()
                 .ref("/Users")
                 .child(data.val().Requester);
              await photoRef.on('value', function(snapshot){
                dic.PhotoUrl = snapshot.val().PhotoURL
              })
            }

            newData.push(dic)
            that.setState({items : newData})
        });

        await requestRef.on('child_removed', function(data){
            var newData = [... that.state.items]
            for(var i = newData.length - 1; i >= 0; i--){
                if(newData[i].ReceiptID == data.val().ReceiptID){
                    newData.splice(i, 1);
                    break;
                }
            }
            that.setState({items : newData})
        });
    }

    toggleShowMore(index) {
       console.log(index);
       console.log(this.state.items[index]);
       var newArray = this.state.items;
       if (this.state.items[index].ShowMore) {
          newArray[index].ShowMore = false;
       } else {
          newArray[index].ShowMore = true;
       }

       this.setState({
          items: newArray
       });
    }

    getDate(timestamp){
     var todate=new Date(timestamp).getDate()-1;
     var tomonth=new Date(timestamp).getMonth()+1;
     var toyear=new Date(timestamp).getFullYear();
     var original_date=tomonth+'/'+todate+'/'+toyear;
     return original_date
    }

    render() {
        return (
            <ScrollView>
            <View style={styles.container}>

                {this.state.items.map((data, index) => {
                    return (
                        <Card style = {styles.cardStyle}>
                            <CardItem key = {index}>
                                <Left>
                                    {data.PhotoUrl == 0 ? (
                                      <Thumbnail source={logo} />
                                    ):
                                      (
                                        <Image
                                           style={styles.avatar}
                                           source={{ uri: data.PhotoUrl}}
                                        />
                                      )}
                                    <Body>
                                    <Text style = {styles.screenText}>{data.ChargedName} Paid {data.RequesterName}</Text>
                                    <Text  style = {styles.screenText}note>Total: {data.Amount}</Text>
                                    </Body>
                                </Left>
                            </CardItem>

                            {data.ReceiptPic != null && (
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

                            <CardItem key={index}>
                                <View>
                                    <Text style = {styles.screenText}>Description: {data.Description}</Text>
                                </View>
                            </CardItem>

                            {data.ShowMore == true ? (
                               <CardItem>
                                  <View
                                     style={{
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                     }}
                                  >
                                     <Text style={styles.screenText}>
                                        Description: {data.Description}
                                        {"\n"}
                                        Tax: {data.Tax}%
                                        {"\n"}
                                        Tip: {data.Tip}%
                                        {"\n"}
                                        Timestamp: {this.getDate(data.TimeStamp)}
                                        </Text>
                                        {data.Interest == "NONE" ? (
                                          <Text> Interest: {data.Interest} </Text>
                                        ):(
                                          <Text style={styles.screenText}>
                                          Interest: {data.Interest}{"\n"}
                                          Interest Rate: {data.InterestRate}{"\n"}
                                          Original Amount: {(data.OriginalAmount*1).toFixed(2)}
                                          </Text>
                                        )}



                                     <TouchableOpacity
                                        onPress={() => this.toggleShowMore(index)}
                                        style={styles.button1}
                                     >
                                        <Text style={styles.buttonText}> Less </Text>
                                     </TouchableOpacity>
                                  </View>
                               </CardItem>
                            ) : (
                               <CardItem cardBody key={index}>
                                  <TouchableOpacity
                                     onPress={() => this.toggleShowMore(index)}
                                     style={styles.button1}
                                  >
                                     <Text style={styles.buttonText}> More </Text>
                                  </TouchableOpacity>
                               </CardItem>
                            )}


                        </Card>
                    );
                })}

            </View>
            </ScrollView>
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
        width: "85%",
        // height:"50%",
        // paddingVertical: 5,
    },
    button1: {
       margin: 5,
       borderRadius: 90,
       backgroundColor: "#559535",
       padding: 10,
       width: 80,
       justifyContent: "center",
       alignItems: "center",
       elevation: 3
    },
    button2: {
       borderRadius: 90,
       backgroundColor: "#F47983",
       padding: 10,
       width: 80,
       justifyContent: "center",
       alignItems: "center",
       elevation: 3
    },
    buttonText: {
        fontFamily: "Raleway-Regular",
        color: 'white',
    },
    screenText: {
        margin: 5,
        fontFamily: "Raleway-Regular",
        color: 'grey',
    },
    avatar: {
       borderRadius: 45,
       width: 50,
       height: 50
    },
    row: {
       flexDirection: "row",
       justifyContent: "space-between"
    },
});
