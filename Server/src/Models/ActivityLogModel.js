import mongoose, { Schema } from "mongoose";
import { User } from "./userModel";

const ActivityLogsSchema = new mongoose.Schema({
  table_name:{
    type : String,
    required : true
  },
  recordId:{
    type : Schema.Types.ObjectId,
    ref : 'User',
    required : true
  },
  action:{
    type: String,
    required : true
  },
  changedFeild:{
    type: String,
    required : true
  },
  performedBy:{
    type : Schema.Types.ObjectId,
    required : true
  }
})

export const ActivityLogs = mongoose.model("ActivityLogs", ActivityLogsSchema);