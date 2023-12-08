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
let currentUser = null;

// Function to handle errors
function handleError(error) {
  console.error('Error:', error);
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    currentUser = user;
    const userDataRef = db.collection('userData').doc(currentUser.uid);

    userDataRef.get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const userID = userData.userID;
    
        // Get userCard document corresponding to the userID
        const userCardRef = db.collection('userCard').doc(userID);
    
        userCardRef.get().then((cardDoc) => {
          if (cardDoc.exists) {
            const cardNumber = cardDoc.id; // Get the card number from the document ID
            document.getElementById('cardNumber').value = cardNumber;
          } else {
            console.log('No card document found for this user!');
          }
        }).catch((cardError) => {
          handleError(cardError); // Error handling for getting card data
        });

        if (!Array.isArray(transactionHistory)) {
          transactionHistory = [transactionHistory];
        }

        const currentBalance = userData.balance || 0;
        document.getElementById('balance').value = currentBalance;

        const table = document.getElementById('transactionTable');
        table.innerHTML = '<tr><th>Type</th><th>Amount</th></tr>';

        transactionHistory.forEach((transaction) => {
          const row = table.insertRow(-1);
          const cellType = row.insertCell(0);
          const cellAmount = row.insertCell(1);
        
          if (typeof transaction === 'string') {
            const details = transaction.split(':');
            if (details.length === 2) {
              cellType.innerHTML = details[0];
              cellAmount.innerHTML = details[1];
            } else {
              console.log('Invalid transaction format:', transaction);
              cellType.innerHTML = 'Unknown';
              cellAmount.innerHTML = 'N/A';
            }
          } else if (typeof transaction === 'object' && transaction.type === 'initialDeposit') {
            cellType.innerHTML = 'Initial Deposit';
            cellAmount.innerHTML = transaction.amount || 'N/A'; // Display amount or 'N/A'
          } else {
            console.log('Invalid transaction:', transaction);
            cellType.innerHTML = 'Unknown';
            cellAmount.innerHTML = 'N/A';
          }
        });
      } else {
        console.log('No such document!');
      }
    }).catch((error) => {
      handleError(error); // Error handling for getting user data
    });
  } else {
    console.log("User is not logged in");
    window.location.href = "loginpage.html"
  }
});

// Define toggleForm function with null check
function toggleForm(formId) {
  var form = document.getElementById(formId);
  if (form !== null && form.style !== null) {
    if (form.style.display === "none") {
      form.style.display = "block";
    } else {
      form.style.display = "none";
    }
  }
}


// Event listener for transaction history button
document.getElementById('history').addEventListener('click', function () {
  const transactionHistoryDiv = document.getElementById('transactionHistory');
  if (transactionHistoryDiv.style.display === 'none') {
    transactionHistoryDiv.style.display = 'block';
  } else {
    transactionHistoryDiv.style.display = 'none';
  }
});