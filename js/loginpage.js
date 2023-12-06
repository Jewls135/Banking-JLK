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

let signingUp = false;

$(document).ready(function () {
    $(".login-form").hide();
    $(".signup-form").hide();

    firebase.auth().onAuthStateChanged(function (user) {
        if (signingUp) { // If user is signing up we don't want to redirect them here since it will prevent the rest of the code from running
            return
        }

        if (user) {  // If user is logged in, redirect to homepage
            // User is signed in
            currentuser = user;
            currentemail = user.email;
            console.log("User is logged in");
            window.location.href = "accountpage.html"
        }
        console.log("User is not logged in");
    });
});

async function generateCardNumber(userId) {
    const userCards = db.collection('userCards');
    const existingDoc = await userCards.doc('existingCards').get();

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
        randomNumber = randomNumber.toString().substring(0, 16); // Making sure it's 16 digits
        console.log(existingDoc.data().numbers);
    } while (existingDoc.data().numbers.includes(randomNumber)); // Check if 'numbers' is defined

    try {
        const existingNumbers = existingDoc.data().numbers || [];

        await userCards.doc('existingCards').update({
            numbers: [...existingNumbers, randomNumber]
        });

        await userCards.doc(userId).set({
            cardNumber: randomNumber
        });

        console.log("Card number generated and doc was created");
        return true;
    } catch (error) {
        console.error("Error generating card number:", error);
        return false;
    }
}

async function generateUniqueCard(userId) { // Function used to generate a card number for the given user until its completely successfully
    let success = false;
    while (!success) { // While not a success keep trying
        success = await generateCardNumber(userId);
    }
}

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
    signingUp = true;
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            // Signed in
            let user = result.user;
            // Creating document under userData collection for specific user based on userId
            const userCollection = db.collection('userData').doc(user.uid);
            userCollection.set({
                username: user.email,
                email: user.email,
                balance: "0",
                transactionHistory: { initialDeposit: "100" },
            }).then(() => {
                console.log("User collection created");
                generateUniqueCard(user.uid).then(() => { // Generating credit card
                    window.location = "accountpage.html";
                });
                // Redirecting
            }).catch((error) => {
                console.error("Error creating user collection: ", error);
            });
        }).catch((error) => {
            signingUp = false;
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
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
});

// Signup submit button
$("#signupSubmit").click(function (e) {
    signingUp = true;
    e.preventDefault();
    // Getting email/password from the inputs
    var email = $('#signupEmail').val();
    var password = $('#signupPassword').val();

    // Create a user with email address and password
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
            // Signed in
            let user = result.user;
            // Creating document under userData collection for specific user based on userId
            const userCollection = db.collection('userData').doc(user.uid);
            userCollection.set({
                username: user.email,
                email: user.email,
                balance: "0",
                transactionHistory: { initialDeposit: "100" },
            }).then(() => {
                console.log("User collection created");
                generateUniqueCard(user.uid).then(() => { // Generating credit card
                    window.location = "accountpage.html";
                });
            }).catch((error) => {
                console.error("Error creating user collection: ", error);
            });
        })
        .catch(error => {
            signingUp = false;
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error.code);
            console.log(errorMessage);
        });
});
