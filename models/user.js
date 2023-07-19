/** User class for message.ly */
/** User of the site. */

const db = require("../db");
const ExpressError = require("../expressError");
const bcrypt = require ("bcrypt")
const {BCRYPT_WORK_FACTOR} = require ('../config.js')

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */
    static async register(username, password, first_name, last_name, phone) {

	const timestamp = new Date();
	const hashed = await bcrypt.hash(password,BCRYPT_WORK_FACTOR)
	const results = await db.query(
	    `INSERT INTO users (username, password, first_name, last_name,  phone, join_at, last_login_at)
	     VALUES ($1, $2, $3, $4, $5,$6,$7)
             RETURNING username, password,first_name,last_name, phone`,
	    [username, hashed, first_name,last_name, phone, timestamp, timestamp])
	return results.rows[0];
    }
    
    
    
  /** Authenticate: is this username/password valid? Returns boolean. */

    static async authenticate (username, password) {

	const results = await db.query('SELECT username,password FROM users WHERE username = $1', [username]);
	if(results.rows.length > 0) {
	    const hashed = results.rows[0].password;
	    if (await bcrypt.compare(password, hashed )) {
		return true;
	    }
	}
	return false
    }

  /** Update last_login_at for user */

    static async updateLoginTimestamp(username) {

	const d = new Date();
	const results = await db.query(`UPDATE users SET last_login_at=$1  WHERE username=$2 RETURNING username`, [d,username]);

	if (results.rows.length === 0) {
	    throw new ExpressError(`No such user: ${username}`,401);
	}

	return results.rows[0];
    }
  /** All: basic info on all users:
   */

    static async all() {
	const results = await db.query('SELECT username, first_name, last_name, phone FROM users;')
	return results.rows;
    }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

    static async get(username) {

	const results = await db.query(`
	SELECT username, first_name,last_name,phone,last_login_at,join_at FROM users
	WHERE username = $1`, [username])

	if (results.rows.length === 0) {
	    throw new ExpressError(`No such user: ${username}`, 401);

	}
	return results.rows[0]
    }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone} ***********need to implement this
   */

    static async messagesFrom(username) {
	
	const results =  await db.query(`
	SELECT messages.id, users. username, users.first_name,users.last_name,users.phone , body, sent_at, read_at
	FROM messages
	LEFT JOIN users
	ON  to_username=users.username
	WHERE from_username = $1`, [username]);

	let arr = [];
	for(let i = 0; i < results.rows.length; i++){
	    arr.push (
		{
		    id : results.rows[i].id,
		    body: results.rows[i].body,
		    sent_at: results.rows[i].sent_at,
		    read_at: results.rows[i].read_at,
		    to_user:
		    {
			username: results.rows[i].username,
			first_name: results.rows[i].first_name,
			last_name: results.rows[i].last_name,
			phone: results.rows[i].phone
		    }
		}
	    )
	}
	return  arr;
    }
    
  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

    static async messagesTo(username) {
	const results =  await db.query(`
	SELECT messages.id, users.username, users.first_name,users.last_name,users.phone , body, sent_at, read_at
	FROM messages
	LEFT JOIN users
	ON  from_username=users.username
	WHERE to_username = $1`, [username]);

	let arr = [];
	for(let i = 0; i < results.rows.length; i++){
	    arr.push (
		{
		    id : results.rows[i].id,
		    body: results.rows[i].body,
		    sent_at: results.rows[i].sent_at,
		    read_at: results.rows[i].read_at,
		    from_user:
		    {
			username: results.rows[i].username,
			first_name: results.rows[i].first_name,
			last_name: results.rows[i].last_name,
			phone: results.rows[i].phone
		    }
		}
	    )
	}

	return  arr;
    }
}
    
module.exports = User;
