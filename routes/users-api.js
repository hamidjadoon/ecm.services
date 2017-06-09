var User = require('../models/user-model');
const router = require('express').Router();
var mongoose = require('mongoose');

// connect db
const mongoUri = 'mongodb://localhost/mta';

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(mongoUri, function(err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + mongoUri + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + mongoUri);
    }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 
 */

router.get('/users', (req, res) => {

    User.find({}, (err, users) => {
        if (err) {
            res.send(err);
        }

        // object of all the users
        res.send(users);
    });

});

router.get('/users/:id', (req, res) => {
    User.find({ id: req.params.id }, (err, user) => {
        if (err) {
            res.send(err.errorMessage);
        }
        res.send(user);
    })
})

router.post('/users', (req, res) => {
    var user = new User(req.body.user);

    user.save(function(err) {
        if (err) {
            res.send(err);
        }

        res.status(200).end();

    });


})

module.exports = router;