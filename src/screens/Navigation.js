import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './Home';
import Friends from './Friends';
import BillPrompt from './billsplit/BillPrompt';

const Navigation = createStackNavigator({
    Home: { screen: Home, navigationOptions: () => ({
            header:null,
        }), },
    Friends: { screen: Friends, navigationOptions: () => ({
            title: 'My Activity',
            headerStyle:{backgroundColor: '#3d3e52', elevation:0},
            headerTitleStyle: {alignSelf:'center', color: '#fcfcfe', textAlign: 'center'},
            headerLeft:null,
        }),},
    BillPrompt: {screen: BillPrompt}
});

const App = createAppContainer(Navigation);

export default App;