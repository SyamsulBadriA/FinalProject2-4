const { verifyToken } = require("../helpers/jwt");
const { User } = require('../models');

function authentication(req, res, next) {
    try {
        const token = req.get("token");
        const userDecoded = verifyToken(token);
        User.findOne({
            where: {
                id: userDecoded.id,
                email: userDecoded.email,
                username: userDecoded.username
            }
        })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    name: "Authentication Error",
                    message: `Please Login First`
                })
            }
            res.locals.user = user;
            return next();
        })
        .catch(err => {
            return res.status(401).json(err);
        })
    } catch (err) {
        return res.status(500).json(err);
    }
}

module.exports = authentication;