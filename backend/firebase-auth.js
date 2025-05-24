// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  SetDoc,
  docs,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
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
  measurementId: "G-270PZD4QCK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
  var messageDiv = document.getElementById("divId");
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = "1";
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}



const SignUp = document.getElementById("submit");
SignUp.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const Firstname = document.getElementById("username").value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created:", user);

      const userData = {
        email: email,
        Firstname: Firstname,
      };
      showMessage("Account created successfully", "signUpMessage");
      const docRef = docs(db, "users", user.uid);
      SetDoc(docRef, userData)
        .then(() => {
          window.location.href = "register.html";
          console.log("User data saved to Firestore");
        })
        .catch((error) => {
          console.error("Error saving user data:", error);
        });

  })
    .catch((error) => {

      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        showMessage("Email already in use", "signUpMessage");
      }
      else{
        showMessage("Unable to creating account: ", "signUpMessage");
      }
    });
});
