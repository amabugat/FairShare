import PushNotification from 'react-native-push-notification';


const configure = () => {
 PushNotification.configure({

   onRegister: function(token) {
     //process token
   },

   onNotification: function(notification) {
     // process the notification
   },

   permissions: {
     alert: true,
     badge: true,
     sound: true
   },

   popInitialNotification: true,
   requestPermissions: true,

 });
};

const localNotification = () => {
    PushNotification.localNotification({
      autoCancel: true,
      largeIcon: "ic_launcher",
      smallIcon: "ic_notification",
      bigText: "Click and See Your Recent Activity",
      color: "green",
      vibrate: true,
      vibration: 300,
      message: "You Are Being Charged",
      playSound: true,
      soundName: 'default',
    });
   };



export {
 configure,
 localNotification,
};