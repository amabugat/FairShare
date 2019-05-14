import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity} from 'react-native';

type Props = {};

export default class NoSplit extends Component{
    constructor(props) {
        super(props);
        this.state = { subtotal: null, tax: null, tip: null, people: null, result: null, split: null, zip: 0, lat:0, lng:0 };
    }

    async componentWillMount(){
        var that = this;
        await navigator.geolocation.getCurrentPosition(position => {
          console.log(position)
          that.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
           fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng="+ position.coords.latitude +","+ position.coords.longitude+"&key=AIzaSyDfAZDo1UpXtkp2dO9VaZ1VIWrLtc7TjQc")
          .then(response => response.json())
          .then((responseJson)=> {
            var result = responseJson.results[0].address_components[6].long_name;
            console.log(result)
            that.setState({
              zip: result,
            })
            fetch("https://api.zip-tax.com/request/v40?key=FQMDodzmaEHJcRy3&postalcode=" + result)
                .then(response => response.json())
                .then((responseJson)=> {
                //  console.log(responseJson.results)
                  var decimalTax = responseJson.results[0].taxSales*100;
                  console.log(decimalTax)
                  that.setState({
                   tax: decimalTax,
                  })
                })
                .catch(error=>console.log(error))
          })

          .catch(error=>console.log(error)) //to catch the errors if any
        })
        console.log(this.state.tax)

        if(that.state.zip == 0){
          console.log("can;t find zip");
        }
        // await fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng="+ this.state.lat +","+ this.state.lng+"&key=AIzaSyDfAZDo1UpXtkp2dO9VaZ1VIWrLtc7TjQc")
        // .then(response => response.json())
        // .then((responseJson)=> {
        //   //var result = responseJson.results[0].address_components[6].long_name;
        //   console.log(responseJson)
        //   // that.setState({
        //   //   zip: result,
        //   // })
        //    })
        //
        // .catch(error=>console.log(error)) //to catch the errors if any
        //
         // fetch("https://api.zip-tax.com/request/v40?key=FQMDodzmaEHJcRy3&postalcode=" + this.state.zip)
         //     .then(response => response.json())
         //     .then((responseJson)=> {
         //       console.log(responseJson.results)
         //       var decimalTax = responseJson.results[0].taxSales*100;
         //       this.setState({
         //        tax: decimalTax,
         //       })
         //     })
         //     .catch(error=>console.log(error)) //to catch the errors if any
        }

    render() {
        return (
            <View behavior='padding' style={styles.useless}>
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.row}>
                            <Text>{this.state.tax} </Text>
                            <View style={styles.change}>
                                <TouchableOpacity onPress={() => {
                                    if(this.state.split === null){
                                        alert("Please Calculate First");
                                    }
                                    else
                                    {
                                        this.props.navigation.navigate('ChargePeople', {peps: this.state.people, amounts: this.state.split, tax: this.state.tax, tip: this.state.tip});
                                    }

                                }}
                                >
                                    <Text style={styles.buttonFont}>Charge</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.fontSet}>$Subtotal</Text>
                            <TextInput
                                style={styles.box}
                                keyboardType = 'numeric'
                                returnKeyType='done'
                                ref={sub => { this.subInput = sub }}
                                onChangeText={(subtotal) => this.setState({subtotal: parseFloat(subtotal)})}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.fontSet}>%Tax</Text>
                            <TextInput
                                style={styles.box}
                                keyboardType = 'numeric'
                                returnKeyType='done'
                                value={this.state.tax}
                                ref={ta => { this.taxInput = this.state.tax }}
                                onChangeText={(tax) => this.setState({tax: parseFloat(tax)})}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.fontSet}>%Tip</Text>
                            <TextInput
                                style={styles.box}
                                keyboardType = 'numeric'
                                returnKeyType='done'
                                ref={ti => { this.tipInput = ti }}
                                onChangeText={(tip) => this.setState({tip: parseFloat(tip)})}
                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.fontSet}>Total People</Text>
                            <TextInput
                                style={styles.box}
                                keyboardType = 'numeric'
                                returnKeyType='done'
                                ref={peo => { this.pInput = peo }}
                                onChangeText={(people) => this.setState({people: parseFloat(people)})}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={{
                                borderBottomColor: 'grey',
                                borderBottomWidth: 8,
                                width: '96%',
                                marginLeft: '2%',
                                marginRight: 20}}/>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.fontSet}>$Total Price</Text>
                            <View style={styles.outputBox}>
                                <Text
                                    style={styles.output}>{ this.state.result ? this.state.result.toFixed(2) : null }
                                </Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.fontSet}>$Price per Person</Text>
                            <View style={styles.outputBox}>
                                <Text
                                    style={styles.output}>{ this.state.split ? this.state.split.toFixed(2) : null }</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.calcContainer}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ result: (this.state.subtotal && this.state.tax && this.state.tip) ?
                                            (this.state.subtotal + this.state.subtotal*0.01*this.state.tax + (this.state.subtotal + this.state.subtotal*0.01*this.state.tax)*0.01*this.state.tip): null,
                                        split: (this.state.people)? (this.state.subtotal + this.state.subtotal*0.01*this.state.tax + (this.state.subtotal + this.state.subtotal*0.01*this.state.tax)*0.01*this.state.tip)/this.state.people: null })
                                }}
                                >
                                    <Text style={styles.buttonFont}>Calculate</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cancelContainer}>
                                <TouchableOpacity onPress={() => {
                                    this.subInput.clear();
                                    this.tipInput.clear();
                                    this.taxInput.clear();
                                    this.pInput.clear();
                                    this.setState({result: null, split: null})
                                }}
                                >
                                    <Text style={styles.buttonFont}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    useless:{
        flex: 1,
        backgroundColor: '#FFFFFF'
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

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        backgroundColor: '#FFFFFF',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonFont: {
        fontSize: 20,
        marginTop: 7,
        fontFamily: 'Raleway-Bold',
        color: '#FFFFFF',
        textAlign: 'center',
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
    outputBox: {
        borderRadius: 100,
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#82b85a',
        color: '#000000',
        width: 120,
        height: 40,
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
    output:{
        fontSize: 20,
        marginTop: 7,
        textAlign: 'center',
        color: '#000000',
        fontFamily: 'Raleway-Bold',
    }
});
