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
                if (cardNumber !== user.uid) { // Exclude the user's own card number
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
        const cardDoc = await userCards.doc(toCardNumber).get();

        let userId = cardDoc.data()['UserId'];
        toAccount = await firebase.auth().getUser(userId);

    } catch (error) {
        console.log("Error fetching other account", error);
    }
    const amount = parseFloat(document.getElementById('tamount').value);

    fetchTransferData(fromAccount, toAccount, amount);
}

async function fetchTransferData(fromAccount, toAccount, amount) {
    let accounts = [fromAccount, toAccount];
    var currentDate = new Date();

    // Getting the current year, month, and day
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();

    // Formatting the date as a string
    var formattedDate = year + '-' + month + '-' + day;

    for (let i = 0; i < accounts.length; i++) {
        let currentAccount = accounts[i];
        if (i % 2 == 0) {
            amount = -amount;
        }

        try {
            const userData = db.collection("userData");
            const userDoc = await userData.doc(currentAccount.uid).get();

            // Updating balance
            let balance2 = userDoc.data()['balance'];
            balance2 += amount;

            // Updating transaction hisory
            let transHistory = userDoc.data()['transactionHistory'];
            transHistory.set(formattedDate, amount);

            userDoc.update({ // Updating users current balance
                balance: balance2,
                transactionHistory: transHistory
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

        // Getting the current year, month, and day
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth() + 1;
        var day = currentDate.getDate();

        // Formatting the date as a string
        var formattedDate = year + '-' + month + '-' + day;

        const userData = db.collection("userData");
        const userDoc = await userData.get(toAccount.uid);

        // Updating balance
        let balance2 = userDoc.data()['balance'];
        balance2 += amount;

        // Updating transaction hisory
        let transHistory = userDoc.data()['transactionHistory'];
        transHistory.set(formattedDate, amount)

        userDoc.update({ // Updating users current balance
            balance: balance2,
            transactionHistory: transHistory
        });

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