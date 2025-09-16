const express = require('express');
const PredictionController = require('../../controllers/prediction-controller');
const UserController = require('../../controllers/user-controller');
const {AuthRequestValidator} = require('../../middlewares/index');

const router = express.Router();

router.post(
    '/signup',
    AuthRequestValidator.validateUserAuth,
    UserController.create
);
router.post(
    '/signin',
    AuthRequestValidator.validateUserAuth,
    UserController.signIn
);

router.get(
    '/isAuthenticated',
    UserController.isAuthenticated
);

router.post('/file', PredictionController.handleFile);
router.get('/file/:id', PredictionController.getFile);
module.exports = router;