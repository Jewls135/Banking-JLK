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

        // Check if the user's data collection exists, if not, create it
        const userCollection = db.collection('userData').doc(user.uid);

        userCollection.get().then((doc) => {
            if (!doc.exists) {
                // User's collection does not exist, create it
                userCollection.set({
                    // Add initial data here
                }).then(() => {
                    console.log("User collection created");
                }).catch((error) => {
                    console.error("Error creating user collection: ", error);
                });
            }
        }).catch((error) => {
            console.error("Error checking user collection: ", error);
        });
    } else {
        // No user is signed in so we redirect them to the login page
        console.log("User is not logged in");
        window.location.href = "loginpage.html"
    }
});

// Function to handle transfer
function handleTransfer() {
    const fromAccount = document.getElementById('from').value;
    const toAccount = document.getElementById('tto').value;
    const amount = parseFloat(document.getElementById('tamount').value);

    // Perform transfer operations

    console.log(`Transferring ${amount} from ${fromAccount} to ${toAccount}`);
}

// Function to handle deposit
function handleDeposit() {
    const toAccount = document.getElementById('dto').value;
    const amount = parseFloat(document.getElementById('damount').value);

    // Perform deposit operations

    console.log(`Depositing ${amount} to ${toAccount}`);
}

// Add event listeners to the submit buttons
document.getElementById('tsubmit').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission
    handleTransfer(); // Call the function to handle transfer
});

document.getElementById('dsubmit').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission
    handleDeposit(); // Call the function to handle deposit
});