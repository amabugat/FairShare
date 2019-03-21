import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View, Image, Alert, Platform, TouchableOpacity } from 'react-native';
import flatListData from '../data/flatListData';
import priceList from '../data/priceList';
import Swipeout from 'react-native-swipeout';
import AddModal from './AddModal';

class FlatListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeRowKey: null,
            total: null,
        };
    }
    render() {
        const swipeSettings = {
            autoClose: true,
            onClose: (secId, rowId, direction) => {
                if(flatListData.length == 1){
                    this.setState({ activeRowKey: null });
                }
                if(this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }
            },
            onOpen: (secId, rowId, direction) => {
                if(this.props.item.index == 0){
                    this.setState({ activeRowKey: null });
                }else{
                    this.setState({ activeRowKey: this.props.item.name });
                }

            },
            right: [
                {
                    onPress: () => {
                        const deletingRow = this.state.activeRowKey;
                        Alert.alert(
                            'Alert',
                            'Are you sure you want to delete ?',
                            [
                                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'Yes', onPress: () => {
                                        flatListData.splice(this.props.index, 1);
                                        priceList.splice(this.props.index-1, 1);
                                        //Refresh FlatList !
                                        this.props.parentFlatList.refreshFlatList(deletingRow);
                                    }},
                            ],
                            { cancelable: true }
                        );
                    },
                    text: 'Delete', type: 'delete'
                }
            ],
            rowId: this.props.index,
            sectionId: 1
        };
        return (
            <Swipeout {...swipeSettings}
                      disabled =  { this.props.item.name == 'item' }
            >
                <View style={{
                    flex: 1,
                    flexDirection:'column',
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection:'row',
                        justifyContent: 'space-between',
                        backgroundColor: 'white'
                    }}>

                        <Text style={styles.flatListItem}>{this.props.item.name}</Text>
                        <Text style={styles.flatListItem}>{this.props.item.itemPrice}</Text>

                    </View>
                    <View style={{
                        borderBottomColor: 'white',
                        borderBottomWidth: 4,
                        width: '100%',
                    }}/>

                </View>
            </Swipeout>

        );
    }
}
const styles = StyleSheet.create({
    flatListItem: {
        fontFamily: 'Raleway-Bold',
        color: 'black',
        padding: 25,
        paddingLeft: 15,
        fontSize: 22,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fontSet: {
        fontSize: 23,
        textAlign: 'left',
        margin: 10,
        fontFamily: 'Raleway-Bold',
        color: '#26A65B',
    },
    box: {
        borderRadius: 100,
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'rgba(117,125,117,0.2)',
        color: '#000000',
        width: 120,
        height: 40,
        fontFamily: 'Raleway-Bold',

    },
    output:{
        fontSize: 20,
        marginTop: 7,
        textAlign: 'center',
        color: '#000000',
        fontFamily: 'Raleway-Bold',
    },
    calcContainer: {
        borderRadius: 90,
        width: 120,
        height: 40,
        backgroundColor: '#26A65B',
        marginLeft: '2%',
        fontFamily: 'Raleway-Bold',
        margin: 20,
        elevation:3,
    },
    cancelContainer: {
        borderRadius: 90,
        width: 120,
        height: 40,
        backgroundColor: '#F47983',
        marginRight: '2%',
        fontFamily: 'Raleway-Bold',
        margin: 20,
        elevation:3,
    },
    buttonFont: {
        fontSize: 20,
        marginTop: 7,
        fontFamily: 'Raleway-Bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    change: {
        margin: 20,
        borderRadius: 90,
        width: 120,
        height: 40,
        backgroundColor: '#6C7A89',
        color: '#FFFFFF',
        fontFamily: 'Raleway-Bold',
        marginRight: '2%',
        elevation: 3,
    },

});

export default class BasicFlatList extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            deletedRowKey: null,
        });
        this._onPressAdd = this._onPressAdd.bind(this);
    }
    refreshFlatList = (activeKey) => {
        this.setState((prevState) => {
            return {
                deletedRowKey: activeKey
            };
        });

    }
    _onPressAdd () {
        // alert("You add Item");
        this.refs.addModal.showAddModal();
    }

    sum(list){
        var sum = 0;
        for(var i = 0; i < list.length; i++){
            sum = sum + list[i];
        }
        return sum;
    }
    render() {
        return (
            <View style={{flex: 1,
                marginTop: Platform.OS === 'ios' ? 34 : 0,
                flexDirection: 'column',
                justifyContent:'space-between',  }}>

                <View style={styles.row}>
                    <Text> </Text>
                    <View style={styles.change}>
                        <TouchableOpacity onPress={() => {
                            if (this.state.total == null) {
                                Alert.alert("Please Calculate First");
                            } else {
                                this.props.navigation.navigate('SplitStep1', {amounts: this.state.total});
                                // this.props.navigation.navigate('ChargePeople', {peps: 1, amounts: this.state.total, tip: 0, tax: 0});
                            }
                        }}>
                            <Text style={styles.buttonFont}>Charge</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    style={{flex: 1}}
                    ref={"flatList"}
                    data={flatListData}
                    renderItem={({item, index})=>{
                        //console.log(Item = ${JSON.stringify(item)}, index = ${index});

                        return (
                            <FlatListItem item={item} index={index} parentFlatList={this}>

                            </FlatListItem>);

                    }}
                >

                </FlatList>
                <AddModal ref={'addModal'} parentFlatList={this} >

                </AddModal>

                <View style={{
                    alignItems: 'center',
                    height: 40,
                    width: 380, }}>
                    <TouchableOpacity
                        style={{marginRight: 10}}
                        onPress={this._onPressAdd}
                    >
                        <Text style={{color: "rgba(117,125,117,0.5)",
                            fontSize: 25,
                            fontFamily: 'Raleway-Bold',
                        }}> Tap to Add Items </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <View style={{
                        borderBottomColor: 'rgba(0,0,0,0.7)',
                        borderBottomWidth: 8,
                        width: '96%',
                        marginLeft: '2%',
                        marginRight: 20}}/>
                </View>

                <View style={styles.row}>
                    <Text style={styles.fontSet}>$Total Price</Text>
                    <View style={styles.box}>
                        <Text
                            style={styles.output}>{this.state.total}
                        </Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.calcContainer}>
                        <TouchableOpacity onPress={() => {
                            this.setState({total: this.sum(priceList)});
                        }}
                        >
                            <Text style={styles.buttonFont}>Calculate</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cancelContainer}>
                        <TouchableOpacity onPress={() => {
                            this.setState({total: 0});
                        }}
                        >
                            <Text style={styles.buttonFont}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }
}
// import React, { Component } from 'react';
// import { AppRegistry, FlatList, StyleSheet, Text, View, Image, Alert, Platform, TouchableOpacity } from 'react-native';
// import flatListData from '../data/flatListData';
// import priceList from '../data/priceList';
// import Swipeout from 'react-native-swipeout';
// import AddModal from './AddModal';
//
// class FlatListItem extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             activeRowKey: null,
//         };
//     }
//     render() {
//         const swipeSettings = {
//             autoClose: true,
//             onClose: (secId, rowId, direction) => {
//                 if(flatListData.length == 1){
//                     this.setState({ activeRowKey: null });
//                 }
//                 if(this.state.activeRowKey != null) {
//                     this.setState({ activeRowKey: null });
//                 }
//             },
//             onOpen: (secId, rowId, direction) => {
//                 if(this.props.item.index == 0){
//                     this.setState({ activeRowKey: null });
//                 }else{
//                     this.setState({ activeRowKey: this.props.item.name });
//                 }
//             },
//             right: [
//                 {
//                     onPress: () => {
//                         const deletingRow = this.state.activeRowKey;
//                         Alert.alert(
//                             'Alert',
//                             'Are you sure you want to delete ?',
//                             [
//                                 {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
//                                 {text: 'Yes', onPress: () => {
//                                         flatListData.splice(this.props.index, 1);
//                                         priceList.splice(this.props.index-1, 1);
//                                         //Refresh FlatList !
//                                         this.props.parentFlatList.refreshFlatList(deletingRow);
//                                     }},
//                             ],
//                             { cancelable: true }
//                         );
//                     },
//                     text: 'Delete', type: 'delete'
//                 }
//             ],
//             rowId: this.props.index,
//             sectionId: 1
//         };
//         return (
//             <Swipeout {...swipeSettings}
//                       disabled = { this.props.item.name == 'item' }
//             >
//                 <View style={{
//                     flex: 1,
//                     flexDirection:'column',
//                 }}>
//                     <View style={{
//                         flex: 1,
//                         flexDirection:'row',
//                         justifyContent: 'space-between',
//                         backgroundColor: 'white'
//                     }}>
//
//                         <Text style={styles.flatListItem}>{this.props.item.name}</Text>
//                         <Text style={styles.flatListItem}>{this.props.item.itemPrice}</Text>
//
//                     </View>
//                     <View style={{
//                         borderBottomColor: 'white',
//                         borderBottomWidth: 4,
//                         width: '100%',
//                     }}/>
//
//                 </View>
//             </Swipeout>
//
//         );
//     }
// }
// const styles = StyleSheet.create({
//     flatListItem: {
//         fontFamily: 'Raleway-Bold',
//         color: 'black',
//         padding: 25,
//         paddingLeft: 15,
//         fontSize: 22,
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     fontSet: {
//         fontSize: 23,
//         textAlign: 'left',
//         margin: 10,
//         fontFamily: 'Raleway-Bold',
//         color: '#26A65B',
//     },
//     box: {
//         borderRadius: 100,
//         fontSize: 20,
//         textAlign: 'center',
//         margin: 10,
//         backgroundColor: 'rgba(117,125,117,0.2)',
//         color: '#000000',
//         width: 120,
//         height: 40,
//         fontFamily: 'Raleway-Bold',
//
//     },
//     output:{
//         fontSize: 20,
//         marginTop: 7,
//         textAlign: 'center',
//         color: '#000000',
//         fontFamily: 'Raleway-Bold',
//     },
//     calcContainer: {
//         borderRadius: 90,
//         width: 120,
//         height: 40,
//         backgroundColor: '#26A65B',
//         marginLeft: '2%',
//         fontFamily: 'Raleway-Bold',
//         margin: 20,
//         elevation:3,
//     },
//     cancelContainer: {
//         borderRadius: 90,
//         width: 120,
//         height: 40,
//         backgroundColor: '#F47983',
//         marginRight: '2%',
//         fontFamily: 'Raleway-Bold',
//         margin: 20,
//         elevation:3,
//     },
//     buttonFont: {
//         fontSize: 20,
//         marginTop: 7,
//         fontFamily: 'Raleway-Bold',
//         color: '#FFFFFF',
//         textAlign: 'center',
//     },
//     change: {
//         margin: 20,
//         borderRadius: 90,
//         width: 120,
//         height: 40,
//         backgroundColor: '#6C7A89',
//         color: '#FFFFFF',
//         fontFamily: 'Raleway-Bold',
//         marginRight: '2%',
//         elevation: 3,
//     },
//
// });
//
// export default class BasicFlatList extends Component {
//     constructor(props) {
//         super(props);
//         this.state = ({
//             deletedRowKey: null,
//         });
//         this._onPressAdd = this._onPressAdd.bind(this);
//     }
//     refreshFlatList = (activeKey) => {
//         this.setState((prevState) => {
//             return {
//                 deletedRowKey: activeKey
//             };
//         });
//
//     }
//     _onPressAdd () {
//         // alert("You add Item");
//         this.refs.addModal.showAddModal();
//     }
//
//     sum(list){
//         var sum = 0;
//         for(var i = 0; i < list.length; i++){
//             sum = sum + list[i];
//         }
//         return sum;
//     }
//     render() {
//         return (
//             <View style={{flex: 1,
//                 marginTop: Platform.OS === 'ios' ? 34 : 0,
//                 flexDirection: 'column',
//                 justifyContent:'space-between',  }}>
//
//                 <View style={styles.row}>
//                     <Text> </Text>
//                     <View style={styles.change}>
//                         <TouchableOpacity onPress={() => {
//
//                         }}>
//                             <Text style={styles.buttonFont}>Charge</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//
//                 <FlatList
//                     style={{flex: 1,}}
//                     ref={"flatList"}
//                     data={flatListData}
//                     renderItem={({item, index})=>{
//                         //console.log(`Item = ${JSON.stringify(item)}, index = ${index}`);
//
//                         return (
//                             <FlatListItem item={item} index={index} parentFlatList={this}>
//
//                             </FlatListItem>);
//
//                     }}
//                 >
//
//                 </FlatList>
//                 <AddModal ref={'addModal'} parentFlatList={this} >
//
//                 </AddModal>
//
//                 <View style={{
//                     alignItems: 'center',
//                     height: 40,
//                     width: 380, }}>
//                     <TouchableOpacity
//                         style={{marginRight: 10}}
//                         onPress={this._onPressAdd}
//                     >
//                         <Text style={{color: "rgba(117,125,117,0.5)",
//                             fontSize: 25,
//                             fontFamily: 'Raleway-Bold',
//                         }}> Tap to Add Items </Text>
//                     </TouchableOpacity>
//                 </View>
//
//                 <View style={styles.row}>
//                     <View style={{
//                         borderBottomColor: 'rgba(0,0,0,0.7)',
//                         borderBottomWidth: 8,
//                         width: '96%',
//                         marginLeft: '2%',
//                         marginRight: 20}}/>
//                 </View>
//
//                 <View style={styles.row}>
//                     <Text style={styles.fontSet}>$Total Price</Text>
//                     <View style={styles.box}>
//                         <Text
//                             style={styles.output}>{this.state.total}
//                         </Text>
//                     </View>
//                 </View>
//
//                 <View style={styles.row}>
//                     <View style={styles.calcContainer}>
//                         <TouchableOpacity onPress={() => {
//                             this.setState({total: this.sum(priceList)});
//                         }}
//                         >
//                             <Text style={styles.buttonFont}>Calculate</Text>
//                         </TouchableOpacity>
//                     </View>
//                     <View style={styles.cancelContainer}>
//                         <TouchableOpacity onPress={() => {
//                             this.setState({total: 0});
//                         }}
//                         >
//                             <Text style={styles.buttonFont}>Clear</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//
//             </View>
//         );
//     }
// }
// //
// // import React, { Component } from 'react';
// // import { AppRegistry, FlatList, StyleSheet, Text, View, Image, Alert, Platform, TouchableOpacity } from 'react-native';
// // import flatListData from '../data/flatListData';
// // import priceList from '../data/priceList';
// // import Swipeout from 'react-native-swipeout';
// // import AddModal from './AddModal';
// //
// // class FlatListItem extends Component {
// //     constructor(props) {
// //         super(props);
// //         this.state = {
// //             activeRowKey: null,
// //             total: 0,
// //         };
// //     }
// //     render() {
// //         const swipeSettings = {
// //             autoClose: true,
// //             onClose: (secId, rowId, direction) => {
// //                 if(flatListData.length == 1){
// //                   this.setState({ activeRowKey: null });
// //                 }
// //                 if(this.state.activeRowKey != null) {
// //                     this.setState({ activeRowKey: null });
// //                 }
// //             },
// //             onOpen: (secId, rowId, direction) => {
// //                 if(this.props.item.index == 0){
// //                   this.setState({ activeRowKey: null });
// //                 }else{
// //                   this.setState({ activeRowKey: this.props.item.name });
// //                 }
// //
// //             },
// //             right: [
// //                 {
// //                     onPress: () => {
// //                         const deletingRow = this.state.activeRowKey;
// //                         Alert.alert(
// //                             'Alert',
// //                             'Are you sure you want to delete ?',
// //                             [
// //                               {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
// //                               {text: 'Yes', onPress: () => {
// //                                 flatListData.splice(this.props.index, 1);
// //                                 priceList.splice(this.props.index-1, 1);
// //                                 //Refresh FlatList !
// //                                 this.props.parentFlatList.refreshFlatList(deletingRow);
// //                               }},
// //                             ],
// //                             { cancelable: true }
// //                           );
// //                     },
// //                     text: 'Delete', type: 'delete'
// //                 }
// //             ],
// //             rowId: this.props.index,
// //             sectionId: 1
// //         };
// //         return (
// //             <Swipeout {...swipeSettings}>
// //               <View style={{
// //                 flex: 1,
// //                 flexDirection:'column',
// //                 }}>
// //                   <View style={{
// //                     flex: 1,
// //                     flexDirection:'row',
// //                     justifyContent: 'space-between',
// //                     backgroundColor: 'white'
// //                     }}>
// //
// //                     <Text style={styles.flatListItem}>{this.props.item.name}</Text>
// //                     <Text style={styles.flatListItem}>{this.props.item.itemPrice}</Text>
// //
// //                   </View>
// //                   <View style={{
// //                     borderBottomColor: 'white',
// //                     borderBottomWidth: 4,
// //                     width: '100%',
// //                   }}/>
// //
// //               </View>
// //             </Swipeout>
// //
// //         );
// //     }
// // }
// // const styles = StyleSheet.create({
// //     flatListItem: {
// //         fontFamily: 'Raleway-Bold',
// //         color: 'black',
// //         padding: 25,
// //         paddingLeft: 15,
// //         fontSize: 22,
// //     },
// //     row: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //     },
// //     fontSet: {
// //         fontSize: 23,
// //         textAlign: 'left',
// //         margin: 10,
// //         fontFamily: 'Raleway-Bold',
// //         color: '#26A65B',
// //     },
// //     box: {
// //         borderRadius: 100,
// //         fontSize: 20,
// //         textAlign: 'center',
// //         margin: 10,
// //         backgroundColor: 'rgba(117,125,117,0.2)',
// //         color: '#000000',
// //         width: 120,
// //         height: 40,
// //         fontFamily: 'Raleway-Bold',
// //
// //     },
// //     output:{
// //         fontSize: 20,
// //         marginTop: 7,
// //         textAlign: 'center',
// //         color: '#000000',
// //         fontFamily: 'Raleway-Bold',
// //     },
// //     calcContainer: {
// //         borderRadius: 90,
// //         width: 120,
// //         height: 40,
// //         backgroundColor: '#26A65B',
// //         marginLeft: '2%',
// //         fontFamily: 'Raleway-Bold',
// //         margin: 20,
// //         elevation:3,
// //     },
// //     cancelContainer: {
// //         borderRadius: 90,
// //         width: 120,
// //         height: 40,
// //         backgroundColor: '#F47983',
// //         marginRight: '2%',
// //         fontFamily: 'Raleway-Bold',
// //         margin: 20,
// //         elevation:3,
// //     },
// //     buttonFont: {
// //         fontSize: 20,
// //         marginTop: 7,
// //         fontFamily: 'Raleway-Bold',
// //         color: '#FFFFFF',
// //         textAlign: 'center',
// //     },
// //     change: {
// //         margin: 20,
// //         borderRadius: 90,
// //         width: 120,
// //         height: 40,
// //         backgroundColor: '#6C7A89',
// //         color: '#FFFFFF',
// //         fontFamily: 'Raleway-Bold',
// //         marginRight: '2%',
// //         elevation: 3,
// //     },
// //
// // });
// //
// // export default class BasicFlatList extends Component {
// //     constructor(props) {
// //         super(props);
// //         this.state = ({
// //             deletedRowKey: null,
// //         });
// //         this._onPressAdd = this._onPressAdd.bind(this);
// //     }
// //     refreshFlatList = (activeKey) => {
// //         this.setState((prevState) => {
// //             return {
// //                 deletedRowKey: activeKey
// //             };
// //         });
// //
// //     }
// //     _onPressAdd () {
// //         // alert("You add Item");
// //         this.refs.addModal.showAddModal();
// //     }
// //
// //     sum(list){
// //       var sum = 0;
// //       for(var i = 0; i < list.length; i++){
// //         sum = sum + list[i];
// //       }
// //       return sum;
// //     }
// //     render() {
// //       return (
// //         <View style={{flex: 1,
// //                       marginTop: Platform.OS === 'ios' ? 34 : 0,
// //                       flexDirection: 'column',
// //                       justifyContent:'space-between',  }}>
// //
// //             <View style={styles.row}>
// //                <Text> </Text>
// //                <View style={styles.change}>
// //                   <TouchableOpacity onPress={() => {
// //
// //                    }}>
// //                   <Text style={styles.buttonFont}>Charge</Text>
// //                </TouchableOpacity>
// //                </View>
// //             </View>
// //
// //             <FlatList
// //                 ref={"flatList"}
// //                 data={flatListData}
// //                 renderItem={({item, index})=>{
// //                     //console.log(`Item = ${JSON.stringify(item)}, index = ${index}`);
// //
// //                       return (
// //                         <FlatListItem item={item} index={index} parentFlatList={this}>
// //
// //                         </FlatListItem>);
// //
// //                 }}
// //                 >
// //
// //             </FlatList>
// //             <AddModal ref={'addModal'} parentFlatList={this} >
// //
// //             </AddModal>
// //
// //             <View style={{
// //                 alignItems: 'center',
// //                 height: 40,
// //                 width: 380, }}>
// //                 <TouchableOpacity
// //                     style={{marginRight: 10}}
// //                     onPress={this._onPressAdd}
// //                     >
// //                     <Text style={{color: "rgba(117,125,117,0.5)",
// //                                   fontSize: 25,
// //                                   fontFamily: 'Raleway-Bold',
// //                                 }}> Tap to Add Items </Text>
// //                 </TouchableOpacity>
// //             </View>
// //
// //             <View style={styles.row}>
// //                 <View style={{
// //                     borderBottomColor: 'rgba(0,0,0,0.7)',
// //                     borderBottomWidth: 8,
// //                     width: '96%',
// //                     marginLeft: '2%',
// //                     marginRight: 20}}/>
// //               </View>
// //
// //               <View style={styles.row}>
// //                 <Text style={styles.fontSet}>$Total Price</Text>
// //                 <View style={styles.box}>
// //                     <Text
// //                         style={styles.output}>{this.state.total}
// //                     </Text>
// //                 </View>
// //             </View>
// //
// //             <View style={styles.row}>
// //                 <View style={styles.calcContainer}>
// //                     <TouchableOpacity onPress={() => {
// //                       this.setState({total: this.sum(priceList)});
// //                     }}
// //                     >
// //                         <Text style={styles.buttonFont}>Calculate</Text>
// //                     </TouchableOpacity>
// //                 </View>
// //                 <View style={styles.cancelContainer}>
// //                     <TouchableOpacity onPress={() => {
// //                         this.setState({total: 0});
// //                     }}
// //                     >
// //                         <Text style={styles.buttonFont}>Clear</Text>
// //                     </TouchableOpacity>
// //                 </View>
// //             </View>
// //
// //         </View>
// //       );
// //     }
// // }
