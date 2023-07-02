const userService = require('../services/userService'); 

module.exports = {
    getAllUser :async(req,res,next)=>{
        try {
            const users = await userService.getAllUser(); 
            res.status(200).json(users); 
        } catch (error) {
            res.status(500).json(error);
        }
    }, 
    getSingleUser:async(req,res,next)=>{
        try {
            const user = await userService.getSingleUser(req.params.id); 
            res.status(200).json(user); 
        } catch (error) {
            res.status(500).json(error); 
        }
    },
    updateUser:async(req,res,next)=>{
        try {
            await userService.updateUser({userId:req.params.id,data:req.body}); 
            res.status(200).json('Update user success !');
        } catch (error) {
            res.status(500).json(error); 
        }
    }, 
    deleteUser:async(req,res,next)=>{
        try {
            await userService.deleteUser(req.params.id); 
            res.status(200).json('Delete user success !');
        } catch (error) {
            res.status(500).json(error); 
        }
    }, 
    userStat:async(req,res,next)=>{
        try {
            const user = await userService.userStat(); 
            res.status(200).json(user); 
        } catch (error) {
            res.status(500).json(error); 
        }
    }
}


