// // Firebase Configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyAxu6E2MKhseDvorgCji5kbVCqCyrxAOGE",
//     authDomain: "jobconnect-project.firebaseapp.com",
//     projectId: "jobconnect-project",
//     storageBucket: "jobconnect-project.firebasestorage.app",
//     messagingSenderId: "121740588038",
//     appId: "1:121740588038:web:6d0b338f98d8d73933ff87",
//     measurementId: "G-CB02R8CMQB"
//   };
  
//   // Initialize Firebase with the modular API
// const app = firebase.initializeApp(firebaseConfig); // This initializes your app with Firebase v9+
// // Use the specific Firebase features you need
// const auth = firebase.auth();


// // Log to verify Firebase initialization
// console.log('Firebase App initialized:', app);
// console.log('Auth instance initialized:', auth);


//   // Handle Signup
//   document.getElementById('signup').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const email = document.getElementById('signup-email').value;
//     const password = document.getElementById('signup-password').value;
  
//     auth.createUserWithEmailAndPassword(email, password)  // Correct usage of firebase.auth()
//       .then((userCredential) => {
//         alert('Signup successful! Welcome, ' + email + '. Please log in to continue.');
//         console.log('User signed up:', userCredential.user);
//       })
//       .catch((error) => {
//         console.error('Error during signup:', error.message);
//         alert(error.message);
//       });
//   });
  
//   // Handle Login
//   document.getElementById('login').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const email = document.getElementById('login-email').value;
//     const password = document.getElementById('login-password').value;
  
//     auth.signInWithEmailAndPassword(email, password)  // Correct usage of firebase.auth()
//       .then((userCredential) => {
//         alert('Login successful!');
//         console.log('User logged in:', userCredential.user);
//         window.location.href = '/dashboard.html'; // Redirect to dashboard
//       })
//       .catch((error) => {
//         console.error('Error during login:', error.message);
//         alert(error.message);
//       });
//   });
  
//   // Check if the user is logged in
//   firebase.auth().onAuthStateChanged(user => {
//     if (!user) {
//       window.location.href = '/signup.html'; // Redirect to signup page if not logged in
//     }
//   });
  
//   // Logout functionality
//   document.getElementById('logout').addEventListener('click', async () => {
//     await firebase.auth().signOut();
//     console.log('Logged out');
//     window.location.href = '/signup.html'; // Redirect to login page
//   });
  

// Import Firebase modules from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Firebase initialized successfully:", app);

// Function: Sign Up a New User
export function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed up:", userCredential.user);
            alert("Signup successful!");
        })
        .catch((error) => {
            console.error("Error during signup:", error.message);
            alert(`Signup failed: ${error.message}`);
        });
}

// Function: Log In a User
export function logIn(email, password) {
    const errorDiv = document.getElementById('login-error'); // Define the error div
    errorDiv.textContent = '';
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User logged in:", userCredential.user);
            alert("Login successful!");
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(`Login failed: ${error.message}`);
            console.error('Error during login:', errorMessage);

            // Check the error code to display a user-friendly message
            if (error.code === 'auth/invalid-credential') {
                errorDiv.textContent = 'Incorrect username or password. Please try again.';
            } else {
                errorDiv.textContent = 'Login failed. Please try again.';
            }
            
            errorDiv.style.display = 'block'; // Show error message div
        });
}

// Function: Log Out the Current User
export function logOut() {
    return signOut(auth)
        .then(() => {
            console.log("User logged out");
            alert("Logged out successfully!");
            window.location.href = 'signup.html';
        })
        .catch((error) => {
            console.error("Error during logout:", error.message);
            alert(`Logout failed: ${error.message}`);
        });
}

// Function: Monitor User Authentication State
export function monitorAuthState(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:", user);
            callback(user);
        } else {
            console.log("No user is logged in");
            callback(null);
        }
    });
}
