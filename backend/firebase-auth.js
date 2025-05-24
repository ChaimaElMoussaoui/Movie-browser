
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
  import { getFirestore, SetDoc, docs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBEzeSYFcKDlZr_1Nmy6wEtx28FsNPaw2A",
    authDomain: "movie-browser-4a574.firebaseapp.com",
    projectId: "movie-browser-4a574",
    storageBucket: "movie-browser-4a574.firebasestorage.app",
    messagingSenderId: "1082106301666",
    appId: "1:1082106301666:web:32ba29920923ac662d62bb",
    measurementId: "G-270PZD4QCK"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

const SignUp =document.getElementById("");