const express = require('express')
const router = express.Router();


const { moviesPosterDescriptionController, randomUsersDataController } = require('../controller/thirdPartyControllers');

router.get('/movies', moviesPosterDescriptionController);
router.get('/random', randomUsersDataController);

module.exports = router;