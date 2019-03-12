import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    TabView,
    TabBar,
    SceneMap,
    type NavigationState,
} from 'react-native-tab-view';
import ViewChargedScreen from './ViewChargedScreen';
import ViewRequestScreen from './ViewRequestScreen';

type State = NavigationState<{
    key: string,
    icon: string,
}>;

export default class Friends extends React.Component<*, State> {
    state = {
        index: 0,
        routes: [
            { key: 'requested', icon: 'md-chatbubbles' },
            { key: 'charged', icon: 'md-card' },
        ],
    };

    _handleIndexChange = index =>
        this.setState({
            index,
        });

    _renderIcon = ({ route, color }) => (
        <Icon name={route.icon} size={24} color={color} />
    );

    _renderTabBar = props => {
        return (
            <TabBar
                {...props}
                indicatorStyle={styles.indicator}
                renderIcon={this._renderIcon}
                style={styles.tabbar}
            />
        );
    };

    _renderScene = SceneMap({
        requested: ViewRequestScreen,
        charged: ViewChargedScreen,
    });

    render() {
        return (
                <TabView
                    lazy
                    style={this.props.style}
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={this._handleIndexChange}
                />

        );
    }
}

const styles = StyleSheet.create({
    tabbar: {
        backgroundColor: '#559535',
    },
    indicator: {
        backgroundColor: '#fcfcfe',
    },
});

