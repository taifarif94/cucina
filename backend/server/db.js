const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost', // Replace with your host
    user: 'root',      // Replace with your username
    password: '',      // Replace with your password
    database: 'hcat' // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = db;
