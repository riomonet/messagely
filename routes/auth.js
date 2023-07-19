const express = require("express");
const router = express.Router();
const User = require('../models/user')
const ExpressError = require('../expressError')
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post ('/register', async (req, res, next) => {

    try {
	const {username, password, first_name, last_name, phone} = req.body;
	if( !password || !username) {
	   throw new ExpressError("Username and Password required", 400)
	}
	const results = await User.register(username, password, first_name, last_name, phone)
	res.json(results)
    } catch (e) {
	return next(e)
    }
})

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login', async (req, res, next) => {

    try {
	const { username, password } = req.body;
	if (await User.authenticate(username,password)) {
	    let token = jwt.sign( {username}, SECRET_KEY)
	    return res.json({ token });
	}
	throw new ExpressError("Invalid User/password", 400)
    } catch (e) {
	return next(e)
    }
})

module.exports = router;
