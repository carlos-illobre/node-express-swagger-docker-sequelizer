module.exports = async (req, res, next) => {
    if (req.user.isAdmin && await req.user.isAdmin()) next();
    else {
        const error = new Error('This is an Administrator only resource.');
        error.status = 401;
        next(error);
    }
};
