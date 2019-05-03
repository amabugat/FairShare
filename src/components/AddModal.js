import React, { Component } from "react";
import {
    AppRegistry,
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Platform,
    TouchableHighlight,
    Dimensions,
    TextInput
} from "react-native";
import Modal from "react-native-modalbox";
import Button from "react-native-button";
import flatListData from "../data/flatListData";
import priceList from "../data/priceList";

var screen = Dimensions.get("window");
export default class UserModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newItemName: "",
            newItemPrice: ""
        };
    }
    showAddModal = () => {
        this.refs.myModal.open();
    };
    generateKey = numberOfCharacters => {
        return require("random-string")({ length: numberOfCharacters });
    };
    render() {
        return (
            <Modal
                ref={"myModal"}
                style={{
                    justifyContent: "center",
                    borderRadius: Platform.OS === "ios" ? 30 : 0,
                    shadowRadius: 10,
                    width: screen.width - 80,
                    height: 280
                }}
                position="center"
                backdrop={true}
                onClosed={() => {
                    // alert("Modal closed");
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: 40
                    }}
                >
                    New Item's Name
                </Text>
                <TextInput
                    style={{
                        height: 40,
                        borderBottomColor: "gray",
                        marginLeft: 30,
                        marginRight: 30,
                        marginTop: 20,
                        marginBottom: 10,
                        borderBottomWidth: 1
                    }}
                    onChangeText={text => this.setState({ newItemName: text })}
                    placeholder="Enter new item's name"
                    value={this.state.newItemName}
                />
                <TextInput
                    style={{
                        height: 40,
                        borderBottomColor: "gray",
                        marginLeft: 30,
                        marginRight: 30,
                        marginTop: 10,
                        marginBottom: 20,
                        borderBottomWidth: 1
                    }}
                    keyboardType="numeric"
                    onChangeText={text => this.setState({ newItemPrice: text })}
                    placeholder="Enter new item's price"
                    value={this.state.newItemPrice}
                />
                <Button
                    style={{ fontSize: 18, color: "white" }}
                    containerStyle={{
                        padding: 8,
                        marginLeft: 70,
                        marginRight: 70,
                        height: 40,
                        borderRadius: 6,
                        backgroundColor: "mediumseagreen"
                    }}
                    onPress={() => {
                        if (
                            this.state.newItemName.length == 0 ||
                            this.state.newItemPrice.length == 0
                        ) {
                            alert("You Must Enter Item's Name and Price");
                            return;
                        } else if (this.state.newItemName == "item") {
                            alert("You Must Enter a Proper Name for Item");
                            return;
                        }
                        const newName = this.state.newItemName;
                        const newItem = {
                            name: this.state.newItemName,
                            itemPrice: this.state.newItemPrice,
                            user: []
                        };
                        flatListData.push(newItem);
                        console.log(flatListData);
                        this.props.parentFlatList.refreshFlatList(newName);
                        //this.props.userFlatList.refreshUserFlatList(newName);
                        this.setState({
                            newItemName: "",
                            newItemPrice: ""
                        });
                        this.refs.myModal.close();
                    }}
                >
                    Save
                </Button>
            </Modal>
        );
    }
}
