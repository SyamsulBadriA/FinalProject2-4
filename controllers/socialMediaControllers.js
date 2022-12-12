const { SocialMedia, User } = require("../models");

class SocialMediaController {
    static async createSocialMedia(req, res) {
        const { name, social_media_url } = req.body;
        const UserId = res.locals.user.id;

        await SocialMedia.create({
            name,
            social_media_url,
            UserId
        }).then(result => {
            res.status(201).json({social_media: result});
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async getSocialMedia(req, res) {
        await SocialMedia.findAll({
            include: {
                model: User,
                attributes: ['id', 'username', 'profile_image_url']
            }
        }).then(result => {
            res.status(200).json({social_medias: result})
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async updateSocialMediabyId(req, res) {
        const { name, social_media_url } = req.body;
        const id = req.params.socialMediaId;

        let updateData = {
            name,
            social_media_url
        }

        await SocialMedia.update(updateData, {
            where: {
                id
            },
            returning: true
        }).then(result => {
            res.status(200).json({social_media: result[1][0]})
        }).catch(error => {
            res.status(500).json(error);
        })
    }

    static async deleteSocialMediabyId(req, res){
        const id = req.params.socialMediaId;

        await SocialMedia.destroy({
            where: {
                id
            }
        }).then(result => {
            res.status(200).json({message: "Your social media has been successfully deleted"});
        }).catch(error => {
            res.status(500).json(error);
        })
    }
}

module.exports = SocialMediaController;