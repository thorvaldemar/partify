const path = require('path');
const __app = path.resolve(__dirname + "/../app");
const port = 80;
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const http = require('http').createServer(app);
const bcrypt = require('bcrypt');
const saltRounds = 10;
const mysql = require('mysql');

app.use(session({secret: 'Yxq39xdd.', saveUninitialized: true, resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

const initArgs = process.argv.slice(2);
const debugEnabled = initArgs.includes('-debug') || initArgs.includes('-d');
if (debugEnabled) console.log("Debugging is enabled!");

const con = mysql.createConnection({
    host: 'localhost',
    user: 'salusinco',
    password: 'yxq39xdd',
    database: 'partify'
});

con.connect(err => {
    if (err) throw err;
    console.log('Connection to database established!');
});


router.get('/', (req, res) => {
    if (req.session.uid) res.redirect('/home');
    else res.redirect('/login');
});

router.get('/login', (req, res) => {
    // TODO: Return the country code of the user
    if (req.session.uid) res.redirect('/home');
    else res.sendFile(__app + '/pages/login/index.html');
});

router.get('/home', (req, res) => {
    if (!req.session.uid) res.redirect('/login');
    else res.sendFile(__app + '/pages/home/index.html');
});

router.post('/login/:username/:password', (req, res) => {
    var {username, password} = req.params;
    con.query(`SELECT password, uid, country FROM users WHERE username='${username}' OR mail='${username}'`, (err, resault, fields) => {
        if (resault.length != 0) {
            checkPassword(password, resault[0].password, (match) => {
                if (match) {
                    req.session.uid = resault[0].uid;
                    res.send({"success": true});
                    debug(`${username} just logged in from ${resault[0].country}`);
                    return;
                } else {
                    res.send({"success": false, "reason": "Incorrect password"});
                    return;
                }
            });
        } else {
            res.send({"success": false, "reason": "Username could not be found"});
            return;
        }
    });
});

router.post('/register/:username/:password/:mail/:country', (req, res) => {
    var {username, password, mail, country} = req.params;
    con.query(`SELECT username, mail FROM users WHERE username='${username}' OR mail='${mail}'`, (err, resault, fields) => {
        if (resault.length > 0) {
            var ext = resault[0];
            if (ext.username == username) {
                res.send({success: 'false', reason: 'Username already exists'});
                return;
            }
            if (ext.mail == mail) {
                res.send({success: 'false', reason: 'Mail already in use'});
                return;
            }
        }
        createPassword(password, hash => {
            con.query(`INSERT INTO users (uid, username, password, mail, country) VALUES (${createUID()}, '${username}', '${hash}', '${mail}', '${country}')`);
            debug(`New user from ${country} registered with username: ${username}`);
            res.send({success: true});
        });
    });
});

router.post('/getUserCountry', (req, res) => {
    if (req.session.uid) {
        con.query(`SELECT country FROM users WHERE uid=${req.session.uid}`, (err, resault, fields) => {
            if (resault.length > 0) res.send({"country": resault[0]['country']});
            else res.send({"country": 'EN'});
        });
    } else {
        res.send({"country": req.headers['accept-language'].split(',')[0].split('-')[1]});
    }
});

/**
 * Callback for checkpassword
 * @callback HashCallback
 * @param {String} hsh The hashed password
 */
/**
 * Hashing a password
 * @param {String} pass The password to hash
 * @param {HashCallback} done Callback that contains the password hash
 */
function createPassword(pass, done = (hsh) => {}) {
    bcrypt.genSalt(saltRounds).then(salt => {
        bcrypt.hash(pass, salt).then(hash => {
            done(hash);
        });
    });
}

/**
 * Callback for checkpassword
 * @callback HashCheckCallback
 * @param {Boolean} match If the password matches
 */
/**
 * Check if a password matches a stored password
 * @param {String} pass the given password
 * @param {String} hash the hash from the database
 * @param {HashCheckCallback} done a callback function the contains a boolean variable
 */
function checkPassword(pass, hash, done = (match) => {}) {
    var salt = hash.substr(0, 29);
    bcrypt.hash(pass, salt).then(hsh => {
        done(hash == hsh);
    });
}

/**
 * Generate a random uniqID
 * @param {Number} length length of the uid
 * @param {String} chars characters that may be included in the uid
 * @returns {String} UniqID
 */
function createUID(length = 6, chars = '0123456789') {
    var uid = '';
    for (var i = 0; i < length; i++) uid += chars[rnd(0, chars.length-1)];
    return uid;
}

/**
 * Get a random number between two numbers both included
 * @param {Number} min Minimum number
 * @param {Number} max Maximum number
 * @returns {Number} A number between the min and max number
 */
function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

/**
 * Only logging this if debugging is enabled
 * @param {any} message The message to send
 */
function debug(message) {
    if (debugEnabled) console.debug(message);
}

// Public folders
app.use('/extensions', express.static(__app + '/extensions'));
app.use('/public', express.static(__app + '/public'));
app.use('/assets', express.static(__app + '/assets'));
app.use('/style', express.static(__app + '/bin/style'));
app.use('/js', express.static(__app + '/bin/javascript'));

app.use('/', router);

http.listen(port, () => {
    console.log(`listening on *:${port}`);
});