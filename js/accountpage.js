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

        const transactionHistory = userData.transactionHistory || []; // Ensure it's an array
        const currentBalance = userData.balance;
        const cardNumber = userData.cardNumber;

        document.getElementById('cardNumber').value = cardNumber; // Display the current balance
        document.getElementById('balance').value = currentBalance; // Display the current balance

        const table = document.getElementById('transactionTable');

        // Convert transactionHistory map to an array of objects
        const transactionArray = Object.entries(transactionHistory).map(([date, amount]) => ({ date, amount }));

        // Sort the array by date
        transactionArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        let index = 0;

        // Loop through the sorted array and populate the table
        for (const transaction of transactionArray) {
          const row = table.insertRow(-1);
          const cellDate = row.insertCell(0);
          const cellAmount = row.insertCell(1);

          // Accessing field (date), type, and value fields from each transaction object
          cellDate.innerHTML = transaction.date || 'Unknown Date'; // Display the date

          // Display the absolute value as the amount
          const absoluteAmount = Math.abs(transaction.amount);

          // Determine the sign of the transaction amount and add the appropriate class and sign
          if (transaction.amount > 0) {
            cellAmount.innerHTML = '+ ' + absoluteAmount;
            cellAmount.classList.add('positive');
          } else if (transaction.amount < 0) {
            cellAmount.innerHTML = '- ' + absoluteAmount;
            cellAmount.classList.add('negative');
          } else {
            cellAmount.innerHTML = 'N/A';
          }

          index++;
          if (index == 5) {
            break;
          }
        }

      } else {
        console.log('No such document!');
      }
    }).catch((error) => {
      handleError(error);
    });



  } else {
    console.log("User is not logged in");
    //window.location.href = "loginpage.html";
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

$('.sign-out').click(function () {
  console.log("Sign out clicked!");
  firebase.auth().signOut().then(function () {

    console.log('Signed Out');

  }).catch((error) => {
    console.error('Sign Out Error', error);
  });
});