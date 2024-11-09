
const router = require("express").Router();
const bcrypt = require("bcrypt"); 
const userModel = require('../models/userModel'); 

// Update user
// Update user
router.put('/:id', async (req, res) => {
    try {
        const { username, email, isAdmin, followings, password } = req.body;
        const id = req.params.id;

        console.log("Request Body User ID:", req.body.userId);
        console.log("Requested User ID:", id);

        // Check if the user is authorized to update
        if (req.body.userId === id || isAdmin === true) {
            if (password) {
                // If password is being updated, hash it
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Update the user with the hashed password
                await userModel.findByIdAndUpdate(id, { password: hashedPassword });
                return res.status(200).json("Password has been updated");
            }

            // Update other fields if password is not being updated
            const updatedUser = await userModel.findByIdAndUpdate(id, {
                $set: req.body
            }, { new: true });

            return res.status(200).json("Account has been updated successfully");
        } else {
            return res.status(403).json("You can only update your own account");
        }
    } catch (err) {
        console.error(err); // Log the error
        return res.status(500).json(err); 
    }
});

 
//delete user
router.delete("/:id", async (req, res)=>{
    let id = req.params.id;
   
    if(req.body.userId == id || isAdmin == true){
        try{
            const user = await userModel.deleteOne({_id: id});
            res.status(200).json("Account has been deleted successfully");
        
        }catch (err){
            return res.status(500).json(err); 
        }
    }else{
        return res.status(403).json("You can only delete your own account");
    }
    
})

//get user
router.get("/", async (req, res)=>{
    const userId= req.query.userId;
    const username = req.query.username;
    try{
        const user = userId?await userModel.findOne({_id: userId}):await userModel.findOne({username: username});
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    }catch (err){
        return res.status(500).json(err);
    }
})
//get friends
// Get friends
router.get("/friends/:userId", async (req, res) => {
    const userId = req.params.userId;
    
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const user = await userModel.findById(userId);
        const friends = await Promise.all(
            user.followings.map(friendId => userModel.findById(friendId))
        );

        const friendList = friends.map(friend => {
            const { _id, username, profilePicture } = friend;
            return { _id, username, profilePicture };
        });

        res.status(200).json(friendList);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

//follow user
// follow user
router.put("/:id/follow", async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json("User ID is required in the request body");
    }

    if (userId.toString() !== req.params.id) {
        try {
            const user = await userModel.findOne({ _id: req.params.id });
            const currentUser = await userModel.findOne({ _id: userId });
            
            if (!user.followers.includes(userId)) {
                await user.updateOne({ $push: { followers: userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("User has been followed");
            } else {
                return res.status(403).json("You already followed this account");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(400).json("You can't follow your own account");
    }
});


//unfollow user
router.put("/:id/unfollow", async (req, res)=>{
    if(req.body.userId.toString() !== req.params.id){
        try{
            const user = await userModel.findOne({_id: req.params.id});
            const currentuser = await userModel.findOne({_id: req.body.userId.toString()});
            if(user.followers.includes(req.body.userId.toString())){
                await user.updateOne({$pull: {followers: req.body.userId.toString()}});
                await currentuser.updateOne({$pull: {followings: req.params.id}});
                res.status(200).json("user has been unfollowed");
            }else{
                return res.status(403).json("you haven't followed this account");
            }
        }catch (err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(400).json("You can't unfollow yourself");
    }
})



module.exports = router;
