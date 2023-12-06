/*Login page Javascript*/
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

$(document).ready(function () {
    $(".login-form").hide();
    $(".signup-form").hide();

    /*firebase.auth().onAuthStateChanged(function (user) {
        if (user) {  // If user is logged in, redirect to homepage
            // User is signed in
            currentuser = user;
            currentemail = user.email;
            console.log("User is logged in");
            window.location.href = "accountpage.html"
        } // Else nothing happens
        console.log("User is not logged in");
    });*/
});

// Click events below
$("#login-button").click(function () {
    $(".button-container").hide();
    $(".login-form").show();
});

$("#signup-button").click(function () {
    $(".button-container").hide();
    $(".signup-form").show();
});

// Google Sign in
$('#google-button').click(function () {
    window.alert("google button clicked!")
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            // Signed in
            let user = result.user;
            user.updateProfile({
                displayName: username
            }).then(() => {
                // Check if the user's data collection exists, if not, create it
                const userCollection = db.collection('userData').doc(user.uid);
                // User's collection does not exist, create it
                userCollection.set({
                    username: user.displayName,
                    email: user.email,
                    balance: "0",
                    transactionHistory: { transaction0: "amount" },

                }).then(() => {
                    console.log("User collection created");
                }).catch((error) => {
                    console.error("Error creating user collection: ", error);
                });

            });
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
        });
});

// Login submit button
$('#loginSubmit').click(function (e) {
    window.alert("login button clicked!")
    e.preventDefault();
    // Getting email/password from the inputs
    var email = $('#loginEmail').val();
    var password = $('#loginPassword').val();

    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((success) => {
            // Signed in
            console.log('login in');
            let user = firebase.auth().currentUser;
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
});

// Signup submit button
$("#signupSubmit").click(function (e) {
    window.alert("signup button clicked!")
    e.preventDefault();
    // Getting email/password from the inputs
    var email = $('#signupEmail').val();
    var password = $('#signupPassword').val();

    // create a user with email address and password
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
            // Signed in
            let user = result.user;
            window.alert("HERE!")
            // Check if the user's data collection exists, if not, create it
            const userCollection = db.collection('userData').doc(user.uid);
            // User's collection does not exist, create it
            userCollection.set({
                username: user.displayName,
                email: user.email,
                balance: "0",
                transactionHistory: { transaction0: "amount" },
            }).then(() => {
                console.log("User collection created");
                window.alert(userCollection)
                console.log(userCollection)
            }).catch((error) => {
                console.error("Error creating user collection: ", error);
                window.alert(userCollection)
            });


        })
        .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error.code);
            console.log(errorMessage);
        });
});
