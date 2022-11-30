import mongoose from "mongoose";
const { Schema } = mongoose;

const groupMessageSchema = new Schema({
  groupname: { type: String, required: true },
  sender: { type: String, required: true },
  groupMessage: { type: String},
  sent: { type: Date, default: Date.now },
  delivered: { type: Date },
  received: { type: Date},
});

export default groupMessageSchema;