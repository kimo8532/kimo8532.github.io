const firebaseConfig = {
  apiKey: "AIzaSyCLNtQVBYvBn9CFn2a73RfKrkXMWrSKHz4",
  authDomain: "vozni-park-90f1b.firebaseapp.com",
  databaseURL: "https://vozni-park-90f1b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vozni-park-90f1b",
  storageBucket: "vozni-park-90f1b.appspot.com",
  messagingSenderId: "501586259470",
  appId: "1:501586259470:web:2bbe652c94107459f9965f"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var baza = firebase.database();
  var auth = firebase.auth();
  var storage = firebase.storage();
  var oDbcarFill = baza.ref('carFill');
  var oDballCarsInStock = baza.ref('allCarsInStock');
  var oDbrented = baza.ref('rented');
