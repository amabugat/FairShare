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
        await requestRef.on('child_added', function(data){
            newData.push(data)
            that.setState({items : newData})
        });

        await requestRef.on('child_removed', function(data){
            var newData = [... that.state.items]
            for(var i = newData.length - 1; i >= 0; i--){
                if(newData[i].val().ReceiptID == data.val().ReceiptID){
                    newData.splice(i, 1);
                    break;
                }
            }
            that.setState({items : newData})
        });
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
                                    <Thumbnail source={logo} />
                                    <Body>
                                    <Text>{data.val().ChargedName} Paid {data.val().RequesterName}</Text>
                                    <Text note>Total: {data.val().Amount}</Text>
                                    </Body>
                                </Left>
                            </CardItem>

                            {data.val().ReceiptPic == null ? (
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
                                      source={{ uri: data.val().ReceiptPic}}
                                  />
                              </CardItem>
                            )}

                            <CardItem key={index}>
                                <View>
                                    <Text>Description: {data.val().Description}</Text>
                                </View>
                            </CardItem>


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
