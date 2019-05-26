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
import PayPal from 'react-native-paypal-wrapper';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

const logo = require("../images/logo.png");
const cardImage = require("../images/puppy-dog.jpg");

var data = []
export default class ViewChargedScreen extends React.Component {

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
        var requestRef = firebase.database().ref('/Payments').child(uid).child('/GettingCharged');
        var todayTime = new Date().getTime();
        console.log(" todayTime " + todayTime)
        await requestRef.on('child_added', function(data){
            //  console.log(data)
            var dic = {}
            dic = data.val();
            //alert("adding")
            if(data.val().Interest != "NONE"){
                //  alert(interestTime)
                var interestTime = 1000;
                var timeStamp = data.val().InterestTimeStamp;
                var newAmount = data.val().Amount;
                //  alert(interestTime);
                var todayTime = new Date().getTime();
                if(data.val().Interest == "MIN"){
                    interestTime = (60*1000);
                }else if(data.val().Interest == "DAY"){
                    interestTime = (24*60*60*1000);
                }else if(data.val().Interest == "WEEK"){
                    interestTime = (24*60*60*1000*7);
                }else{
                    interestTime = (24*60*60*1000*30);
                }
                while((timeStamp + interestTime) < todayTime){
                    newAmount = newAmount + (newAmount*data.val().InterestRate);
                    timeStamp = timeStamp + interestTime;
                }

                //alert("newamount " + newAmount +" old amount " + data.val().Amount)
                if(data.val().InterestTimeStamp != timeStamp ){
                    var userChargedRef = firebase.database().ref('/Payments').child(uid).child('/GettingCharged');
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



            newData.push(dic)
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
                {/*<Text style = {styles.buttonText}> You're Getting Charged </Text>*/}
                {this.state.items.map((data, index) => {
                    return(
                        <Card style = {styles.cardStyle}>
                            <CardItem key = {index}>
                                <Left>
                                    <Thumbnail source={logo} />
                                    <Body>
                                    <Text>YOU ARE BEING CHARGED: {data.RequesterName}</Text>
                                    <Text note>Total: {data.Amount.toFixed(2)}</Text>
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

                            <CardItem key={index}>
                                <View>
                                    <Text>Description: {data.Description}</Text>
                                </View>
                            </CardItem>

                            <CardItem key={index}>
                                <View>
                                    <TouchableOpacity onPress={() =>
                                        this.payment(data)
                                    } style={styles.button1}>
                                        <Text style={styles.buttonText}> Pay Now </Text>
                                    </TouchableOpacity>
                                </View>
                            </CardItem>
                        </Card>
                    );
                })}
            </View>
        );
    }

    payment = (data) => {
        PayPal.initialize(PayPal.SANDBOX, "AZoR-_FPTqdYVrW0pk5dZ_wFEPji2ptMc6AyM-VdqIyOmaefQr69uw5piF4AoFXfeWb3zs5j72edRWay");
        PayPal.pay({
            price: data.val().Amount.toString(),
            currency: 'USD',
            description: data.val().Description,
        }).then(confirm => console.log(confirm),
            this.markAsPaid(data))
            .catch(error => console.log(error));
    };

    markAsPaid = async (data) => {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        var paymentsRef = firebase.database().ref('/Payments');
        var paymentsUserRef = paymentsRef.child(data.val().Requester);
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
        backgroundColor: '#559535',
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
// import PayPal from 'react-native-paypal-wrapper';
// import firebase from '@firebase/app';
// import '@firebase/auth';
// import '@firebase/database';
//
// const logo = require("../images/logo.png");
// const cardImage = require("../images/puppy-dog.jpg");
//
// var data = []
// export default class ViewChargedScreen extends React.Component {
//
//     constructor(props){
//         super(props);
//
//         // frontend display of list from react native
//         // this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 != r2})
//
//         this.state = {
//             items: data,
//             userID: "",
//             userName: "",
//         }
//     }
//
//     async componentDidMount(){
//         var that = this;
//         var user = firebase.auth().currentUser;
//         if(user == null){
//             alert("not logged in");
//             this.props.navigation.navigate('Home');
//             return;
//         }
//         var uid = user.uid;
//         var newData = [... that.state.items]
//         var requestRef = firebase.database().ref('/Payments').child(uid).child('/GettingCharged');
//         await requestRef.on('child_added', function(data){
//             newData.push(data)
//             that.setState({items : newData})
//         });
//
//         await requestRef.on('child_removed', function(data){
//             var newData = [... that.state.items]
//             for(var i = newData.length - 1; i >= 0; i--){
//                 if(newData[i].val().ReceiptID == data.val().ReceiptID){
//                     newData.splice(i, 1);
//                     break;
//                 }
//             }
//             that.setState({items : newData})
//         });
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 {/*<Text style = {styles.buttonText}> You're Getting Charged </Text>*/}
//                 {this.state.items.map((data, index) => {
//                     return(
//                         <Card style = {styles.cardStyle}>
//                             <CardItem key = {index}>
//                                 <Left>
//                                     <Thumbnail source={logo} />
//                                     <Body>
//                                     <Text>YOU ARE BEING CHARGED: {data.val().RequesterName}</Text>
//                                     <Text note>Total: {data.val().Amount.toFixed(2)}</Text>
//                                     </Body>
//                                 </Left>
//                             </CardItem>
//
//                             {data.val().ReceiptPic == null ? (
//                               <CardItem cardBody key = {index}>
//                                 <Text>No Photo</Text>
//                               </CardItem>
//                             ) : (
//                               <CardItem cardBody key = {index}>
//                                   <Image
//                                       style={{
//                                           resizeMode: "cover",
//                                           width: null,
//                                           height: 200,
//                                           flex: 1
//                                       }}
//                                       source={{ uri: data.val().ReceiptPic}}
//                                   />
//                               </CardItem>
//                             )}
//
//                             <CardItem key={index}>
//                                 <View>
//                                     <Text>Description: {data.val().Description}</Text>
//                                 </View>
//                             </CardItem>
//
//                             <CardItem key={index}>
//                                 <View>
//                                     <TouchableOpacity onPress={() =>
//                                         this.payment(data)
//                                     } style={styles.button1}>
//                                         <Text style={styles.buttonText}> Pay Now </Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </CardItem>
//                         </Card>
//                     );
//                 })}
//             </View>
//         );
//     }
//
//     payment = (data) => {
//         PayPal.initialize(PayPal.SANDBOX, "AZoR-_FPTqdYVrW0pk5dZ_wFEPji2ptMc6AyM-VdqIyOmaefQr69uw5piF4AoFXfeWb3zs5j72edRWay");
//         PayPal.pay({
//             price: data.val().Amount.toString(),
//             currency: 'USD',
//             description: data.val().Description,
//         }).then(confirm => console.log(confirm),
//             this.markAsPaid(data))
//             .catch(error => console.log(error));
//     };
//
//     markAsPaid = async (data) => {
//         var user = firebase.auth().currentUser;
//         var uid = user.uid;
//         var paymentsRef = firebase.database().ref('/Payments');
//         var paymentsUserRef = paymentsRef.child(data.val().Requester);
//         var userRequestingRef = paymentsUserRef.child('/Requesting');
//         var userHistoryRef = paymentsUserRef.child('/History');
//
//         var chargedUserRef = paymentsRef.child(data.val().Charged);
//         var chargedUserTable = chargedUserRef.child('/GettingCharged');
//         var chargedUserHistory = chargedUserRef.child('/History');
//
//         chargedUserHistory.child(data.val().ReceiptID).set(
//             {
//                 PaymentTitle: data.val().PaymentTitle,
//                 ReceiptID: data.val().ReceiptID,
//                 Description: data.val().Description,
//                 Amount: data.val().Amount,
//                 Tip: data.val().Tip,
//                 Tax: data.val().Tax,
//                 Requester: data.val().Requester,
//                 Charged: data.val().Charged,
//                 RequesterName: data.val().RequesterName,
//                 ChargedName: data.val().ChargedName,
//                 ReceiptPic: "",
//                 Paid: true,
//             }
//         );
//         userHistoryRef.child(data.val().ReceiptID).set(
//             {
//                 PaymentTitle: data.val().PaymentTitle,
//                 ReceiptID: data.val().ReceiptID,
//                 Description: data.val().Description,
//                 Amount: data.val().Amount,
//                 Tip: data.val().Tip,
//                 Tax: data.val().Tax,
//                 Requester: data.val().Requester,
//                 Charged: data.val().Charged,
//                 RequesterName: data.val().RequesterName,
//                 ChargedName: data.val().ChargedName,
//                 ReceiptPic: "",
//                 Paid: true,
//             }
//         );
//         //remove the item
//         chargedUserTable.child(data.val().ReceiptID).remove();
//         userRequestingRef.child(data.val().ReceiptID).remove();
//
//     }
//
// }
//
//
//
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
//         backgroundColor: '#559535',
//         padding:10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 3,
//     },
//     buttonText: {
//         fontFamily: "Raleway-Regular",
//         color: 'white',
//     },
// });
