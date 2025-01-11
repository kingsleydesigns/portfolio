// Import Firebase modules from the CDN

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

import { getFirestore,
        collection,
        addDoc,
        updateDoc,
        serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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
 export const auth = getAuth(app);
 const db = getFirestore(app);

//  console.log(db)

// console.log("Firebase initialized successfully:", app);

// Function: Sign Up a New User
export function signUp(email, password, fullName) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            updateProfile(auth.currentUser, { displayName: fullName });
            console.log("User signed up:", userCredential.user, fullName);
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
            window.location.href = "dashboard.html";
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
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error during logout:", error.message);
            alert(`Logout failed: ${error.message}`);
        });
}

// Function: Monitor User Authentication State
export function monitorAuthState(onAuthenticated, onUnauthenticated) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:",);
            if (onAuthenticated) {
                onAuthenticated(user);
            }
        } else {
            console.log("No user is logged in.");
            if (onUnauthenticated) {
                onUnauthenticated();
            }
        }
    });
}

//Add document to the request collection
export async function addPostToDB(postBody, user) {
    try {
        const docRef = await addDoc(collection(db, "requests"), {
            body: postBody,
            uid: user.uid,
            createdAt: serverTimestamp()
        })
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
    console.error(error.message);
    }
}

