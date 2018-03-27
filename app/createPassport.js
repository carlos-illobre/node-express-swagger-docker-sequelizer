const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = ({
    db,
}) => {

    const findUser = async (payload, done) => {

        const user = payload.sub.role
            ? await db[payload.sub.role].findById(payload.sub.id)
            : await db.User.findById(payload.sub.id, {
                include: [{
                    model: db.Role,
                    as: 'roles',
                    attributes: [ 'name' ],
                }],
            });

        done(null, user || false);

    };

    const strategy = new JwtStrategy({
        secretOrKey: process.env.JWT_SEED,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, findUser);

    return passport.use(strategy);

};
