// // public/app.js
// const socket = io('http://localhost:3000'); // Connect to the server

// // Register user
// function register() {
//     const userData = {
//         firstName: document.getElementById('firstName').value,
//         lastName: document.getElementById('lastName').value,
//         mobile: document.getElementById('mobile').value,
//         email: document.getElementById('registerEmail').value,
//         address: document.getElementById('address').value,
//         street: document.getElementById('street').value,
//         city: document.getElementById('city').value,
//         state: document.getElementById('state').value,
//         country: document.getElementById('country').value,
//         loginId: document.getElementById('loginId').value,
//         password: document.getElementById('registerPassword').value
//     };

//     fetch('/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData)
//     })
//     .then(response => response.json())
//     .then(data => alert(data.message))
//     .catch(error => console.error('Error:', error));
// }

// // Login user
// function login() {
//     const email = document.getElementById('loginEmail').value;
//     const password = document.getElementById('loginPassword').value;

//     fetch('/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert(data.message);
//         if (data.message === 'Login successful') {
//             socket.emit('user_login', { email });
//         }
//     })
//     .catch(error => console.error('Error:', error));
// }

// // Listen for user list updates from the server
// socket.on('update_user_list', (onlineUsers) => {
//     const userTableBody = document.getElementById('userTable').querySelector('tbody');
//     userTableBody.innerHTML = ''; // Clear the table body before updating

//     onlineUsers.forEach((user) => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td><a href="#" onclick="showUserDetails('${user.email}')">${user.email}</a></td>
//             <td>${user.socketId}</td>
//             <td>${user.status}</td>
//         `;
//         userTableBody.appendChild(row);
//     });
// });

// // Show user details in modal
// function showUserDetails(email) {
//     fetch(`/user-details?email=${email}`)
//         .then(response => response.json())
//         .then(data => {
//             const userDetails = `
//                 Name: ${data.firstName} ${data.lastName}<br>
//                 Email: ${data.email}<br>
//                 Mobile: ${data.mobile}<br>
//                 LoginId:${data.loginId}<br>
//                 Address: ${data.address}, ${data.street}, ${data.city}, ${data.state}, ${data.country}
//             `;
//             document.getElementById('userDetails').innerHTML = userDetails;
//             document.getElementById('userModal').style.display = 'block';
//         })
//         .catch(error => console.error('Error:', error));
// }
// showUserDetails();

// // Close modal
// function closeModal() {
//     document.getElementById('userModal').style.display = 'none';
// }

//---------------------------

const socket = io('http://localhost:3000'); // Connect to the server

// Helper function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// Helper function to validate mobile number (simple regex for 10 digits)
function isValidMobile(mobile) {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
}

// Register user with validation
function register() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('registerEmail').value;
    const address = document.getElementById('address').value;
    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const country = document.getElementById('country').value;
    const loginId = document.getElementById('loginId').value;
    const password = document.getElementById('registerPassword').value;

    // Validate all fields are filled
    if (!firstName || !lastName || !mobile || !email || !address || !street || !city || !state || !country || !loginId || !password) {
        alert("All fields are required for registration.");
        return; // Stop the function if validation fails
    }

    // Validate email format
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate mobile number format
    if (!isValidMobile(mobile)) {
        alert("Please enter a valid mobile number with exactly 10 digits.");
        return;
    }

    // Validate password length (at least 6 characters)
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    // If all validations pass, submit the data
    const userData = {
        firstName,
        lastName,
        mobile,
        email,
        address,
        street,
        city,
        state,
        country,
        loginId,
        password
    };

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
}

// Login user with validation
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Validate fields are not empty
    if (!email || !password) {
        alert("Both email and password are required.");
        return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate password length (at least 6 characters)
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === 'Login successful') {
            socket.emit('user_login', { email });
        }
    })
    .catch(error => console.error('Error:', error));
}

// Listen for user list updates from the server
socket.on('update_user_list', (onlineUsers) => {
    const userTableBody = document.getElementById('userTable').querySelector('tbody');
    userTableBody.innerHTML = ''; // Clear the table body before updating

    onlineUsers.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" onclick="showUserDetails('${user.email}')">${user.email}</a></td>
            <td>${user.socketId}</td>
            <td>${user.status}</td>
        `;
        userTableBody.appendChild(row);
    });
});

// Show user details in modal
function showUserDetails(email) {
    fetch(`/user-details?email=${email}`)
        .then(response => response.json())
        .then(data => {
            const userDetails = `
                Name: ${data.firstName} ${data.lastName}<br>
                Email: ${data.email}<br>
                Mobile: ${data.mobile}<br>
                LoginId: ${data.loginId}<br>
                Address: ${data.address}, ${data.street}, ${data.city}, ${data.state}, ${data.country}
            `;
            document.getElementById('userDetails').innerHTML = userDetails;
            document.getElementById('userModal').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
}

// Close modal
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}
