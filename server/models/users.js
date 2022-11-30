const mongoose=require('mongoose')
const { Schema } = mongoose;
const userSchema=new Schema({
    username:{ type: String, required: true},
    userid:{ type: String, required: true},
})
export default userSchema;