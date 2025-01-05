import Orders from '../models/orders.js';
import  Users from '../models/users.js';
import Products from '../models/products.js';
import User from '../models/users.js';


// fetch all users - Get request

const fetchUsers = async(req,res)=>{
    try {
        const users = await Users.find({});
        JSON.stringify(users);

       
    } catch (error) {
        console.error(error);
        JSON.stringify({ error: 'something went wrong try again' });
        
    }
}


//admin block any user -Put request
const blockandUnblock = async(req,res)=>{
    try {
        const user_id = req.params.user_id
        const user =await User.findByIdAndUpdate(
            user_id,
            {$set:{status:req.body.status }},
            { new: true }
        )
        JSON.stringify(user.status)
        if(!user){
            return JSON.stringify({ error: 'User not found' });

        }

       
    } catch (error) {
        console.error(error);
        JSON.stringify({ error: 'something went wrong try again' });
        
    }
}



// fetch all products by admin -GEt request


// fetch all order  by admin -GEt request


//change order staus by admin


export {
    fetchUsers,
}