// load passport strategy
const LocalStrategy = require('passport-local').Strategy;

// load modules
const mysql = require('mysql');
const CryptoJS = require('crypto-js');
const dbconfig = require('./authentication.js');
const aSync = require("async");
const moment = require('moment');

// create connection and use it
const connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

// export function
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // deserialize the user
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'email',
            passwordField: 'secret_cypher',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, function (req, email, secret_cypher, done) { // callback with email and password from our form

            // handle ip and secret key encryption/decryption
            // at this moment the password is a cypher sent by the controller to avoid text traveling between the FE and BE
            // so we need to decrypt it an then compare it
            let password_key = CryptoJS.AES.decrypt(secret_cypher.toString(), process.env.APP_SECRET_KEY);
            let passwordDecrypt = password_key.toString(CryptoJS.enc.Utf8);

            connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE email = ? AND state = 1;", [email], function (err, rows) {
                if (err) {
                    return done(err);
                }
                else if (!rows.length) {
                    return done(null, false, req.flash('login_msg', req.i18n_texts.no_email_msg)); // req.flash is the way to set flashdata using connect-flash
                }
                // if the user exists but the password is wrong
                // here we decrypt the password cypher from the DB and compare it with the password sent by the controller/user form input (we are using crypto-js module)
                else if (CryptoJS.AES.decrypt(rows[0].password.toString(), process.env.APP_SECRET_KEY).toString(CryptoJS.enc.Utf8) != passwordDecrypt) {


                } else {
                    // if the user exists and the password is correct do stuff
                }
            });
        })
    );
};
