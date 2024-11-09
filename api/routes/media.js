const express = require('express');
const multer = require("multer");
const uploadMediaToCloudinary = require('../helpers/cloudinary');

const router = express.Router();

// Use multer for handling file uploads
const upload = multer({ dest: 'uploads/' });  // Ensure 'uploads/' folder exists

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const result = await uploadMediaToCloudinary(req.file.path);
        console.log(result.url);
        res.json({ url: result.url });  // Return the URL in JSON format
    } catch (err) {
        console.log("Error in upload route:", err);
        res.status(500).send("Error uploading file.");
    }
});


module.exports = router;
