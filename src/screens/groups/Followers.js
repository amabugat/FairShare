import React, { Component } from "react";
import {View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Text, TouchableHighlight, Alert} from "react-native";
import {ListItem, SearchBar, Icon} from "react-native-elements";
import { List } from "native-base";
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

const alien = require("../../images/alien.jpg");
const data = [];

class Followers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            items: data,
            searchEmail: data,
            followList: data,
            error: null,
            search: "",
            chargeList: [],
        };
    }

    async componentDidMount(){
        var that = this;
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        var newData = [... that.state.items];
        var requestRef = firebase.database().ref('/Users');
        var listRef = firebase.database().ref('/Payments').child(uid).child('/ListToCharge');
        await requestRef.on('child_added', function(data){
            newData.push(data);
            that.setState({items : newData});
            that.setState({searchEmail : newData});
            listRef.child(data.val().userID).set({
                Email: data.val().Email,
                FullName: data.val().FullName,
                PhoneNum: data.val().PhoneNum,
                userID: data.val().userID,
                toCharge: false,
            });
        });
    }

    updatedSearch = (text) => {
        const data = this.state.searchEmail.filter(data => {
            if (data.val().Email.toLowerCase().includes(this.state.search.toLowerCase())) {
                return true
            } else {
                return false
            }
        });
        this.setState({search : text});
        this.setState({items : data});
    };


    renderSeparator = () => {
        return (
            <View style = {styles.separator}/>
        );
    };

    renderHeader = () => {
        const search = this.state;
        return (
            <View style = {styles.groupRow}>
                <SearchBar placeholder = "Type here"
                           containerStyle = {styles.barStyle}
                           inputContainerStyle = {styles.searchStyle}
                           onChangeText = {this.updatedSearch}
                           value = {search}
                           round
                />
                <TouchableOpacity onPress = {() => this.props.navigation.navigate('Activity')}>
                    <Icon
                        containerStyle = {styles.homeContainer}
                        size = {34}
                        name = 'check'
                        type = 'font-awesome'
                        color = 'white'
                    />
                </TouchableOpacity>
            </View>
        )
    };

    userPicture = (checkPhoto) => {
        if (checkPhoto == null) {
            return alien
        } else {
            return {uri: checkPhoto}
        }
    };

    plusMinus = (usersID) => {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        var listRef = firebase.database().ref('/Payments').child(uid).child('/ListToCharge').child(usersID);
        if (listRef.toCharge === true) {
            return true
        } else {
            return false
        }
    };

    render() {
        return (
            <List style = {styles.container}>
                <FlatList style = {styles.listStyle}
                          data = {this.state.items}
                          renderItem = {({item}) => (
                              <ListItem
                                  titleStyle = {styles.bodyText}
                                  title = {item.val().FullName}
                                  subtitle = {item.val().Email}
                                  leftAvatar = {{rounded: true, source: this.userPicture(item.val().PhotoURL)}}
                                  rightIcon = {<Icon
                                      iconStyle = {styles.styleOfIcon}
                                      color = {this.plusMinus(item.val().userID) === false ? "#559535" : "red"}
                                      size = {30}
                                      name = {this.plusMinus(item.val().userID) === false ? "plus-circle" : "minus-circle"}
                                      type = 'font-awesome'
                                      onPress = {() => {
                                          var that = this;
                                          var user = firebase.auth().currentUser;
                                          var uid = user.uid;
                                          var newData = [... that.state.chargeList];
                                          var toChargeRef = firebase.database().ref('/Payments').child(uid).child('/ListToCharge').child(item.val().userID);
                                          toChargeRef.update({
                                              toCharge: true,
                                          });
                                          toChargeRef.on('value', function(snapshot) {
                                              newData.push(snapshot);
                                              that.setState({chargeList: newData});
                                              console.log(snapshot.val());
                                              console.log(that.state.chargeList.length);
                                              Alert.alert(
                                                  that.state.chargeList.length + ' people in list',
                                                  'Adding ' + snapshot.val().FullName + ' to list',
                                                  [
                                                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                                                  ],
                                                  {cancelable: false},
                                              );
                                          });
                                      }}
                                  />}
                              />
                          )}
                          keyExtractor = {item => item.val().Email}
                          ItemSeparatorComponent = {this.renderSeparator}
                          ListHeaderComponent = {this.renderHeader}
                          ListFooterComponent = {this.renderFooter}
                />
            </List>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fcfcfe",
        color: "#fcfcfe",
    },
    button2: {
        fontFamily: "Raleway-Regular",
        width: '30%',
        backgroundColor: '#3d3e52',
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10,
        marginTop:10,
        elevation: 3,
    },
    separator: {
        height: 1,
        backgroundColor: "#CED0CE",
    },
    footer: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: "#CED0CE"
    },
    styleOfIcon: {
        marginRight: 10,
    },
    searchStyle: {
        width: 300,
        backgroundColor: 'white',
    },
    barStyle: {
        backgroundColor: '#3d3e52',
    },
    groupRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#3d3e52',
    },
    homeContainer: {
        marginTop: 13,
        marginRight: 15,
    },
    bodyText: {
        color: 'black',
    },
});

export default Followers;
