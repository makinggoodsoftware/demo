module.exports = function (req, res, next) {
    var sslUrl;

    if (process.env.NODE_ENV === 'production' &&
        req.headers['x-forwarded-proto'] !== 'https') {

        sslUrl = ['https://', req.hostname, req.url].join('');
        console.log("==== returning sslUrl: ", sslUrl);
        return res.redirect(sslUrl);
    }

    return next();
};