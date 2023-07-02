const Comment = require('../models/commentModel'); 


module.exports = {
    createComment : (data)=>{
        return new Promise((resolve,reject)=>{
            data.commentAt = moment().format('LLL'); 
            Comment.create(data).then(comment=>resolve(comment)).catch(err=>reject(err)); 
        })
    }, 
    getAllComment :(productId)=>{
        return new Promise(async(resolve,reject)=>{
            try {     
                const comments= await Comment.find({ productId:productId}).populate("userId")
                const others = comments.map(item=>{
                    return {userName:item.userId.userName,times:item.commentAt,comment:item.content}
                })  
                resolve(others);    
            } catch (error) {
                reject(error)
            }
        })
    }
}