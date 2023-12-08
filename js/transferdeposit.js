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
let currentUser = "";
let currentEmail = "";

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in
        currentUser = user;
        // Set the 'from' option to display the user's card number in the Transfer Form
        const fromOption = document.getElementById('fromOption');
        fromOption.textContent = `Debit Card ${user.uid}`; // Display part of the user's ID

        // Get all card numbers except the user's card number and populate the 'to' options in the Transfer Form
        const ttoSelect = document.getElementById('tto');
        db.collection('userCard').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const cardNumber = doc.id;

                if (cardNumber != "existingCards" && cardNumber !== user.uid) { // Exclude the user's own card number
                    const option = createOptionElement(cardNumber);
                    ttoSelect.appendChild(option);
                }
            });
        }).catch((error) => {
            console.error('Error fetching card numbers:', error);
        });
    } else {
        // No user is signed in, redirect to login page
        console.log("User is not logged in");
        window.location.href = "loginpage.html"
    }
});

function createOptionElement(cardNumber) {
    const option = document.createElement('option');
    option.value = cardNumber;
    option.textContent = `Debit Card ${cardNumber}`; // Display part of the card number
    return option;
}

async function handleTransfer() {
    const fromAccount = currentUser; // Assuming currentUser holds the sender's account number
    const toCardNumber = document.getElementById('tto').value;
    let toAccount;
    try {
        // Getting collection and user from card number
        const userCards = db.collection("userCard");
        const cardDocs = userCards.doc(toCardNumber);
        const cardDoc = await cardDocs.get();

        let userId = cardDoc.data()['UserId'];
        toAccount = await firebase.auth().getUser(userId);

    } catch (error) {
        console.log("Error fetching other account", error);
    }
    const amount = parseFloat(document.getElementById('tamount').value);

    fetchTransferData(fromAccount, toAccount, amount);
}

async function fetchTransferData(fromAccount, toAccount, amount) {
    var currentDate = new Date();

    // Getting the current year, month, and day
    /*var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();

    // Formatting the date as a string
    var formattedDate = year + '-' + month + '-' + day;*/

    for (let i = 0; i < 2; i++) {
        let currentAccount = toAccount;
        if (i % 2 == 0) {
            currentAccount = fromAccount;
            amount = -amount;
        }

        try {
            const userData = db.collection("userData");
            const userDocs = userData.doc(currentAccount.uid);
            const userDoc = await userDocs.get();

            // Updating balance
            let balance2 = userDoc.data()['balance'];
            balance2 += amount;

            // Updating transaction history
            const transHistory = userDoc.data()['transactionHistory'] || {};
            const newTransHistory = {...transHistory, [currentDate]: amount};

            await userDoc.ref.update({
                balance: balance2,
                transactionHistory: newTransHistory,
            });

        } catch (error) {
            console.error("Error depositing:", error);
        }
    }
}

function handleDeposit() {
    const toAccount = currentUser;
    const amount = parseFloat(document.getElementById('damount').value);
    fetchDepositData(toAccount, amount);
}

async function fetchDepositData(toAccount, amount) {

    try {
        var currentDate = new Date();

        /*// Getting the current year, month, and day
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth() + 1;
        var day = currentDate.getDate();

        // Formatting the date as a string
        var formattedDate = year + '-' + month + '-' + day;*/
        
        const userData = db.collection("userData");
        const document = userData.doc(toAccount.uid);
        const userDoc = await document.get();
        if (userDoc.exists) {          
            // Updating balance
            let balance2 = userDoc.data().balance + amount;

            // Updating transaction history
            const transHistory = userDoc.data()['transactionHistory'] || {};
            const newTransHistory = {...transHistory, [currentDate]: amount};

            await userDoc.ref.update({
                balance: balance2,
                transactionHistory: newTransHistory,
            });

            console.log("Deposit successful");
        } else {
            console.error("Document does not exist for UID:", toAccount.uid);
        }
    } catch (error) {
        console.error("Error depositing:", error);
    }

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