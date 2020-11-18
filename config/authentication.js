// build final structured object with connection parameters 
// for passport strategy purposes
var connect_object = {
    'connection': {
        'host': process.env.APP_DB_HOST,
        'user': process.env.APP_DB_USER,
        'password': process.env.APP_DB_PASS
    },
    'database': process.env.APP_DB,
    'users_table': process.env.APP_AUTH_TABLE
};

// export connection
module.exports = connect_object;
