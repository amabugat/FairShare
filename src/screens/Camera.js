import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
    PixelRatio, StyleSheet
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNTesseractOcr from 'react-native-tesseract-ocr';

const Button = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableOpacity;
const imagePickerOptions = {
    quality: 1.0,
    maxWidth: 2000,
    maxHeight: 3000,
    storageOptions: {
        skipBackup: true,
    },
};
const tessOptions = {
    whitelist: null,
    blacklist: null
};

class Camera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            extractedText: null,
            hasErrored: false,
            imageSource: null,
            isLoading: false,
        };
        this.selectImage = this.selectImage.bind(this);
    }

    selectImage() {
        this.setState({ isLoading: true });

        ImagePicker.showImagePicker(imagePickerOptions, (response) => {
            if (response.didCancel) {
                this.setState({ isLoading: false });
            } else if (response.error) {
                this.setState({ isLoading: false, hasErrored: true, errorMessage: response.error });
            } else {
                const source = { uri: response.uri };
                this.setState({ imageSource: source, hasErrored: false, errorMessage: null }, this.extractTextFromImage(response.path));
            }
        });
    }

    extractTextFromImage(imagePath) {
        RNTesseractOcr.recognize(imagePath, 'LANG_ENGLISH', tessOptions)
            .then((result) => {
                var output = result.split('\n');
                var item = [];
                var price = [];
                var total = [];
                let flag = false;
                for(var i = 0; i < output.length; i++)
                {
                    // if(/\b(\w*Total\w*)\b(\s*)(\d*\.\d{2})/.test(output[i]))
                    // {
                    //     console.log("Found total")
                    //     flag = true;
                    // }
                    if(/(?=\d\.\d{2})/.test(output[i])){
                        console.log("its true")
                        console.log(output[i])
                        const re = /((\s*\w+\s)+)(\s*)(\d*\.\d{2})/
                        const hehe = re.exec(output[i])
                        console.log(hehe);
                        console.log(hehe[1])
                        console.log(hehe[hehe.length-1])
                        item.push(hehe[1]);
                        price.push(hehe[hehe.length-1]);
                        flag = true;
                    }
                    else{
                        console.log("false");
                    }
                }
                console.log(price);
                console.log(item);

                if(flag == true)
                {
                    this.setState({ isLoading: false, extractedText: result});
                    flag = false;
                }
                else{
                    this.setState({ isLoading: false, hasErrored: true, errorMessage: "ERROR" });
                    flag = false;
                }


            })
            .catch((err) => {
                this.setState({ hasErrored: true, errorMessage: err.message });
            });
    }

    render() {
        const { errorMessage, extractedText, hasErrored, imageSource, isLoading } = this.state;
        return (
            <View style={styles.container}>
                <Button onPress={this.selectImage} >
                    <View style={[styles.image, styles.imageContainer, !imageSource && styles.rounded]}>
                        {
                            imageSource === null
                                ? <Text>Tap me!</Text>
                                : <Image style={styles.image} source={imageSource} />
                        }
                    </View>
                </Button>
                {
                    isLoading
                        ? <ActivityIndicator size="large" />
                        : (
                            hasErrored
                                ? <Text>{errorMessage}</Text>
                                : this.props.navigation.navigate('NotEvenValidation'))
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        margin: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    imageContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    image: {
        width: 150,
        height: 300,
    },
    rounded: {
        borderRadius: 75,
    }
});

Camera.navigationOptions = {
    title: 'Image Picker Example',
};

export default Camera;
