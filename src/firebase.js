import * as firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBHCzAj1gHnagOKeb3GeOIzizaqFFc9g-g",
  authDomain: "dot-eater.firebaseapp.com",
  databaseURL: "https://dot-eater.firebaseio.com",
  projectId: "dot-eater",
  storageBucket: "dot-eater.appspot.com",
  messagingSenderId: "716607656616",
  appId: "1:716607656616:web:0eaf1ca3f41915f117e89d",
  measurementId: "G-GTSK7MVGVF"
});

const db = firebaseApp.firestore();

export default db;
