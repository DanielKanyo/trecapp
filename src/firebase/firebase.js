import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const prodConfig = {
  apiKey: "AIzaSyDfuJ2DuKlJv_AsbRUpXcz6jNALpfZBHCE",
  authDomain: "my-recipes-app-f8c1b.firebaseapp.com",
  databaseURL: "https://my-recipes-app-f8c1b.firebaseio.com",
  projectId: "my-recipes-app-f8c1b",
  storageBucket: "my-recipes-app-f8c1b.appspot.com",
  messagingSenderId: "343275356168"
};

const devConfig = {
  apiKey: "AIzaSyDfuJ2DuKlJv_AsbRUpXcz6jNALpfZBHCE",
  authDomain: "my-recipes-app-f8c1b.firebaseapp.com",
  databaseURL: "https://my-recipes-app-f8c1b.firebaseio.com",
  projectId: "my-recipes-app-f8c1b",
  storageBucket: "my-recipes-app-f8c1b.appspot.com",
  messagingSenderId: "343275356168"
};

const config = process.env.NODE_ENV === 'production' ?
  prodConfig :
  devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};