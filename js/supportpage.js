/* Supportpage Javascript */
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRzL4hYESxYOmG6qBchI2hRGi4XI3rX-A",
  authDomain: "banking-jlk.firebaseapp.com",
  projectId: "banking-jlk",
  storageBucket: "banking-jlk.appspot.com",
  messagingSenderId: "843171081265",
  appId: "1:843171081265:web:508c3dc3ab8f91e5b87910",
  measurementId: "G-C0HD55FR3R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var currentuser = "";
var currentemail = "";

firebase.auth().onAuthStateChanged(function (user) { // Checking if user is logged in
  if (user) {
    // User is signed in
    currentuser = user;
    currentemail = user.email;
  } else {
    // No user is signed in so we redirect them to the login page
    console.log("User is not logged in");
    window.location.href = "loginpage.html"
  }
});

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Save ticket information to Firestore
    db.collection('tickets').add({
      UserID: currentuser.uid,
      subject: subject,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
      // Handle successful ticket submission
      .then(function (docRef) {
        console.log('Ticket submitted with ID: ', docRef.id);
      })
      // Handle any errors that occur during ticket submission
      .catch(function (error) {
        console.error('Error adding ticket: ', error);
      });
  });
});

$('.sign-out').click(function () {
  console.log("Sign out clicked!");
  firebase.auth().signOut().then(function () {

    console.log('Signed Out');

  }).catch((error) => {
    console.error('Sign Out Error', error);
  });
});