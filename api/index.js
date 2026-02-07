const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Email Sending Route
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    try {
        // Create Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS  // Your App Password
            }
        });

        // Email Content
        const mailOptions = {
            from: `"${name}" <${email}>`, // Show sender's name
            to: 'icubeengineeringllp@gmail.com', // Recipient
            subject: `New Contact Form Submission from ${name}`,
            text: `You have received a new message from your website contact form.
            
            Name: ${name}
            Email: ${email}
            
            Message:
            ${message}`,
            html: `
            <h3>New Contact Message</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
    }
});

const fs = require('fs');
const path = require('path');

// Visit Counter Route
app.get('/api/visits', (req, res) => {
    const filePath = path.join(__dirname, '../visits.json');
    
    // Read current count
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading visits file:', err);
            // If file doesn't exist, start at 1
            return res.json({ value: 1 });
        }

        try {
            let json = JSON.parse(data);
            let newValue = (json.value || 0) + 1;
            
            // Update file
            fs.writeFile(filePath, JSON.stringify({ value: newValue }), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing visits file:', writeErr);
                }
                // Return new value regardless of write success to keep UI responsive
                res.json({ value: newValue });
            });

        } catch (parseErr) {
            console.error('Error parsing visits JSON:', parseErr);
            res.json({ value: 1 });
        }
    });
});

// Vercel Serverless Export
module.exports = app;
