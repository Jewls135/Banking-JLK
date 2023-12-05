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

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Save ticket information to Firestore
    db.collection('tickets').add({
      subject: subject,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    // Handle successful ticket submission
    .then(function(docRef) {
      console.log('Ticket submitted with ID: ', docRef.id);
    })
    // Handle any errors that occur during ticket submission
    .catch(function(error) {
      console.error('Error adding ticket: ', error);
    });
  });
});