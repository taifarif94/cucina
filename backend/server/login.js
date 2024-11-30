const express = require('express');
const router = express.Router();
const db = require('./db'); // Import the MySQL connection from db.js
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
        const checkQuery = 'SELECT * FROM google_logins WHERE email = ?';
        db.query(checkQuery, [email], (checkErr, result) => {
            if (checkErr) {
                console.error('Error checking email existence:', checkErr);
                return res.status(500).json({ error: 'Database error' });
            }

            if (result.length > 0) {
                const updateQuery = `
                    UPDATE google_logins 
                    SET last_activity = NOW() 
                    WHERE email = ?
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
                    INSERT INTO google_logins (google_id, email, name, last_activity) 
                    VALUES (?, ?, ?, NOW())
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
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const query = 'INSERT INTO user_logins (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to insert login details' });
        }
        res.status(200).json({ message: 'Login details saved successfully!' });
    });
});

module.exports = router;
