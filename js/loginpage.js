const firebaseConfig = {
    apiKey: "AIzaSyBRzL4hYESxYOmG6qBchI2hRGi4XI3rX-A",
    authDomain: "banking-jlk.firebaseapp.com",
    projectId: "banking-jlk",
    storageBucket: "banking-jlk.appspot.com",
    messagingSenderId: "843171081265",
    appId: "1:843171081265:web:508c3dc3ab8f91e5b87910",
    measurementId: "G-C0HD55FR3R"
};

$(document).ready(function() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    $(".login-form").hide();
    $(".signup-form").hide();
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
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            // The signed-in user info.
            var user = result.user;
            console.log(user, "sign in via google");
            // IdP data available in result.additionalUserInfo.profile.
            // ...
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
}); // Submit clicks below

// Login submit button
$('#loginSubmit').click(function (e) {
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
            if (user != null) {
                name = user.displayName;
                email = user.email;
                photoUrl = user.photoURL;
                emailVerified = user.emailVerified;
                console.log(name, email, emailVerified);
            }
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
});

// Signup submit button
$("#signupSubmit").click(function (e) {
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
            user.updateProfile({
                displayName: username
            })
            // ...
            console.log(username, " \are signed up");
        })
        .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error.code);
            console.log(errorMessage);
        });
});