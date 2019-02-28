import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './Home';
import Friends from './Friends';
import BillPrompt from './billsplit/BillPrompt';
import SplitStep1 from './billsplit/SplitStep1';
import SplitStep2 from './billsplit/SplitStep2';
import SplitStep3 from './billsplit/SplitStep3';
import NoSplit from './billsplit/NoSplit';
import Groups from './groups/Groups.js';
import SearchFriends from './groups/SearchFriends.js';
import BillSplitProcess from './billsplit/BillSplitProcess';
import Row from './Row';
import Landing from './Landing';


const Navigation = createStackNavigator({
    Home: { screen: Home, navigationOptions: () => ({
            header:null,
        }), },
    Friends: { screen: Friends, navigationOptions: () => ({
            title: 'My Activity',
            headerStyle:{backgroundColor: '#3d3e52', elevation:0, fontFamily: "Raleway-Regular"},
            headerTitleStyle: {alignSelf:'center', color: '#fcfcfe', textAlign: 'center', fontFamily: "Raleway-Regular"},
            headerLeft:null,
        }),},
    BillPrompt: {screen: BillPrompt, navigationOptions: () => ({
            headerStyle:{backgroundColor: '#82b85a', elevation:0},
        }),},
    SplitStep1: {screen: SplitStep1},
    SplitStep2: {screen: SplitStep2},
    SplitStep3: {screen: SplitStep3},
    NoSplit: {screen: NoSplit},
    BillSplitProcess: {screen: BillSplitProcess},
    Row: {screen: Row},
    Landing: {screen: Landing, navigationOptions: () => ({
            header:null,
        }),},
    Groups: {screen: Groups},
    SearchFriends: {screen: SearchFriends},
});

const App = createAppContainer(Navigation);

export default App;