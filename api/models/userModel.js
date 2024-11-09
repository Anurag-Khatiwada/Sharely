const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20

    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min: 4,
    },
    profilePicture:{
        type: String,
        default: ""
    },
    coverPicture:{
        type: String,
        default: ""
    },
    followers:{
        type: Array,
        default: []
    },
    followings:{
        type: Array,
        default: []
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    desc:{
        type: String,
        max: 50
    },
    city:{
        type: String,
        max: 50
    },
    from:{
        type: String,
        max: 50
    },
    relationship:{
        type: String,
        status: ["Single", "Married", "Complicated"],


    }

},
{timestamps: true}

);

module.exports = mongoose.model("user", userSchema)