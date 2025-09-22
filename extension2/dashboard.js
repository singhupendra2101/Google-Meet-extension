document.addEventListener('DOMContentLoaded', () => {
    const userNameSpan = document.getElementById('user-name');
    const profileBtn = document.getElementById('profile-btn'); // This ID matches your dashboard.html
    const logoutBtn = document.getElementById('logout-btn');

    // Check if user is logged in. If not, redirect to login page.
    chrome.storage.local.get('user', (data) => {
        if (data.user && data.user.token) {
            userNameSpan.textContent = data.user.name;
        } else {
            window.location.href = 'login.html';
        }
    });

    // FIX: Use chrome.tabs.create with chrome.runtime.getURL to open extension pages
    if (profileBtn) { // Add a check to ensure the button exists
        profileBtn.addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('profile.html') });
        });
    }

    if (logoutBtn) { // Add a check to ensure the button exists
        logoutBtn.addEventListener('click', () => {
            // Clear user data from storage
            chrome.storage.local.remove('user', () => {
                // Notify active Google Meet tabs to remove the sidebar
                chrome.tabs.query({ url: "https://meet.google.com/*" }, (tabs) => {
                    tabs.forEach(tab => {
                        chrome.tabs.sendMessage(tab.id, { action: "userLoggedOut" });
                    });
                });
                // Redirect to login page
                window.location.href = 'login.html';
            });
        });
    }
});