import React, { Component } from "react";
import {View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Text} from "react-native";
import {ListItem, SearchBar, Icon} from "react-native-elements";
import { List } from "native-base";
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

const alien = require("../../images/alien.jpg");
const data = [];

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            items: data,
            searchEmail: data,
            error: null,
            search: "",
        };
    }

    async componentDidMount(){
        var that = this;
        var newData = [... that.state.items];
        var requestRef = firebase.database().ref('/Users');
        await requestRef.on('child_added', function(data){
            newData.push(data);
            that.setState({items : newData});
            that.setState({searchEmail : newData});
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
        this.setState({items : data})
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
                <Icon
                    containerStyle = {styles.homeContainer}
                    size = {40}
                    name = 'home'
                    type = 'font-awesome'
                    color = 'white'
                    onPress = {() => this.props.navigation.navigate('Activity')}
                />
            </View>
        )
    };

    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View style = {styles.footer}>
                <ActivityIndicator animating size = "large"/>
            </View>
        );
    };

    userPicture = (checkPhoto) => {
        if (checkPhoto == null) {
            return alien
        } else {
            return {uri: checkPhoto}
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
                                color = '#559535'
                                size = {30}
                                name = 'plus-circle'
                                type = 'font-awesome'
                                onPress = {() => {
                                    var user = firebase.auth().currentUser;
                                    var uid = user.uid;
                                    var that = this;
                                    var followRef = firebase.database().ref('/Follow').child(uid).child('/Following')
                                    var key = followRef.push().key;
                                    followRef.child(key).set(
                                        {
                                            name: item.val().FullName,
                                            email: item.val().Email,
                                        }
                                    );
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
      backgroundColor: 'rgb(47,46,51)',
    },
    groupRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgb(47,46,51)',
    },
    homeContainer: {
        marginTop: 13,
        marginRight: 15,
    },
    bodyText: {
        color: 'black',
    },
});

export default Search;
