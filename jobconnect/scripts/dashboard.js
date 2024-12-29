function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.add('hidden'));

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }
}

function logout() {
    alert('You have logged out successfully.');
    window.location.href = 'index.html';
}

function editProfile() {
    alert('Profile editing is not yet implemented.');
}