const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticate } = require('../middleware/Auth');
const { uploadCV } = require('../controllers/CandidateController');
const { uploadPicture } = require('../controllers/CandidateController');
const { deletePicture } = require('../controllers/CandidateController');
// Destructured import
console.log('Middleware types:', {
    authenticate: typeof authenticate, // Should be 'function'
    uploadSingle: typeof upload.single('cv'), // Should be 'function'
    uploadCV: typeof uploadCV // Should be 'function'
});
router.post('/candidates/upload-cv',
    authenticate,
    upload.single('cv'),
    uploadCV // Direct function reference
);
router.get('/upload-pic', authenticate, uploadPicture);
router.delete('/delete-pic', authenticate, deletePicture);

module.exports = router;