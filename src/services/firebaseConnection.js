import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB848b83yr65stsvi0Xzt08UOjpdy5nRoQ",
    authDomain: "sistema-chamados-d0a24.firebaseapp.com",
    projectId: "sistema-chamados-d0a24",
    storageBucket: "sistema-chamados-d0a24.appspot.com",
    messagingSenderId: "469899001139",
    appId: "1:469899001139:web:67fe83862ad773e3ca9246",
    measurementId: "G-MTR52H7PWP"
  };

  
  // Initialize Firebase
const fireConnection = initializeApp.length && initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export  {fireConnection, db, auth };