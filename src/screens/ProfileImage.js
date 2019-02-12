import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

export default class ProfileImage extends React.Component {
    render() {
        return (
                <View style={styles.header}>
                    <View style={styles.profilepicWrap}>
                        <Image style={styles.profilepic} source={require('../images/logo.png')} />
                    </View>

                    <Text style={styles.name}>FairShare</Text>

                </View>

        );
    }
}



const styles = StyleSheet.create({
    headerBackground:{
        flex:1,
        width:null,
        alignSelf: 'stretch'
    },
    header:{
        // flex:1,
        alignItems:'center',
        justifyContent:'center',
        padding:5,
        // backgroundColor:'rgba(0,0,0,0.5)',
    },
    profilepicWrap:{
        width:180,
        height:180,
        borderRadius:100,
        borderColor:'rgba(0,0,0,0.4)',
        borderWidth:5,
        backgroundColor: '#e5dddd',
    },
    profilepic:{
        flex:1,
        width:null,
        alignSelf:'stretch',
        borderRadius:100,
        borderColor:'#e5dddd',
        borderWidth:4,
    },
    name:{
        marginTop:20,
        fontSize:25,
        color:'#4f4f69',
        fontWeight:'bold',
    },
    pos:{
        fontSize:14,
        color:'#0395c0',
        fontWeight:'300',
        fontStyle:'italic',
    }


});