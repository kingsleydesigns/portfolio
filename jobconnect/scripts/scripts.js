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

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page refresh
    // Hide the form
    this.style.display = 'none';
    // Show the thank-you message
    document.getElementById('thankYouMessage').style.display = 'block';
});


// Toggle between Sign Up and Login forms
function toggleForm() {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
  
    if (signupForm.style.display === "none") {
      signupForm.style.display = "block";
      loginForm.style.display = "none";
    } else {
      signupForm.style.display = "none";
      loginForm.style.display = "block";
    }
  }
  
  // Handle Signup
  document.getElementById('signup').addEventListener('submit', function(event) {
    event.preventDefault();
    // Here, you can handle signup functionality (send data to backend, etc.)
    alert('Signup successful!');
    // Redirect or show further options after successful signup.
  });
  
  // Handle Login
  document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault();
    // Here, you can handle login functionality (authenticate user)
    alert('Login successful!');
    // Redirect or show the dashboard after successful login.
  });
  