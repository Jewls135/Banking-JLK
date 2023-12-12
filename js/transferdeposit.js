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
      
        // Get all card numbers except the user's card number and populate the 'to' options in the Transfer Form
        const ttoSelect = document.getElementById('tto');
        db.collection('userCard').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const cardNumber = doc.id;
                
                if (cardNumber != "existingCards" && doc.data().UserID != user.uid) { // Exclude the user's own card number
                    const option = createOptionElement(cardNumber);
                    ttoSelect.appendChild(option);
                } else if(doc.data().UserID == user.uid){
                    fromOption.textContent = `Debit Card ${cardNumber}`; // Display part of the user's ID
                } 
            });
        }).catch((error) => {
            console.error('Error fetching card numbers:', error);
        });
    } else {
        // No user is signed in, redirect to login page
        console.log("User is not logged in");
        //window.location.href = "loginpage.html"
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

        toAccount = cardDoc.data()['UserID'];
        console.log(toAccount)
    } catch (error) {
        console.log("Error fetching other account", error);
    }
    const amount = parseFloat(document.getElementById('tamount').value);
    if(!amount || amount <= 0){
        window.alert("Can not transfer or deposit 0 or negative dollars.");
        return;
    }
    fetchTransferData(fromAccount, toAccount, amount);
}

async function fetchTransferData(fromAccount, toAccount, amount) {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    var day = currentDate.getDate().toString().padStart(2, '0');


    var formattedDate = year + '-' + month + '-' + day;

    var hours = currentDate.getHours().toString().padStart(2, '0');
    var minutes = currentDate.getMinutes().toString().padStart(2, '0');
    var seconds = currentDate.getSeconds().toString().padStart(2, '0');

    // Appendending time to the formatted date
    formattedDate += ' ' + hours + ':' + minutes + ':' + seconds;

    for (let i = 0; i < 2; i++) {
        let userid = toAccount;
        if (i % 2 == 0) {
            userid = fromAccount.uid;
            amount = -amount;
        }

        try {
            const userData = db.collection("userData");
            const userDocs = userData.doc(userid);
            const userDoc = await userDocs.get();

            // Updating balance
            let balance2 = userDoc.data()['balance'];
            balance2 += amount;

            // Updating transaction history
            const transHistory = userDoc.data()['transactionHistory'] || {};
            const newTransHistory = { ...transHistory, [formattedDate]: amount };

            await userDoc.ref.update({
                balance: balance2,
                transactionHistory: newTransHistory,
            });

            $('#transferFormObj')[0].reset();

        } catch (error) {
            window.alert("Error transfering: ", error)
            console.error("Error transfering: ", error);
        }
    }
}

function handleDeposit() {
    const toAccount = currentUser;
    const amount = parseFloat(document.getElementById('damount').value);
    if(!amount || amount <= 0){
        window.alert("Can not transfer or deposit 0 or negative dollars.");
        return;
    }
    fetchDepositData(toAccount, amount);
}

async function fetchDepositData(toAccount, amount) {

    try {
        var currentDate = new Date();
        var year = currentDate.getFullYear();
        var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        var day = currentDate.getDate().toString().padStart(2, '0');


        var formattedDate = year + '-' + month + '-' + day;

        var hours = currentDate.getHours().toString().padStart(2, '0');
        var minutes = currentDate.getMinutes().toString().padStart(2, '0');
        var seconds = currentDate.getSeconds().toString().padStart(2, '0');

        // Appendending time to the formatted date
        formattedDate += ' ' + hours + ':' + minutes + ':' + seconds;

        const userData = db.collection("userData");
        const document = userData.doc(toAccount.uid);
        const userDoc = await document.get();

        let balance2 = userDoc.data().balance + amount;

        // Updating transaction history
        const transHistory = userDoc.data()['transactionHistory'] || {};
        const newTransHistory = { ...transHistory, [formattedDate]: amount };

        await userDoc.ref.update({
            balance: balance2,
            transactionHistory: newTransHistory,
        });

        console.log("Deposit successful");
        window.alert("Sucessfully deposited, $" + amount);
        $('#depositFormObj')[0].reset();
    } catch (error) {
        window.alert("Error depositing:", error);
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