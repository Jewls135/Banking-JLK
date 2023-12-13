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
            window.location.href = "homepage.html"
        }
        console.log("User is not logged in");
    });
});

async function generateCardNumber(userId) {
    try {
        const userCards = db.collection("userCard");
        const existingDoc = userCards.doc("existingCards");
        const userDoc = db.collection("userData").doc(userId);

        const ds = await existingDoc.get();
        let numbers = ds.data()['numbers'];

        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
            randomNumber = randomNumber.toString().substring(0, 16); // Making sure it's 16 digits
        } while (numbers.includes(randomNumber));

        numbers.push(randomNumber);
        await existingDoc.update({
            numbers: numbers
        });

        await userDoc.update({
            cardNumber: randomNumber
        });

        await userCards.doc(randomNumber).set({
            UserID: userId

        });
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
            const userCollection = db.collection('userData').doc(user.uid);

            // Check if the document exists
            userCollection.get().then((doc) => {
                if (doc.exists) {
                    console.log("User document already exists, redirecting");
                    window.location = "homepage.html";
                } else {
                    // Document doesn't exist, create a new one
                    userCollection.set({
                        username: user.email.split("@")[0],
                        email: user.email,
                        balance: 0,
                        transactionHistory: {},
                    }).then(() => {
                        console.log("User collection created");
                        generateUniqueCard(user.uid).then(() => { // Generating credit card
                            window.location = "homepage.html";
                        });
                        // Redirecting
                    }).catch((error) => {
                        console.error("Error creating user collection: ", error);
                    });
                }
            });
        }).catch((error) => {
            signingUp = false;
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error.code);
            console.log(errorMessage);
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
                username: user.email.split("@")[0],
                email: user.email,
                balance: 0,
                transactionHistory: {},
            }).then(() => {
                console.log("User collection created");
                generateUniqueCard(user.uid).then(() => { // Generating credit card
                    window.location = "homepage.html";
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
