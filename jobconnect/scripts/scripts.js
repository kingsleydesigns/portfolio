const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');
const accordionHeaders = document.querySelectorAll('.accordion-header');

hamButton.addEventListener('click', () => {
	navigation.classList.toggle('open');
	hamButton.classList.toggle('open');
});


// Select all sections to observe
const sections = document.querySelectorAll('.animate');

// Create an Intersection Observer instance
const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add the 'visible' class when in view
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    },
    { threshold: 0.1 } // Trigger when 20% of the element is in view
);

// Observe each section
sections.forEach(section => {
    observer.observe(section);
});

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

// Toggle between Sign Up and Login forms
// Toggle between Sign Up and Login forms
// Toggle between Sign Up and Login forms
function toggleForm() {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  const successPopup = document.getElementById('success-popup');
  
  // Hide both forms and show the appropriate one
  if (signupForm.style.display === 'none') {
    // Show the signup form
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
  } else {
    // Show the login form
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  }

  // Hide the success popup when toggling the forms
  successPopup.style.display = 'none';
  
}

// This function hides the signup form and shows the login form
function showLoginForm() {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const successPopup = document.getElementById('success-popup');

  // Hide the signup form and the success popup
  signupForm.style.display = 'none';
  successPopup.style.display = 'none';

  // Show the login form
  loginForm.style.display = 'block';
  
  // Clear the signup form fields
  document.getElementById('signup-email').value = '';
  document.getElementById('signup-password').value = '';
}

// Event listener for the "Go to Login" link
document.getElementById('go-to-login').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default link behavior
  showLoginForm(); // Switch to login form and clear signup details
});


// Attach it to the global scope
window.toggleForm = toggleForm;

import { signUp, logIn, logOut, monitorAuthState } from './firebase.js';

// Handle Signup
document.getElementById('signup').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const fullName = document.getElementById('signup-name').value;
    signUp(email, password, fullName);
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('success-popup').style.display = 'block';
});


export function getFullName() {
  const input = document.getElementById('signup-name');
  return input ? input.value : null;
}


// Handle Login
document.getElementById('login').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    logIn(email, password);
});

// // Handle Logout
// document.getElementById('logout').addEventListener('click', () => {
//     logOut();
// });


// Redirect logged-in users away from signup
monitorAuthState(
  (user) => {
      console.log("User is logged in. Redirecting to dashboard...");
      // window.location.href = "dashboard.html"; // Redirect to dashboard
  },
  () => {
      console.log("User is not logged in. Staying on signup page.");
  }
);