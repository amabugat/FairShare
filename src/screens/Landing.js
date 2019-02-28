import React, { Component } from "react";
import { StyleSheet, Image } from "react-native";
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    Card,
    CardItem,
    Text,
    Thumbnail,
    Left,
    Body,
    Right
} from "native-base";

const logo = require("../images/logo.png");
const cardImage = require("../images/puppy-dog.jpg");

class Landing extends Component {
    render() {
        return (


            <Container style={styles.container}>

                <Content padder>
                    <Card style={styles.mb}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={logo} />
                                <Body>
                                <Text>Receipt 1</Text>
                                <Text note>Not Paid</Text>
                                </Body>
                            </Left>
                        </CardItem>

                        <CardItem cardBody>
                            <Image
                                style={{
                                    resizeMode: "cover",
                                    width: null,
                                    height: 200,
                                    flex: 1
                                }}
                                source={cardImage}
                            />
                        </CardItem>

                        <CardItem style={{ paddingVertical: 0 }}>
                            <Left>
                                <Button transparent>
                                    <Icon active name="paper-plane" />
                                    <Text>Pay Now</Text>
                                </Button>
                            </Left>
                            <Body>
                            <Button transparent>
                                <Icon active name="chatbubbles" />
                                <Text>89 Comments</Text>
                            </Button>
                            </Body>
                            <Right>
                                <Text>11h ago</Text>
                            </Right>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3d3e52',
        alignSelf: 'stretch'
    },
    mb: {
        marginBottom: 15
    }
});

export default Landing;
