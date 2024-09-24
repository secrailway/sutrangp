let users = [];

// Load the CSV file from Google Sheets on page load
document.addEventListener('DOMContentLoaded', loadCSV);

async function loadCSV() {
    try {
        const cacheBuster = new Date().getTime(); // Unique value to prevent caching
        const response = await fetch(`https://docs.google.com/spreadsheets/d/18VA-j4RRCPTfk_Em1Y7XvWai9UaEwDnM7gUIY5WBtpc/pub?output=csv&nocache=${cacheBuster}`);
        const text = await response.text();
        users = parseCSV(text);
        console.log('Parsed Users:', users); // For debugging: Log the parsed user data
    } catch (error) {
        console.error('Error loading CSV file:', error);
    }
}

function parseCSV(text) {
    const rows = text.split('\n').filter(row => row.trim() !== ''); // Filter out empty rows
    return rows.map(row => {
        const columns = row.split(',');
        return {
            userId: columns[0].trim().toUpperCase(), // Convert userId to uppercase
            name: columns[1].trim(), // Assuming name is in the second column (Column B)
            password: columns[2].trim()
        };
    });
}

document.querySelector('.top-right-image').addEventListener('click', function() {
    window.location.href = 'index.html'; // Redirect to index.html when the image is clicked
});

function login() {
    const userId = document.getElementById('userId').value.trim().toUpperCase(); // Convert to uppercase
    const password = document.getElementById('password').value.trim();
    const message = document.getElementById('message');

    console.log('Attempting login with:', { userId, password }); // Log login attempt

    // Search for the user where both the ID and password match (case-insensitive for ID)
    const user = users.find(u => u.userId === userId && u.password === password);

    if (user) {
        // Store user ID and name in sessionStorage
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userId', user.userId);
        sessionStorage.setItem('userName', user.name);

        message.style.color = 'green';
        message.innerText = 'Login successful!';
        
        // Redirect to "sutra-form.html" after successful login
        window.location.href = 'sutra-form.html';
    } else {
        message.style.color = 'red';
        message.innerText = 'Invalid User ID or Password!';
    }
}
