import React, { Component } from 'react'
import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native'

import BasicFlatList from '../../components/BasicFlatList';



export default class BillSplitProcess extends Component {
    constructor () {
        super();

        this.state = {
            currentPage: 0,
        };
    }

    componentWillReceiveProps (nextProps, nextState) {
        if (nextState.currentPage != this.state.currentPage) {
            if (this.viewPager) {
                this.viewPager.setPage(nextState.currentPage)
            }
        }
    }


    render () {
        return (
            <BasicFlatList style={{marginTop: 20}}/>
        )
    }
}

const styles = StyleSheet.create({
    flatListItem: {
        fontFamily: 'Raleway-Bold',
        color: 'black',
        padding: 25,
        paddingLeft: 15,
        fontSize: 18,
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
    }

});

// import React, { Component } from 'react'
// import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native'
// import { ViewPager } from 'rn-viewpager'
// import SplitStep1 from './SplitStep1';
// import SplitStep2 from './SplitStep2';
// import SplitStep3 from './SplitStep3';
//
// import StepIndicator from 'react-native-step-indicator'
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
//
// const PAGES = ['Page 1', 'Page 2', 'Page 3']
//
// const firstIndicatorStyles = {
//     stepIndicatorSize: 30,
//     currentStepIndicatorSize: 40,
//     separatorStrokeWidth: 3,
//     currentStepStrokeWidth: 5,
//     separatorFinishedColor: '#4aae4f',
//     separatorUnFinishedColor: '#a4d4a5',
//     stepIndicatorFinishedColor: '#4aae4f',
//     stepIndicatorUnFinishedColor: '#a4d4a5',
//     stepIndicatorCurrentColor: '#ffffff',
//     stepIndicatorLabelFontSize: 15,
//     currentStepIndicatorLabelFontSize: 15,
//     stepIndicatorLabelCurrentColor: '#000000',
//     stepIndicatorLabelFinishedColor: '#ffffff',
//     stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
//     labelColor: '#666666',
//     labelSize: 12,
//     currentStepLabelColor: '#4aae4f'
// }
//
//
// export default class BillSplitProcess extends Component {
//     constructor () {
//         super()
//         this.state = {
//             currentPage: 0
//         }
//     }
//
//     componentWillReceiveProps (nextProps, nextState) {
//         if (nextState.currentPage != this.state.currentPage) {
//             if (this.viewPager) {
//                 this.viewPager.setPage(nextState.currentPage)
//             }
//         }
//     }
//
//     render () {
//         return (
//             <View style={styles.container}>
//                 <View style={styles.stepIndicator}>
//                     <StepIndicator
//                         customStyles={firstIndicatorStyles}
//                         currentPosition={this.state.currentPage}
//                         labels={['Bill Split', 'Enter Items', 'Charge']}
//                         stepCount={3}
//                     />
//                 </View>
//
//                 <ViewPager
//                     style={{ flexGrow: 1 }}
//                     ref={(viewPager) => {this.viewPager = viewPager}}
//                     onPageSelected={page => {
//                         this.setState({ currentPage: page.position })
//                     }}
//                 >
//                     {/*{PAGES.map(page => this.renderViewPagerPage(page))}*/}
//                     {/*<View>*/}
//                         <View style={styles.container1}>
//
//                             <Text style={styles.name}>How many ways will the bill be split?</Text>
//                             <TextInput style={styles.textInput1} placeholder='# of ways' />
//                             <Text style={styles.name}>Tip</Text>
//                             <TextInput style={styles.textInput2} placeholder='$' />
//                             <Text style={styles.name}>Tax</Text>
//                             <TextInput style={styles.textInput2} placeholder='$' />
//
//                         </View>
//                         {/*<SplitStep1/>*/}
//                     {/*</View>*/}
//                     {/*<View>*/}
//                         <View style={styles.container1}>
//
//                             <TouchableOpacity onPress={() =>
//                                 this.props.navigation.navigate('SplitStep3')
//                             } style={styles.button1}>
//                                 <Text style = {styles.buttonText}> Next </Text>
//                             </TouchableOpacity>
//
//                         </View>
//                         {/*<SplitStep2/>*/}
//                     {/*</View>*/}
//                     <View style={styles.container1}>
//
//                         {/*<SplitStep3/>*/}
//                         <TouchableOpacity onPress={() =>
//                             this.props.navigation.navigate('Friends')
//                         } style={styles.button1}>
//                             <Text style = {styles.buttonText}> Charge </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </ViewPager>
//             </View>
//         )
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fcfcfe'
//     },
//     container1: {
//         flex: 1,
//         backgroundColor: '#fcfcfe',
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'column',
//     },
//     stepIndicator: {
//         marginVertical: 50
//     },
//     page: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     button1: {
//         fontFamily: "Raleway-Regular",
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
//         color: 'white',
//     },
//     name:{
//         fontFamily: "Raleway-Regular",
//         marginTop:20,
//         fontSize:25,
//         color:'#4f4f69',
//         // fontWeight:'bold',
//         textAlign: 'center'
//     },
//     textInput1:{
//         fontFamily: "Raleway-Regular",
//         marginTop:10,
//         alignItems: 'center',
//     },
//     textInput2:{
//         fontFamily: "Raleway-Regular",
//         marginBottom:10,
//         marginTop:10,
//         alignItems: 'center',
//     }
// });