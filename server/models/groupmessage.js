import mongoose=require('mongoose');
const { Schema } = mongoose;
const groupmessage =new Schema({
    sender:{type: String, required: true},
    message:{ type: String, required: true},
    date:{ type: Date.now, required: true}
})
export default groupmessage;