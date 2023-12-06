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
    } else {
        // No user is signed in so we redirect them to the login page
        console.log("User is not logged in");
        window.location.href = "loginpage.html"
    }
});

// Get a reference to the transaction history div
const transactionHistoryDiv = document.getElementById('transactionHistory');

// Function to toggle the display of the transaction history table
function toggleTransactionHistory() {
    if (transactionHistoryDiv.style.display === 'none') {
        transactionHistoryDiv.style.display = 'block';
        // Here you might add code to populate the table when it becomes visible
    } else {
        transactionHistoryDiv.style.display = 'none';
    }
}

// Add an event listener to the button for toggling the transaction history
document.getElementById('history').addEventListener('click', toggleTransactionHistory);


// Access Firestore to retrieve transaction data
db.collection("transactions")
  .where("userEmail", "==", currentemail) // Filter transactions by user email
  .get()
  .then((querySnapshot) => {
    // Process each transaction document
    querySnapshot.forEach((doc) => {
      // Access transaction details
      const data = doc.data();
      const transactionType = data.type; // Type of transaction (deposit, transfer, payment)
      const amount = data.amount; // Amount of money involved

      // Determine if it's a deposit or not and prepare amount
      const displayAmount = transactionType === "deposit" ? amount : -amount;

      // Populate table with transaction details
      const table = document.getElementById("transactionTable");
      const row = table.insertRow(-1); // Insert row at the end of the table

      // Create cells for each transaction detail
      const cellType = row.insertCell(0);
      const cellAmount = row.insertCell(1);

      // Assign values to the cells
      cellType.innerHTML = transactionType;
      cellAmount.innerHTML = displayAmount;
    });
  })
  .catch((error) => {
    console.log("Error getting documents: ", error);
  });
