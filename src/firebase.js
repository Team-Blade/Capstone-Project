import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB1_8QPCdenvQNLeOx8etmkb9Z4RNQ87Ks",
  authDomain: "pac-man-clone.firebaseapp.com",
  databaseURL: "https://pac-man-clone.firebaseio.com",
  projectId: "pac-man-clone",
  storageBucket: "pac-man-clone.appspot.com",
  messagingSenderId: "860511261591",
  appId: "1:860511261591:web:84a347757381be9b922ad2",
  measurementId: "G-5MEJMS0CHY"
});

const db = firebaseApp.firestore();

export { db };
