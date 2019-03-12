import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from "react-native";

import { Container, Content, Icon, Thumbnail } from 'native-base'

class Groups extends Component {

    render() {
        return (
            <Container style={styles.container}>
                <Content>
                    <View style={{ height: 150, backgroundColor: "#559535" }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 10, }}>
                            <Text style={styles.groupsTitle }>Groups</Text>
                        </View>

                    </View>
                    <View>
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={styles.groupsTitle }>Friends</Text>
                        </View>

                    </View>
                    <View style={styles.groupList}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                alignItems: 'center',
                                paddingStart: 5,
                                paddingEnd: 5
                            }}
                        >
                            <Thumbnail
                                style={{ marginVertical: 20, marginHorizontal: 10, width: 100, height: 100, borderColor: '#82b85a', borderWidth: 2 }}
                                source={require("../../images/puppy-dog.jpg")} />
                            <Thumbnail
                                style={{ marginHorizontal: 10, width: 100, height: 100, borderColor: '#82b85a', borderWidth: 2 }}
                                source={require("../../images/puppy-dog.jpg")} />
                            <Thumbnail
                                style={{ marginHorizontal: 10, width: 100, height: 100, borderColor: '#82b85a', borderWidth: 2 }}
                                source={require("../../images/puppy-dog.jpg")} />
                            <Thumbnail
                                style={{ marginHorizontal: 10, width: 100, height: 100, borderColor: '#82b85a', borderWidth: 2 }}
                                source={require("../../images/puppy-dog.jpg")} />
                            <Thumbnail
                                style={{ marginHorizontal: 10, width: 100, height: 100, borderColor: '#82b85a', borderWidth: 2 }}
                                source={require("../../images/puppy-dog.jpg")} />
                            <Thumbnail
                                style={{ marginHorizontal: 10, width: 100, height: 100, borderColor: '#82b85a', borderWidth: 2 }}
                                source={require("../../images/puppy-dog.jpg")} />
                            <Thumbnail
                                style={{ marginHorizontal: 5, borderColor: '#fcfcfe', borderWidth: 2 }}
                                source={require("../../images/puppy-dog.jpg")} />

                        </ScrollView>
                    </View>

                </Content>
            </Container>
        );
    }
}
export default Groups;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3d3e52',
        // position: 'absolute',
        // top: 25,
        position: 'relative'
    },
    groupsTitle: {
        fontWeight: 'bold',
        color: "#fcfcfe",
        fontFamily: "Raleway-Regular",
        fontSize: 20,
        alignItems: 'center',
        paddingVertical: 20,
    },
    groupList: {
        flex:1,
        position: 'absolute',
        top: 80,
        backgroundColor: '#fcfcfe',
        borderWidth: 5,
        borderRadius: 20,
        borderColor: 'transparent'
    },
});

// import React, { Component } from "react";
// import {StyleSheet, Text, View, Button, TouchableOpacity, ScrollView} from 'react-native';
// import ActionButton from "react-native-circular-action-menu";
// import Icon from 'react-native-vector-icons/MaterialIcons';
//
// export default class Groups extends React.Component {
//     render() {
//         return (
//             //<ScrollView>
//             <View style={styles.container}>
//
//                 <Text>GROUPS</Text>
//
//                 <ActionButton buttonColor="#559535">
//                     <ActionButton.Item buttonColor='#9b59b6' title="Home" onPress={() =>
//                         this.props.navigation.navigate('Home')
//                     }>
//                         <Icon name="home" style={styles.actionButtonIcon} />
//                     </ActionButton.Item>
//                     <ActionButton.Item buttonColor='#9b59b6' title="Profile" onPress={() => console.log("notes tapped!")}>
//                         <Icon name="face" style={styles.actionButtonIcon} />
//                     </ActionButton.Item>
//                     <ActionButton.Item buttonColor='#3498db' title="Split New Bill"  onPress={() =>
//                         this.props.navigation.navigate('BillPrompt')
//                     }>
//                         <Icon name="receipt" style={styles.actionButtonIcon} />
//                     </ActionButton.Item>
//
//                     <ActionButton.Item buttonColor='#1abc9c' title="GroupsAdd" onPress={() =>
//                         this.props.navigation.navigate('SearchFriends')
//                     }>
//                         <Icon name="group" style={styles.actionButtonIcon} />
//                     </ActionButton.Item>
//                 </ActionButton>
//
//             </View>
//             // </ScrollView>
//         );
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#3d3e52',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     button1: {
//         width: '30%',
//         backgroundColor: '#559535',
//         paddingTop: 10,
//         paddingBottom: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom:10,
//         marginTop:10,
//         elevation: 3,
//     },
//     button2: {
//         width: '30%',
//         backgroundColor: '#559535',
//         paddingTop: 10,
//         paddingBottom: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom:10,
//         marginTop:10,
//         elevation: 3,
//     },
//     buttonText: {
//         fontFamily: "Raleway-Regular",
//         color: 'white',
//     },
//     actionButtonIcon: {
//         fontSize: 20,
//         height: 22,
//         color: 'white',
//     },
// });