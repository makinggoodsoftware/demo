module.exports = function (req, res, next) {
    var sslUrl;

    sslUrl = ['https://', req.headers.host, req.originalUrl].join('');
    console.log("==== sslUrl = ", sslUrl);
    
    console.log("==== in forceSSL, req = ", req);
    if (process.env.NODE_ENV === 'production' &&
        req.headers['x-forwarded-proto'] !== 'https') {

        sslUrl = ['https://', req.headers.host, req.originalUrl].join('');
        console.log("==== returning sslUrl: ", sslUrl);
        return res.redirect(sslUrl);
    } else {
        console.log("==== not redirecting")
    }

    return next();
};