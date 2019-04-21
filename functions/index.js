const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.helloWorld = functions.database.ref('/Payments/{uid}/GettingCharged/{rid}')
        .onWrite(async (snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
    //  console.log('Uppercasing', context.params.pushId, original);
    //  const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
     await snapshot.ref.update({
       //price: price.....
       //new timestamp is this
     })

    });
