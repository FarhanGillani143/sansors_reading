// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrIARxRmAXklQhkW_qHo6sjgwS5PRL96w",
  authDomain: "auth-for-sansor-reading-app.firebaseapp.com",
  projectId: "auth-for-sansor-reading-app",
  storageBucket: "auth-for-sansor-reading-app.firebasestorage.app",
  messagingSenderId: "788394584988",
  appId: "1:788394584988:web:81099d4b0f4d89fe963659"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export {app}