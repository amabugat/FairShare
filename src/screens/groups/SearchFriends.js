import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
    Container,
    Header,
    Button,
    Icon,
    Item,
    Input,
    Content,
    Text,
    List,
    ListItem,
    Thumbnail,
    Left,
    Right,
    Body,
} from "native-base";

const logo = require("../../images/logo.png");
const datas = [
    {
        img: logo,
        text: "Alexis Mabugat",
        note: "asdfasf",
        time: "3:43 pm"
    },
    {
        img: logo,
        text: "Danny Phan",
        note: "Oasdfadsf ",
        time: "1:12 pm"
    },
    {
        img: logo,
        text: "Andy Wong",
        note: "Lasdfad",
        time: "10:03 am"
    },
    {
        img: logo,
        text: "Jerod Zhang",
        note: "asdfasdft",
        time: "5:47 am"
    },
    {
        img: logo,
        text: "James Chen",
        note: "asdasdfasdf !!",
        time: "11:11 pm"
    },
];

class SearchFriends extends Component {
    render() {
        return (
            <Container style={styles.container}>
                <Header searchBar rounded style = {{backgroundColor: "#3d3e52"}}>
                    <Item>
                        <Icon active name="search" />
                        <Input placeholder="Search" />
                        <Icon active name="people" />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>

                <Content padder>
                    <List>
                        {datas.map((data, i) => (
                            <ListItem avatar>
                                <Left>
                                    <Thumbnail small source={data.img} />
                                </Left>
                                <Body>
                                <Text style = {{color: "#FFF"}}>{data.text}</Text>
                                <Text numberOfLines={1} note style = {{color: "#FFF"}}>
                                    {data.note}
                                </Text>
                                </Body>
                                <Right>
                                    <Text note>{data.time}</Text>
                                </Right>
                            </ListItem>
                        ))}
                    </List>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#3d3e52"
    },
});

export default SearchFriends;