// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxu6E2MKhseDvorgCji5kbVCqCyrxAOGE",
    authDomain: "jobconnect-project.firebaseapp.com",
    projectId: "jobconnect-project",
    storageBucket: "jobconnect-project.firebasestorage.app",
    messagingSenderId: "121740588038",
    appId: "1:121740588038:web:6d0b338f98d8d73933ff87",
    measurementId: "G-CB02R8CMQB"
  };
  
  // Initialize Firebase with the modular API
const app = firebase.initializeApp(firebaseConfig); // This initializes your app with Firebase v9+
// Use the specific Firebase features you need
const auth = firebase.auth();

  
  // Handle Signup
  document.getElementById('signup').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
  
    auth.createUserWithEmailAndPassword(email, password)  // Correct usage of firebase.auth()
      .then((userCredential) => {
        alert('Signup successful!');
        console.log('User signed up:', userCredential.user);
      })
      .catch((error) => {
        console.error('Error during signup:', error.message);
        alert(error.message);
      });
  });
  
  // Handle Login
  document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    auth.signInWithEmailAndPassword(email, password)  // Correct usage of firebase.auth()
      .then((userCredential) => {
        alert('Login successful!');
        console.log('User logged in:', userCredential.user);
        window.location.href = '/dashboard.html'; // Redirect to dashboard
      })
      .catch((error) => {
        console.error('Error during login:', error.message);
        alert(error.message);
      });
  });
  
  // Check if the user is logged in
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      window.location.href = '/signup.html'; // Redirect to signup page if not logged in
    }
  });
  
  // Logout functionality
  document.getElementById('logout').addEventListener('click', async () => {
    await firebase.auth().signOut();
    console.log('Logged out');
    window.location.href = '/signup.html'; // Redirect to login page
  });
  