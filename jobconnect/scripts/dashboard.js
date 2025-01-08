import { auth, signUp, logIn, logOut, monitorAuthState } from './firebase.js';

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.add('hidden'));

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }
}
window.showTab = showTab;


function logout() {
    logOut();
}
window.logout = logout;


function editProfile() {
    alert('Profile editing is not yet implemented.');
}
window.editProfile = editProfile;



monitorAuthState(
    (user) => {
        console.log("User is authenticated:", user.email);
        personalizeWelcome();
        // Optionally, load personalized data here
    },
    () => {
        console.log("User is not authenticated. Redirecting...");
        window.location.href = "signup.html"; // Redirect if not logged in
    }
);


function personalizeWelcome() {
    const user = auth.currentUser;
    const fullName = user.displayName;
    const welcomeMessage = document.getElementById('welcome-message');

    if (fullName) {
        welcomeMessage.textContent = `Welcome, ${fullName}!`;
    } else {
        welcomeMessage.textContent = `Welcome to your dashboard!`;
    }
}


