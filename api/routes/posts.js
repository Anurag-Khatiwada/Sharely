const router = require("express").Router();
const userModel = require("../models/userModel");
const postModel = require("../models/postModel");

//create posts
router.post("/", async (req, res )=>{
    // const {userId, desc, likes}= re.body
    try{
        const savedpost = await postModel.create(req.body);
        res.status(200).json(savedpost);
    }catch (err){
        res.status(500).json(err);
    }
})

//update posts
router.put("/:id", async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json("Post not found");
        }

        // Check if the userId matches
        if (post.userId == req.body.userId) {
            // Update the post
            await postModel.updateOne({ _id: req.params.id }, { $set: req.body });
            res.status(200).json("Post updated successfully");
        } else {
            res.status(403).json("You can only update your own post");
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json("Internal server error");
    }
});
//delete posts
router.delete("/:id", async (req, res)=>{
    try{
        const post = await postModel.findById(req.params.id);
        if(!post){
            return res.status(404).json("No post found")
        }
        if(post.userId == req.body.userId){
            await post.deleteOne();
            res.status(200).json("Post deleted successfully");
        }else{
            return res.status(403).json("you can only delete your own post");
        }
    }catch (err){
        return res.status(500).json(err)
    }
})

//like and dislike posts
router.put("/:id/like", async (req, res)=>{
    try{
        const post = await postModel.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}})
            res.status(200).json("Liked");
        }else{
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json("DisLiked");
        }
    }catch (err){
        return res.status(500).json(err);
    }
})
//get posts
router.get("/:id", async (req, res)=>{
    try{
        const post = await postModel.findById(req.params.id);
        if(!post){
            return res.status(404).json("No any post");
        }else{
            return res.status(200).json(post);            
        }
    }catch (err){
        return res.status(500).json(err);
    }
})
//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
    try {
        const userId = req.params.userId.trim();

        const currentuser = await userModel.findById(userId);
        if (!currentuser) {
            console.log("User not found");
            return res.status(404).json("User not found");
        }


        const userPosts = await postModel.find({ userId: currentuser._id });

        const friendPosts = await Promise.all(
            currentuser.followings.map(async (friendId) => {
                const posts = await postModel.find({ userId: friendId });
                return posts;
            })
        );


        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        console.error("Error in timeline route:", err);
        return res.status(500).json(err);
    }
});

router.get("/profile/:username", async (req, res) => {
    try {
        const user = await userModel.findOne({username: req.params.username})

        const posts = await postModel.find({userId: user._id})
        res.status(200).json(posts)
    } catch (err) {
        console.error("Error in timeline route:", err);
        return res.status(500).json(err);
    }
});


module.exports = router;