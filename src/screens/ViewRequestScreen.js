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
        var requestRef = firebase.database().ref('/Payments').child(uid).child('/Requesting');
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
            <View style={styles.container}>
                {this.state.items.map((data, index) => {
                    return (
                        <Card style = {styles.cardStyle}>
                            <CardItem key = {index}>
                                <Left>
                                    <Thumbnail source={logo} />
                                    <Body>
                                    <Text>YOU ARE CHARGING: {data.val().ChargedName}</Text>
                                    <Text note>Total: {data.val().Amount}</Text>
                                    </Body>
                                </Left>
                            </CardItem>

                            <CardItem cardBody key = {index}>
                                <Image
                                    style={{
                                        resizeMode: "cover",
                                        width: null,
                                        height: 200,
                                        flex: 1
                                    }}
                                    source={cardImage}
                                />
                            </CardItem>

                            <CardItem key={index}>
                                <View>
                                    <Text>Description: {data.val().Description}</Text>
                                </View>
                            </CardItem>

                            <CardItem key={index}>
                                <View>
                                    <TouchableOpacity style = {styles.button1} onPress={() => this.markAsPaid(data)
                                    }
                                    >
                                        <Text style={styles.buttonText}>Mark As Paid</Text>
                                    </TouchableOpacity>
                                </View>
                            </CardItem>
                        </Card>
                    );
                })}
            </View>

        );
    }

    markAsPaid = async (data) => {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        var paymentsRef = firebase.database().ref('/Payments');
        var paymentsUserRef = paymentsRef.child(uid);
        var userRequestingRef = paymentsUserRef.child('/Requesting');
        var userHistoryRef = paymentsUserRef.child('/History');


        var chargedUserRef = paymentsRef.child(data.val().Charged);
        var chargedUserTable = chargedUserRef.child('/GettingCharged');
        var chargedUserHistory = chargedUserRef.child('/History');

        chargedUserHistory.child(data.val().ReceiptID).set(
            {
                PaymentTitle: data.val().PaymentTitle,
                ReceiptID: data.val().ReceiptID,
                Description: data.val().Description,
                Amount: data.val().Amount,
                Tip: data.val().Tip,
                Tax: data.val().Tax,
                Requester: data.val().Requester,
                Charged: data.val().Charged,
                RequesterName: data.val().RequesterName,
                ChargedName: data.val().ChargedName,
                ReceiptPic: "",
                Paid: true,
            }
        );
        userHistoryRef.child(data.val().ReceiptID).set(
            {
                PaymentTitle: data.val().PaymentTitle,
                ReceiptID: data.val().ReceiptID,
                Description: data.val().Description,
                Amount: data.val().Amount,
                Tip: data.val().Tip,
                Tax: data.val().Tax,
                Requester: data.val().Requester,
                Charged: data.val().Charged,
                RequesterName: data.val().RequesterName,
                ChargedName: data.val().ChargedName,
                ReceiptPic: "",
                Paid: true,
            }
        );
        //remove the item
        chargedUserTable.child(data.val().ReceiptID).remove();
        userRequestingRef.child(data.val().ReceiptID).remove();

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
