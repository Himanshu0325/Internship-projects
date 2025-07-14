import { User } from "../Models/userModel.js"
import { ActivityLogs } from "../Models/ActivityLogModel.js"

const createActivityLog = async (req,res)=>{
  const {id , tableName , recordId , action , OldUserdata} = req.body

  console.log( id , tableName ,recordId , action);
  if(!id || !tableName || !recordId || !action){
    return res.status(404).json({
      status: 404,
      message: "All Feild Are required",
      data: null,
      code: 404
    })
  }

  const loggedInUser = await User.findById(id)
  console.log(loggedInUser);

  const loggedInUserName = loggedInUser.userName

  if(!loggedInUser){
    return res.status(404).json({
      status: 404,
      message: "Logged In User Not Found",
      data: null,
      code: 404
    })
  }

  const ChangedUser = await User.findById(recordId)

  console.log(ChangedUser);
  
   if(!ChangedUser){
    return res.status(404).json({
      status: 404,
      message: "Changed User Not Found",
      data: null,
      code: 404
    })
  }

  let changedField
  
  if(action === 'Created'){
      changedField = [
    {
      label : 'fullName',
      value : ChangedUser.fullName
    },
    {
      label : 'userName',
      value : ChangedUser.userName
    },
    {
      label : 'email',
      value : ChangedUser.email
    },
  ]
  }else if(action === 'Updated'){


     changedField = [
    {
      label : 'fullName',
      newvalue : ChangedUser.fullName === OldUserdata.fullName ? '': ChangedUser.fullName ,
      value : OldUserdata.fullName 
    },
    {
      label : 'userName',
      newvalue : ChangedUser.userName === OldUserdata.userName ? '': ChangedUser.userName,
      value : OldUserdata.userName 
    },
    {
      label : 'email',
      newvalue : ChangedUser.email === OldUserdata.email ? '': ChangedUser.email,
      value : OldUserdata.email
    },
  ]
  }else if(action === 'Blocked'){
    changedField=[
      {
      label : 'userName',
      value : ChangedUser.userName
      },
      {
        label :'Status',
        value : 'InActive'
      }
    ]
  }else if(action === 'Actived'){
    changedField=[
      {
      label : 'userName',
      value : ChangedUser.userName
      },
      {
        label :'Status',
        value : 'Active'
      }
    ]
  }

  console.log(changedField);
  
  const activityLogs = await ActivityLogs.create({
    table_name : tableName,
    recordId : recordId,
    action : action,
    changedField : changedField,
    performedBy:loggedInUserName
  })
  console.log(activityLogs);
  

  return res.status(200).json({
    status: 200,
      message: "Activity Log Added",
      data: activityLogs,
      code: 200
  })

}

const GetAllLogs = async (req,res) =>{

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const filterStatus = req.query.filter
  const skip = (page - 1) * limit;

  console.log(filterStatus , req.query);
  
   let query = {};
    // let total 

    switch (filterStatus) {
      case 'Created':
        query = { action : 'Created' };
        break;
      case 'Updated':
        query = { action :'Updated' };
        break;
      case 'Blocked':
        query = { action : 'Blocked'};
        break;
      case 'Actived':
        query = { action : 'Actived' };
        break;
      // case 'reset':
      //   query = {};
      //   break;
      default:
        break;
    }
    console.log(query);
    


  const allActivityLogs = await ActivityLogs.find(query)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);


//  console.log(allActivityLogs);

 return res.status(200).json({
    status: 200,
      message: "All Activity Log",
      data: allActivityLogs,
      code: 200
  })
 
}

export {createActivityLog , GetAllLogs}