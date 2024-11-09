const dotenv = require("dotenv");
dotenv.config();  // Load environment variables first

const cloudinary = require("cloudinary").v2;  // Then require cloudinary
const express = require("express");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: 847553262885981,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadMediaToCloudinary = async (filePath) => {
    try {
        const url = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"  // Corrected typo here
        });
        // console.log(url)
        return url
    } catch (err) {
        console.log("Error uploading to Cloudinary:", err);
        throw err;  // Throw error for further handling in route
    }
};

module.exports = uploadMediaToCloudinary;


