// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxoDyjbN0f4k2ytsgqykTXdBxwC49iZZQ",
  authDomain: "paradisewatersports.firebaseapp.com",
  projectId: "paradisewatersports",
  storageBucket: "paradisewatersports.firebasestorage.app",
  messagingSenderId: "553376539190",
  appId: "1:553376539190:web:ce7948ce4f31c4b4096e97",
  measurementId: "G-J0ELYQ09WC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);