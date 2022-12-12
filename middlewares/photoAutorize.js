const { Photo } = require("../models");

function photoAuthorize(req, res, next) {
    const photoId = req.params.photoId;
    const authenticatedUser = res.locals.user;

    Photo.findOne({
        where: {
            id: photoId
        }
    }).then(photo => {
        if (!photo) {
            return res.status(404).json({
                name: "Photo Not Found",
                message: `Photo with id "${photoId}" not found on Database`
            });
        }
        if (photo.UserId === authenticatedUser.id) {
            return next();
        } else {
            return res.status(403).json({
                name: "Authorization Error",
                message: `You Does Not Have Permission to Edit or Delete Photo with id ${photoId}!!!`
            });
        }
    }).catch(err => {
        return res.status(500).json(err);
    })
}

module.exports = photoAuthorize;