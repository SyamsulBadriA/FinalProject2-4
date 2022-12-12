const { Comment } = require("../models");

function commentAuthorize(req, res, next) {
    const commentId = req.params.commentId;
    const authenticatedUser = res.locals.user;

    Comment.findOne({
        where: {
            id: commentId
        }
    }).then(comment => {
        if (!comment) {
            return res.status(404).json({
                name: "Comment Not Found",
                message: `Comment with id ${commentId} not found on Database`
            });
        }
        if (comment.UserId === authenticatedUser.id) {
            return next();
        } else {
            return res.status(403).json({
                name: "Authorization Error",
                message: `You Does Not Have Permission to Edit or Delete Comment with id ${commentId}!!!`
            });
        }
    }).catch(error => {
        res.status(500).json({error});
    })
}

module.exports = commentAuthorize;