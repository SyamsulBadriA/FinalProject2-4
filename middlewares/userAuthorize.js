const { User } = require("../models");

function userAuthorize(req, res, next) {
    const userId = req.params.userId;
    const authenticatedUser = res.locals.user;

    User.findOne({
        where: {
            id: userId
        }
    })
    .then(user => {
        if (!user) {
            return res.status(404).json({
                name: "Data Not Found",
                message: `User with id ${userId} not found on Database`
            });
        }
        if (user.id === authenticatedUser.id) {
            return next();
        } else {
            return res.status(403).json({
                name: "Authorization Error",
                message: `User with id "${authenticatedUser.id}" does not have permission to Edit/Delete User with id ${userId}`
            });
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })
}

module.exports = userAuthorize;