const express = require('express');
const router = express.Router();
const db = require('./db'); 
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('326160157051-sulsasmu3q4p8ro3elbaas9b0ci9mokr.apps.googleusercontent.com');

router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '326160157051-sulsasmu3q4p8ro3elbaas9b0ci9mokr.apps.googleusercontent.com',
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name } = payload;

        // Check if the email already exists in the database
        const checkQuery = 'SELECT * FROM users WHERE email = ? OR google_id = ?';
        db.query(checkQuery, [email], (checkErr, result) => {
            if (checkErr) {
                console.error('Error checking email existence:', checkErr);
                return res.status(500).json({ error: 'Database error' });
            }

            if (result.length > 0) {
                const updateQuery = `
                    UPDATE google_logins 
                    SET last_login = NOW() 
                    WHERE email = ? 
                    OR google_id = ?
                `;
                db.query(updateQuery, [email], (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating last_activity:', updateErr);
                        return res.status(500).json({ error: 'Failed to update last activity' });
                    }
                    return res.status(200).json({ 
                        message: 'Login successful, last activity updated!',
                        user: { googleId, email, name } 
                    });
                });
            } else {
                const insertQuery = `
                    INSERT INTO users (google_id, email, name, last_login,created_at) 
                    VALUES (?, ?, ?, NOW(), NOW())
                `;
                db.query(insertQuery, [googleId, email, name], (insertErr) => {
                    if (insertErr) {
                        console.error('Error inserting Google login data:', insertErr);
                        return res.status(500).json({ error: 'Failed to save Google login details' });
                    }
                    res.status(200).json({ 
                        message: 'Login successful!',
                        user: { googleId, email, name } 
                    });
                });
            }
        });
    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

router.post('/login', (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email || !password) {
        return res.status(400).json({ error: 'Username/email and password are required' });
    }

    const checkQuery = 'SELECT * FROM users WHERE (email = ? OR name = ?) AND password = ?';

    db.query(checkQuery, [email, username, password], (checkErr, result) => {
        if (checkErr) {
            console.error('Error checking user existence:', checkErr);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: 'Login Successfull' });
        }
        else{
            return res.status(400).json({ error: 'Username/Email and Password do not match' });
        }
    });
});

router.post('/create-account', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const checkQuery = 'SELECT * FROM users WHERE email = ? OR name = ?';

    db.query(checkQuery, [email, username], (checkErr, result) => {
        if (checkErr) {
            console.error('Error checking user existence:', checkErr);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }

        const insertQuery = `
            INSERT INTO users (name, email, password, created_at) 
            VALUES (?, ?, ?, NOW())
        `;
        db.query(insertQuery, [username, email, password], (insertErr) => {
            if (insertErr) {
                console.error('Error creating account:', insertErr);
                return res.status(500).json({ error: 'Failed to create account' });
            }
            res.status(201).json({ message: 'Account created successfully!' });
        });
    });
});

module.exports = router;
