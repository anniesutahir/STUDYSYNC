import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_nuciFlb84ffOU-zP6qQe5WlBsn6d8xc",
  authDomain: "studysync-96c64.firebaseapp.com",
  projectId: "studysync-96c64",
  storageBucket: "studysync-96c64.appspot.com",
  messagingSenderId: "852458680781",
  appId: "1:852458680781:web:d198f1846c12df27365484"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const db = firebase.firestore();
// FIX: Export the firebase object to be used in other components.
export { firebase };
