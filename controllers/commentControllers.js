const { Comment, Photo, User } = require("../models");

class CommentController {
    static async createComment(req, res) {
        const { comment, PhotoId } = req.body;
        const UserId = res.locals.user.id;

        await Photo.findOne({
            where: {
                id: PhotoId
            }
        }).then(result => {
            if(!result){
                return 0;
            } else {
                return 1;
            }
        }).then(state => {
            if(state) {
                Comment.create({
                    comment,
                    UserId,
                    PhotoId
                }).then(result => {
                    res.status(201).json({comment: result});
                }).catch(error => {
                    res.status(500).json(error);
                })
            } else {
                res.status(404).json({message: `Photo with PhotoId ${PhotoId} not found on Database`})
            }
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async getComments(req, res) {
        try {
            const dataComment = await Comment.findAll({
                include: [{
                    model: Photo,
                    attributes: ['id', 'title', 'caption', 'poster_image_url']
                }, {
                    model: User,
                    attributes: ['id', 'username', 'profile_image_url', 'phone_number']
                }]
            });
            res.status(200).json({comments: dataComment});
          } catch (error) {
            res.status(500).json(error);
          }
    }

    static async updateCommentbyId(req, res) {
        const { comment } = req.body;
        const id = req.params.commentId;

        let editData = {
            comment,
        };

        await Comment.update(editData, {
            where: {
                id
            },
            returning: true
        }).then(result => {
            res.status(200).json({comment: result[1][0]});
        }).catch(error => {
            res.status(500).json({message: error});
        })
    }

    static async deleteCommentbyId(req, res) {
        let id = req.params.commentId;
        await Comment.destroy({
            where: {
                id
            }
        }).then(result => {
            res.status(200).json({ message: "Your comment has been successfully deleted" }); 
        }).catch(error => {
            res.status(500).json(error);
        })
    }
}

module.exports = CommentController;