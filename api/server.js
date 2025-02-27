// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()
server.use(express.json())

server.delete('/api/users/:id', async (req, res) => {
    const pickedUser = await User.findById(req.params.id)
    if (!pickedUser) {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
    } else {
        const deletedUser = await User.remove(pickedUser.id)
        res.status(200).json(deletedUser)
    }
})

server.put('/api/users/:id', async (req, res) => {
    try {
        const pickedUser = await User.findById(req.params.id)
        if (!pickedUser) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        } else {
            if (!req.body.name || !req.body.bio) {
                res.status(400).json({ message: "Please provide name and bio for the user" })
            } else {
             const updated =  await User.update(req.params.id, req.body)
             res.status(200).json(updated)
            }
        } 
    }
        catch (err) {
            res.status(500).json({
                message: 'error updating users',
                err: err.message,
            })
        }
    })

server.post('/api/users', (req, res) => {
    const user = req.body;
    if (!user.name || !user.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user", })
    } else {
        User.insert(user)
            .then(newUser => {
                res.status(201).json(newUser)
            }).catch(err => {
                res.status(500).json({
                    message: 'error creating user',
                    err: err.message,
                })
            })
    }
})

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error getting users',
                err: err.message,
            })
        })
})


server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist", })
            }
            res.json(user)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error getting users',
                err: err.message,
            })
        })
})


server.use('*', (req, res) => {
    res.status(404).json({ message: "not found" })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
