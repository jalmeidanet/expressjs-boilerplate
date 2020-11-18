let port = process.env.APP_PORT;
let ip = process.env.APP_PROTOCOL + process.env.APP_HOST;

// check environment
switch (process.env.APP_ENVIRONMENT) {
    case 'production':
        break;
    case 'testing':
        break;
    case 'development':
        break;
}

// build config object
let PLATFORM_CONFIG = {
    platformIpAddress: ip,
    platformPort: port,
    emailNoReply: '',
    passNoReply: ''
};

// export object
module.exports = PLATFORM_CONFIG;
