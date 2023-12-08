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

    const userCardRef = db.collection('userCard').doc(currentUser.uid);

    userCardRef.get().then((cardDoc) => {
      if (cardDoc.exists) {
        const userId = cardDoc.id; // Using document ID as UserID

        if (userId) {
          // Continue with the rest of your code to retrieve and display the card number
          const cardNumber = cardDoc.id; // Get the card number from the document ID
          document.getElementById('cardNumber').value = cardNumber;
        } else {
          console.log('No UserID found in userCard for this user!');
        }
      } else {
        console.log('No card document found for this user!');
      }
    }).catch((cardError) => {
      handleError(cardError);
    });

    const userDataRef = db.collection('userData').doc(currentUser.uid);

    userDataRef.get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();

        const transactionHistory = userData.transactionHistory || []; // Ensure it's an array
        const currentBalance = userData.balance || 0;

        document.getElementById('balance').value = currentBalance; // Display the current balance

        const table = document.getElementById('transactionTable');

        // Loop through transactionHistory map and populate the table
        for (const [key, value] of Object.entries(transactionHistory)) {
          const row = table.insertRow(-1);
          const cellDate = row.insertCell(0);
          const cellType = row.insertCell(1);
          const cellAmount = row.insertCell(2);

          // Accessing field (date), type, and value fields from each transaction object
          cellDate.innerHTML = key || 'Unknown Date'; // Display the date
          cellType.innerHTML = value >= 0 ? 'Deposit' : 'Withdrawal'; // Display the type
          cellAmount.innerHTML = Math.abs(value) || 'N/A'; // Display the absolute value as the amount
        }

      } else {
        console.log('No such document!');
      }
    }).catch((error) => {
      handleError(error);
    });

  } else {
    console.log("User is not logged in");
    window.location.href = "loginpage.html";
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