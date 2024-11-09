const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    userId:{
        type:String,
        required: true
    },
    img:{
        type:String,
    },
    desc: {
        type: String,
        max: 500
    },
    likes:{
        type: Array,
        default: []

    }
},
    {timestamps: true}
);

module.exports = mongoose.model("post", postSchema)