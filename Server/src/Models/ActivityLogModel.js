import mongoose, { Schema } from "mongoose";

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
    required : true,
    enum: ['Created', 'Updated', 'Blocked' , 'Actived'],
  },
  changedField: {
    type: Array,
    required: true
  },
  performedBy:{
    type : String,
    required : true
  }
},
{
  timestamps: true,
}
)

export const ActivityLogs = mongoose.model("ActivityLogs", ActivityLogsSchema);