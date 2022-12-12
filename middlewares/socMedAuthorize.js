const { SocialMedia } = require("../models");

function socialMediaAuthorize(req, res, next) {
    const socialMediaId = req.params.socialMediaId;
    const authenticatedUser = res.locals.user;

    SocialMedia.findOne({
        where: {
            id: socialMediaId
        }
    }).then(socmed => {
        if (!socmed) {
            return res.status(404).json({
                name: "Social Media Not Found",
                message: `Social Media with id ${socialMediaId} not found on Database`
            });
        }
        if (socmed.UserId === authenticatedUser.id) {
            return next();
        } else {
            return res.status(403).json({
                name: "Authorization Error",
                message: `You Does Not Have Permission to Edit or Delete Socila Media with id ${socialMediaId}!!!`
            });
        }
    }).catch(error => {
        res.status(500).json({error});
    })
}

module.exports = socialMediaAuthorize;