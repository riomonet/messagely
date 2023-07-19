const express = require("express");
const router = express.Router();
const User = require('../models/user')
const ExpressError = require('../expressError')
const { ensureLoggedIn,ensureCorrectUser } = require('../middleware/auth')


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get ('/', ensureLoggedIn, async (req, res, next) => {
    const results = await User.all();
    res.json({users: results})
})  

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', async (req, res, next) => {

    try {
	username = req.params.username;
	const response = await User.get(username)
	return res.json({user: response})
    }
    catch (e){
	next(e)
    }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', async (req, res, next) => {
    try {
	username = req.params.username;
	const response = await User.messagesTo(username)
	return res.json({user: response})
    }
    catch (e){
	next(e)
    }
    
})


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


router.get('/:username/from', async (req, res, next) => {
    try {
	username = req.params.username;
	const response = await User.messagesFrom(username)
	return res.json({user: response})
    }
    catch (e){
	next(e)
    }
});


module.exports = router;
