const { Photo, User, Comment } = require("../models");

class PhotoController {
    static async createPhotos(req, res) {
        const { title, caption, poster_image_url } = req.body;
        const UserId = res.locals.user.id;
        try {
            const createPhotos = await Photo.create({
                title,
                caption,
                poster_image_url,
                UserId
            });
            let response = {
                id: createPhotos.id,
                poster_image_url: createPhotos.poster_image_url,
                title: createPhotos.title,
                caption: createPhotos.caption,
                UserId: createPhotos.UserId
            }
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    }
    
    static async getAllPhotos(req, res) {
        let UserId = res.locals.user.id;
        try {
            const dataPhotos = await Photo.findAll({
                // where: { 
                //     UserId
                // },
                include: [{
                    model: Comment,
                    attributes: ['comment'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }, {
                    model: User,
                    attributes: ['id', 'username', 'profile_image_url']
                }]
            });
            res.status(200).json({ photos: dataPhotos });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    static async updatePhotobyId(req, res) {
        let id = req.params.photoId;
        const { title, caption, poster_image_url } = req.body;
        let editData = {
            title,
            caption,
            poster_image_url,
        };
        try {
            Photo.update(editData, {
                where: {
                    id,
                },
                returning: true,
            }).then(result => {
                res.status(200).json({ photo: result[1][0] });
            });
        } catch (error) {
            res.status(500).json(error);
        }
    }
    catch(error) {
        res.status(500).json(error);
    }

    static async deletePhotobyId(req, res) {
        let id = req.params.photoId;
        try {
            Photo.destroy({
                where: {
                    id,
                },
            }).then(result => {
                res.status(200).json({ message: "Your photo has been successfully deleted" }); 
            }).catch(error => {
                res.status(500).json(error);
            });   
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = PhotoController;