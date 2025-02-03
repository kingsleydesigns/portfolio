import { auth, signUp, logIn, logOut, monitorAuthState, addPostToDB } from './firebase.js';


const textarea = document.getElementById("company-name");
const requestButton = document.getElementById("submit-request");


requestButton.addEventListener("click", requestButtonPressed);


function showTab(tabId) {
    const hamburger = document.querySelector('.hamburger i');
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.add('hidden'));

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }

    // Hide the sidebar after a menu option is clicked
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('visible');
    hamburger.classList = 'fas fa-bars';

    // Highlight the selected menu option
    const menuItems = document.querySelectorAll('.sidebar a');
    menuItems.forEach(item => item.classList.remove('active')); // Remove 'active' from all items

    const activeItem = document.querySelector(`.sidebar a[href="#"][onclick*="${tabId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}
window.showTab = showTab;


function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger i');

    sidebar.classList.toggle('visible');

    // Toggle the hamburger icon between bars and X
    if (hamburger.classList.contains('fa-bars')) {
        hamburger.classList.remove('fa-bars');
        hamburger.classList.add('fa-times');
    } else {
        hamburger.classList.remove('fa-times');
        hamburger.classList.add('fa-bars');
    }
}
window.toggleSidebar = toggleSidebar;


function logout() {
    logOut();
}
window.logout = logout;


function editProfile() {
    alert('Profile editing is not yet implemented.');
}
window.editProfile = editProfile;

function clearInputField(field) {
	field.value = ""
}
window.clearInputField = clearInputField;


function updatePageTitle(title) {
    const pageTitle = document.getElementById('page-title');
    pageTitle.textContent = title;
}
window.updatePageTitle = updatePageTitle;


function personalizeWelcome() {
    const user = auth.currentUser;
    const fullName = user?.displayName || "User"; // Fallback if displayName is not set
    const welcomeMessage = document.getElementById('welcome-message');

    welcomeMessage.textContent = `Welcome, ${fullName}!`;
}



function requestButtonPressed(event) {
    event.preventDefault(); // Prevent page reload
    const postBody = textarea.value;
    const user = auth.currentUser;

    if (postBody.trim()) {
        addPostToDB(postBody, user); // Add request to the database
        clearInputField(textarea); // Clear the input field
    } else {
        console.log("Please enter a valid company name.");
    }
}


function renderPost(postsEl, requestData) {
    postsEl.innerHTML += `
        <div class="post">
            <div class="header">
                <h3>${displayDate(requestData.createdAt)}</h3>
                <img src="assets/emojis/${postData.mood}.png">
            </div>
            <p>
                ${replaceNewlinesWithBrTags(requestData.body)}
            </p>
        </div>
    `
}




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