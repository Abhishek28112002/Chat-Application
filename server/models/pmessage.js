import mongoose from "mongoose";
const { Schema } = mongoose;

const privateMessageSchema = new Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  sent: { type: Date, default: Date.now },
  delivered: { type: Date },
  received: { type: Date},
});

export default privateMessageSchema;