import React from "react";
import Navigation from "./src/screens/Navigation";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";


const firebaseConfig = {
   apiKey: "AIzaSyAVTfoYm9xKwrHu-jwSzJOye1XRCJBYuz0",
   authDomain: "fairshare-96c68.firebaseapp.com",
   databaseURL: "https://fairshare-96c68.firebaseio.com",
   projectId: "fairshare-96c68",
   storageBucket: "fairshare-96c68.appspot.com"
};
//Getting rid of low warnings
console.disableYellowBox = true;

firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
   render() {
      return <Navigation />;
   }
}
