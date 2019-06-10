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
        await requestRef.on('child_added', async function(data){
          var dic = {};
          dic = data.val();
          dic.ShowMore = false;
          dic.PhotoUrl = 0;
          var requesterRef = firebase
             .database()
             .ref("/Users")
             .child(data.val().Requester);
          await requesterRef.on('value', function(snapshot){
            dic.PhotoUrl = snapshot.val().PhotoURL
          })
            if(data.val().Interest != "NONE"){
                var interestTime = 1000;
                var timeStamp = data.val().InterestTimeStamp;
                var newAmount = data.val().Amount;
                var todayTime = new Date().getTime();
                if(data.val().Interest == "DAY"){
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
            <View style={styles.container}>
                {/*<Text style = {styles.buttonText}> You're Getting Charged </Text>*/}
                {this.state.items.map((data, index) => {
                  return (
                     <Card style={styles.cardStyle}>
                        <CardItem key={index}>
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
                                 {/*Switch back later*/}
                                 <Text style={styles.screenText}>
                                    PhotoURL: {data.PhotoUrl}
                                 </Text>

                                   <Text style={styles.screenText}>
                                      YOU ARE CHARGED BY: {data.RequesterName}
                                   </Text>

                                 <Text style={styles.screenText} note>
                                    Total: {data.Amount}
                                 </Text>
                              </Body>
                           </Left>
                        </CardItem>
                        {data.ReceiptPic != null && (
                           <CardItem cardBody key={index}>
                              <Image
                                 style={{
                                    resizeMode: "cover",
                                    width: null,
                                    height: 200,
                                    flex: 1
                                 }}
                                 source={{ uri: data.ReceiptPic }}
                              />
                           </CardItem>
                        )}

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
                                      Original Amount: {data.OriginalAmount}
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

                           <CardItem key={index}>
                               <View style={styles.row}>
                                       <Text> </Text>
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
            price: data.Amount.toString(),
            currency: 'USD',
            description: data.Description,
        }).then(confirm => {
          console.log(confirm)
          console.log(confirm.response_type)
            console.log(confirm.response.state)
          if(confirm.response_type == 'payment'){
            if(confirm.response.state == 'approved'){
              this.markAsPaid(data)
            }
          }
            //  this.markAsPaid(data))
        })
            .catch(error => console.log(error));
    };

    async markAsPaid(data) {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        var paymentsRef = firebase.database().ref('/Payments');
        var paymentsUserRef = paymentsRef.child(data.Requester);
        var userRequestingRef = paymentsUserRef.child('/Requesting');
        var userHistoryRef = paymentsUserRef.child('/History');

        var chargedUserRef = paymentsRef.child(data.Charged);
        var chargedUserTable = chargedUserRef.child('/GettingCharged');
        var chargedUserHistory = chargedUserRef.child('/History');

        chargedUserHistory.child(data.ReceiptID).set(
            {
                PaymentTitle: data.PaymentTitle,
                ReceiptID: data.ReceiptID,
                Description: data.Description,
                Amount: data.Amount,
                Tip: data.Tip,
                Tax: data.Tax,
                Requester: data.Requester,
                Charged: data.Charged,
                RequesterName: data.RequesterName,
                ChargedName: data.ChargedName,
                ReceiptPic: "",
                Paid: true,
            }
        );
        userHistoryRef.child(data.ReceiptID).set(
            {
                PaymentTitle: data.PaymentTitle,
                ReceiptID: data.ReceiptID,
                Description: data.Description,
                Amount: data.Amount,
                Tip: data.Tip,
                Tax: data.Tax,
                Requester: data.Requester,
                Charged: data.Charged,
                RequesterName: data.RequesterName,
                ChargedName: data.ChargedName,
                ReceiptPic: "",
                Paid: true,
            }
        );
        //remove the item
        chargedUserTable.child(data.ReceiptID).remove();
        userRequestingRef.child(data.ReceiptID).remove();
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
//                                     <Text note>Total: {data.val().Amount}</Text>
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
