import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBwJX_sz8hqXgncH9s7M0VFKQ8Pn8_ExUo",
    authDomain: "dadjokes-e713b.firebaseapp.com",
    databaseURL: "https://dadjokes-e713b.firebaseio.com",
    messagingSenderId: "247600642463",
    projectId: "dadjokes-e713b",
    storageBucket: "",
  };

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.database();

export {
  auth,
  db,
};