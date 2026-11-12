
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const connection = mysql.createConnection(process.env.DATABASE_URL)

// Home route
app.get('/', (req, res) => {
    res.send('Hello world!!')
})

// Get all users
app.get('/users', (req, res) => {
    connection.query(
        'SELECT * FROM users',
        function (err, results, fields) {
            res.send(results)
        }
    )
})

// Get user by ID
app.get('/users/:id', (req, res) => {
    const id = req.params.id;

    connection.query(
        'SELECT * FROM users WHERE id = ?', [id],
        function (err, results, fields) {
            res.send(results)
        }
    )
})

// Create a new user
app.post('/users', (req, res) => {
    connection.query(
        'INSERT INTO `users` (`fname`, `lname`, `username`, `password`, `avatar`) VALUES (?, ?, ?, ?, ?)',
        [req.body.fname, req.body.lname, req.body.username, req.body.password, req.body.avatar],
        function (err, results, fields) {
            if (err) {
                console.error('Error in POST /users:', err);
                res.status(500).send('Error adding user');
            } else {
                res.status(200).send(results);
            }
        }
    )
})

// Update a user
app.put('/users', (req, res) => {
    connection.query(
        'UPDATE `users` SET `fname`=?, `lname`=?, `username`=?, `password`=?, `avatar`=? WHERE id =?',
        [req.body.fname, req.body.lname, req.body.username, req.body.password, req.body.avatar, req.body.id],
        function (err, results, fields) {
            res.send(results)
        }
    )
})

// Delete a user
app.delete('/users', (req, res) => {
    connection.query(
        'DELETE FROM `users` WHERE id =?',
        [req.body.id],
        function (err, results, fields) {
            res.send(results)
        }
    )
})

// Start server
app.listen(process.env.PORT || 3000, () => {
    console.log('CORS-enabled web server listening on port 3000')
})

// Export app for Vercel
module.exports = app
