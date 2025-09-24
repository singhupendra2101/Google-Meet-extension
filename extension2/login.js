document.addEventListener('DOMContentLoaded', () => {
    // Redirect to dashboard if already logged in
    chrome.storage.local.get('user', (data) => {
        if (data.user && data.user.token) {
            window.location.href = 'dashboard.html';
        }
    });
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        console.log('Attempting login for email:', email);
        const response = await fetch('http://localhost:5000/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        console.log('Login successful:', data);

        // Save user data including userId
        const user = {
            email: data.result.email,
            name: data.result.name,
            token: data.token,
            userId: data.result._id  // Store the userId from backend
        };

        chrome.storage.local.set({ user }, () => {
            console.log('User data saved to storage');  
            window.location.href = 'dashboard.html';
        });

    } catch (error) {
        console.error('Login error:', error);
    }
});