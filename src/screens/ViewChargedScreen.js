import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
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
                <Text style = {styles.buttonText}> You're Getting Charged </Text>
                {this.state.items.map((data, index) => {
                    return(
                        <Card>
                            <CardItem key={index}>
                                <View>
                                    <Text>CHARGING YOU:{data.val().RequesterName}</Text>
                                </View>
                            </CardItem>
                            <CardItem key={index}>
                                <View>
                                    <Text>THIS AMMOUNT{data.val().Amount}</Text>
                                </View>
                            </CardItem>
                            <CardItem key={index}>
                                <View>
                                    <Text>Description: {data.val().Description}</Text>
                                </View>
                            </CardItem>
                            <CardItem key={index}>
                                <View>
                                    <Text>YOU ARE{data.val().ChargedName}</Text>
                                </View>
                            </CardItem>
                            <CardItem key={index}>
                                <View>
                                    <Text>TIP CHARGED: {data.val().Tip}%</Text>
                                </View>
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
