// auth.js - Handles login and signup functionality

document.addEventListener('DOMContentLoaded', function() {
    // Update this to match your backend URL and port
    const backendUrl = 'http://localhost:5000';
    
    // Debug logging
    console.log('Auth.js loaded, checking current page...');

    const isLoginPage = window.location.href.includes('login.html');
    const isSignupPage = window.location.href.includes('signup.html');

    // Check if user is already logged in
    chrome.storage.sync.get(['authToken', 'userData'], function(result) {
      if (result.authToken && result.userData) {
        // User is logged in, redirect to profile page
        window.location.href = 'profile.html';
      }
    });

    // Handle login form submission
    if (isLoginPage) {
      const loginForm = document.getElementById('login-form');
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!email || !password) {
          showError('Please fill in all fields');
          return;
        }
        
        // Attempt login
        login(email, password);
      });
    }
    
    // Handle signup form submission
    if (isSignupPage) {
        console.log('On signup page, attaching form handler');
        const signupForm = document.getElementById('signup-form');
        
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log('Signup form submitted');

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('error-msg');
            const successMsg = document.getElementById('success-msg');
            
            errorMsg.textContent = '';
            successMsg.textContent = '';

            try {
                console.log('Attempting to register user:', { username, email });
                
                // First, log the complete URL being called
                const registerUrl = `${backendUrl}/user/signup`;
                console.log('Sending POST request to:', registerUrl);

                const response = await fetch(registerUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: username,
                        email: email,
                        password: password
                    })
                });

                // Log the raw response for debugging
                console.log('Response status:', response.status);
                console.log('Response headers:', [...response.headers.entries()]);

                // Try to get the response as text first
                const responseText = await response.text();
                console.log('Raw response:', responseText);

                let data;
                try {
                    // Try to parse the response as JSON
                    data = JSON.parse(responseText);
                } catch (e) {
                    console.error('Failed to parse response as JSON:', e);
                    throw new Error('Server returned invalid JSON. Please try again.');
                }

                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                // Success!
                console.log('Registration successful:', data);
                successMsg.textContent = 'Registration successful! Redirecting to login...';
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } catch (error) {
                console.error('Registration error:', error);
                errorMsg.textContent = error.message || 'Registration failed. Please try again.';
            }
        });
    }
    
    // Login function
    function login(email, password) {
      const url = `${backendUrl}/user/login`;
      console.log('Sending login request to:', url);
      
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      .then(response => {
        console.log('Login response status:', response.status);
        
        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          return response.json().then(data => {
            if (!response.ok) {
              throw new Error(data.message || 'Login failed');
            }
            return data;
          });
        } else {
          throw new Error('Unexpected response from server');
        }
      })
      .then(data => {
        if (data.token) {
          // Get user info
          return fetch(`${backendUrl}/user/getuser`, {
            headers: {
              'x-auth-token': data.token
            }
          })
          .then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              return response.json().then(userData => {
                if (!response.ok) {
                  throw new Error('Failed to get user data');
                }
                return { token: data.token, userData };
              });
            } else {
              throw new Error('Unexpected response from server');
            }
          });
        } else {
          throw new Error('No token received');
        }
      })
      .then(({ token, userData }) => {
        // Store auth token and user data
        chrome.storage.sync.set({
          authToken: token,
          userData: userData,
          isLoggedIn: true
        }, function() {
          // Redirect to profile page
          window.location.href = 'profile.html';
        });
      })
      .catch(error => {
        console.error('Login error:', error);
        showError(error.message || 'Login failed. Please try again.');
      });
    }
    
    // Signup function
    function signup(username, email, password) {
      const url = `${backendUrl}/user/add`;
      console.log('Sending signup request to:', url);
      
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name : username, email, password })
      })
      .then(response => {
        console.log('Signup response status:', response.status);
        
        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          return response.json().then(data => {
            if (!response.ok) {
              throw new Error(data.message || 'Registration failed');
            }
            return data;
          });
        } else {
          if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
          // Try to get the response text for more information
          return response.text().then(text => {
            console.error('Response not JSON:', text);
            throw new Error('Unexpected response from server');
          });
        }
      })
      .then(data => {
        if (data.token) {
          // Get user info
          return fetch(`${backendUrl}/user/getuser`, {
            headers: {
              'x-auth-token': data.token
            }
          })
          .then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              return response.json().then(userData => {
                if (!response.ok) {
                  throw new Error('Failed to get user data');
                }
                return { token: data.token, userData };
              });
            } else {
              throw new Error('Unexpected response from server');
            }
          });
        } else {
          throw new Error('No token received');
        }
      })
      .then(({ token, userData }) => {
        // Store auth token and user data
        chrome.storage.sync.set({
          authToken: token,
          userData: userData,
          isLoggedIn: true
        }, function() {
          // Redirect to profile page
          window.location.href = 'profile.html';
        });
      })
      .catch(error => {
        console.error('Registration error:', error);
        showError(error.message || 'Registration failed. Please try again.');
      });
    }
    
    // Show error message
    function showError(message) {
      const errorElement = document.getElementById('error-message');
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.classList.add('visible');
      } else {
        console.error('Error:', message);
      }
    }
  });