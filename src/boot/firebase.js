
import firebase from "firebase/app";
import "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyjew6_-VbxGrAXyIUwN-02cRXc_vWXD4",
  authDomain: "qwitter-d8f5e.firebaseapp.com",
  projectId: "qwitter-d8f5e",
  storageBucket: "qwitter-d8f5e.appspot.com",
  messagingSenderId: "133330251132",
  appId: "1:133330251132:web:a0c1da4d1057fc35a208f9"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

export default db
