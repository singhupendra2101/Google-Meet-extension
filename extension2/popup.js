document.addEventListener('DOMContentLoaded', function() {
    const userStatus = document.getElementById('user-status');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const viewProfileBtn = document.getElementById('view-profile-btn'); // Make sure this ID matches your button in popup.html

    // Check login status
    chrome.storage.local.get('user', (data) => {
        if (data.user && data.user.token) {
            // Logged in
            if (userStatus) userStatus.textContent = `Welcome!`;
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (viewProfileBtn) viewProfileBtn.style.display = 'block';
        } else {
            // Not logged in
            if (userStatus) userStatus.textContent = 'Please log in to use the extension.';
            if (loginBtn) loginBtn.style.display = 'block';
            if (signupBtn) signupBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (viewProfileBtn) viewProfileBtn.style.display = 'none';
        }
    });

    // Event Listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('login.html') });
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('signup.html') });
        });
    }

    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', () => {
            // Correct way to open an extension page
            chrome.tabs.create({ url: chrome.runtime.getURL('profile.html') });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            chrome.storage.local.remove('user', () => {
                // Inform background script to update state and notify content scripts
                chrome.runtime.sendMessage({ action: "userLoggedOut" }, () => {
                    // Reload popup to show logged-out state
                    window.location.reload();
                });
            });
        });
    }
});