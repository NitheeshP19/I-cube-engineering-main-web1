const express = require('express');
const path = require('path');
const app = require('./api/index.js');
const port = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS) from the root directory
app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
    console.log(`Server running locally at http://localhost:${port}`);
    console.log(`- Frontend: http://localhost:${port}`);
    console.log(`- API Endpoint: http://localhost:${port}/api/contact`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('\x1b[33m%s\x1b[0m', 'WARNING: EMAIL_USER or EMAIL_PASS is missing in .env file.');
        console.warn('\x1b[33m%s\x1b[0m', 'Email sending will fail until these are configured.');
    } else {
        console.log('\x1b[32m%s\x1b[0m', 'Environment variables loaded successfully.');
    }
});
