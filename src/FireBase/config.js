// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCasV1wHgrDMRmZvhbpU9Aybcp0IKAqC0Y",
  authDomain: "inmobiliaria-d51de.firebaseapp.com",
  projectId: "inmobiliaria-d51de",
  storageBucket: "gs://inmobiliaria-d51de.appspot.com",
  messagingSenderId: "441382903994",
  appId: "1:441382903994:web:aa8a584107d239a60da283",
  measurementId: "G-X9LF8FSM77",
  
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const initFirebase=()=>app