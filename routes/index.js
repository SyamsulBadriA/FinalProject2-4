const router = require('express').Router();

const UserController = require('../controllers/userControllers');
const PhotoController = require('../controllers/photoControllers')
const authentication = require('../middlewares/authentication');
const userAuthorize = require('../middlewares/userAuthorize');
const photoAuthorize = require('../middlewares/photoAutorize');
const CommentController = require('../controllers/commentControllers');
const commentAuthorize = require('../middlewares/commentAuthorize');
const SocialMediaController = require('../controllers/socialMediaControllers');
const socialMediaAuthorize = require('../middlewares/socMedAuthorize');

router.post('/users/register', UserController.registerUser);
router.post('/users/login', UserController.loginUser);

router.use(authentication);

router.use('/users/:userId', userAuthorize);
router.put('/users/:userId', UserController.editUser);
router.delete('/users/:userId', UserController.deleteUser);

router.post('/photos', PhotoController.createPhotos);
router.get('/photos', PhotoController.getAllPhotos);
router.use('/photos/:photoId', photoAuthorize);
router.put('/photos/:photoId', PhotoController.updatePhotobyId);
router.delete('/photos/:photoId', PhotoController.deletePhotobyId);

router.post('/comments', CommentController.createComment);
router.get('/comments', CommentController.getComments);
router.use('/comments/:commentId', commentAuthorize);
router.put('/comments/:commentId', CommentController.updateCommentbyId);
router.delete('/comments/:commentId', CommentController.deleteCommentbyId);

router.post('/socialmedias', SocialMediaController.createSocialMedia);
router.get('/socialmedias', SocialMediaController.getSocialMedia);
router.use('/socialmedias/:socialMediaId', socialMediaAuthorize);
router.put('/socialmedias/:socialMediaId', SocialMediaController.updateSocialMediabyId);
router.delete('/socialmedias/:socialMediaId', SocialMediaController.deleteSocialMediabyId);


module.exports = router