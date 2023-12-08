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

        // Set the 'from' option to display the user's card number in the Transfer Form
        const fromOption = document.getElementById('fromOption');
        fromOption.textContent = `Debit Card ${user.uid.substr(0, 4)}`; // Display part of the user's ID

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
    option.textContent = `Debit Card ${cardNumber.substr(12, 16)}`; // Display part of the card number
    return option;
}

function handleTransfer() {
    const fromAccount = currentUser; // Assuming currentUser holds the sender's account number
    const toAccount = document.getElementById('tto').value;
    const amount = parseFloat(document.getElementById('tamount').value);

    fetchTransferData(fromAccount, toAccount, amount);
}

function fetchTransferData(fromAccount, toAccount, amount) {
    const promises = [
        db.collection('userData').doc(fromAccount).get(), // Sender's data
        db.collection('userData').doc(toAccount).get()    // Recipient's data
    ];

    Promise.all(promises)
        .then((snapshots) => {
            const senderData = snapshots[0].data();
            const recipientData = snapshots[1].data();

            // Check if sender has sufficient balance for the transfer
            if (senderData.balance >= amount) {
                // Deduct amount from sender and add to recipient
                senderData.balance -= amount;
                recipientData.balance += amount;

                // Update transaction history for sender and recipient
                const transactionDetailsSender = `Sent $${amount} to ${toAccount}`;
                const transactionDetailsRecipient = `Received $${amount} from ${fromAccount}`;
                senderData.transactionHistory.push(transactionDetailsSender);
                recipientData.transactionHistory.push(transactionDetailsRecipient);

                // Update Firestore documents for sender and recipient
                const updateSender = db.collection('userData').doc(fromAccount).update(senderData);
                const updateRecipient = db.collection('userData').doc(toAccount).update(recipientData);

                // Handle Firestore update success or failure
                Promise.all([updateSender, updateRecipient])
                    .then(() => {
                        console.log('Transfer successful');
                    })
                    .catch((error) => {
                        console.error('Error updating Firestore:', error);
                        // Handle Firestore update failure
                    });
            } else {
                console.log('Insufficient balance for transfer');
                // Handle insufficient balance error
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            // Handle errors here
        });
}

function handleDeposit() {
    const toAccount = currentUser;
    const amount = parseFloat(document.getElementById('damount').value);

    fetchDepositData(toAccount, amount);
}

function fetchDepositData(toAccount, amount) {
    db.collection('userData')
        .doc(toAccount)
        .get()
        .then((snapshot) => {
            const userData = snapshot.data();

            // Add deposit amount to recipient's balance
            userData.balance += amount;

            // Update transaction history for deposit
            const depositDetails = `Deposited $${amount} to ${toAccount}`;
            userData.transactionHistory.push(depositDetails);

            // Update Firestore document for recipient
            db.collection('userData')
                .doc(toAccount)
                .update(userData)
                .then(() => {
                    console.log('Deposit successful');
                    // Handle successful deposit
                })
                .catch((error) => {
                    console.error('Error updating Firestore:', error);
                    // Handle Firestore update failure
                });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            // Handle errors here
        });
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