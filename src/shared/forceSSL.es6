module.exports = function (req, res, next) {
    var sslUrl;

    if (process.env.NODE_ENV === 'production' &&
        req.headers['x-forwarded-proto'] !== 'https') {

        sslUrl = ['https://', req.headers.host, req.originalUrl].join('');
        console.log("==== redirecting to sslUrl: ", sslUrl);
        return res.redirect(sslUrl);
    }

    return next();
};