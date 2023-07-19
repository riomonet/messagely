const Message = require('../models/message')
const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth')
const ExpressError = require('../expressError')

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', ensureLoggedIn,  async (req, res, next) => {
    try {
	const msg = await Message.get(req.params.id);
	console.log(req.user.username)
	if (msg.from_user.username === req.user.username || msg.to_user.username === req.user.username)
	    return res.json(msg);
	throw new ExpressError("Uggh Invalid user", 401)
    } catch (e) {
	return next(e)
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
	if (req.user.username === req.body.from_username){
	    const msg = await Message.create(req.body)
	    return res.json(msg)}
	throw new ExpressError("NOT ALLOWED TO SEND", 401)
    } catch (e) {
	return next(e)
    }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', async (req, res, next) => {

    try {
	const msg = await Message.markRead(req.params.id);
 	return res.json(msg)
    } catch (e) {
	return next(e)
    }
})

module.exports = router;
