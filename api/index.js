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



const https = require('https');

// Visit Counter Route (Proxy to CounterAPI to avoid CORS/Ad-blocker issues)
app.get('/api/visits', (req, res) => {
    https.get('https://api.counterapi.dev/v1/icubeengineeringllp/visits/up', (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            try {
                const json = JSON.parse(data);
                // Add an offset of 900 as requested by the user
                if (json && typeof json.count !== 'undefined') {
                    json.count = parseInt(json.count) + 900;
                }
                res.status(200).json(json);
            } catch (error) {
                console.error('Visit Counter JSON Parse Error:', error);
                res.status(200).json({ count: 900 + Math.floor(Math.random() * 10) }); // Fallback to a base number
            }
        });
    }).on('error', (error) => {
        console.error('Visit Counter Request Error:', error);
        res.status(200).json({ count: 900 }); // Graceful fallback
    });
});

// Vercel Serverless Export
module.exports = app;
