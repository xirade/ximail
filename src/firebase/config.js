import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: "ximail.firebaseapp.com",
  projectId: "ximail",
  storageBucket: "ximail.appspot.com",
  messagingSenderId: "752082075882",
  appId: process.env.VUE_APP_ID
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();
const projectFunctions = firebase.functions();
const googleAuth = firebase.auth;

// timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp;



export { firebaseConfig, projectFirestore, projectAuth, projectStorage, googleAuth, timestamp };
