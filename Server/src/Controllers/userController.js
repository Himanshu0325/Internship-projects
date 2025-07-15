import { User } from "../Models/userModel.js";
import jwt from 'jsonwebtoken'
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";

function generateTokens(payload) {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    throw new Error("Token secrets are not defined in environment variables.");
  }

  const acessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });
  return { acessToken, refreshToken };
}

const Register = async (req, res) => {
  console.log(req.body);

  const { fullName, userName, email, password } = req.body;

  if (!fullName || !userName || !email || !password) {
    return res.status(400).json({
      status: 400,
      message: "All fields are required",
      data: null,
      code: 400
    });
  }

  
  console.log(req.files);
  const profileImgLocalPath = req.files?.profileImg[0]?.path;

  if (!profileImgLocalPath) {
    console.log("Profile image not provided");
    return
  }

  const profileImg = await uploadOnCloudinary(profileImgLocalPath);

  const existedUser = await User.findOne({
      $or: [{ userName }, { email }],
    });
    console.log(existedUser);

    if (existedUser) {
      const field = existedUser.userName === userName ? 'username' : 'email';
      return res.status(409).json({
        status: 409,
        message: `User already exists with this ${field}`,
        data: null,
        code: 409
      });
    }

  const user = await User.create({
    fullName,
    userName,
    email,
    password,
    profileImg: profileImg.url,
  })

  if (!user) {
    console.error("Error creating user:", err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
      code: 500
    });
  }
  

  return res.status(201).json({
    status: 201,
    message: "User registered successfully",
    data: {
      id: user._id,
      name: user.fullName,
      username: user.userName,
      email: user.email,
    },
    code: 201
  });

}

const Verify = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(email, password);


    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User Not Found with given email",
        data: null,
        code: 404
      });
    }

    if (user.password !== password) {
      return res.status(200).json({
        status: 401,
        message: "Invalid password",
        data: null,
        code: 401
      });
    }

    if (user.isVerified === false) {
      return res.status(400).json({
        status: 401,
        message: "You need to verify Your Email",
        data: null,
        code: 401
      });
    }

    if (user.status === false) {
      return res.status(400).json({
        status: 401,
        message: "You are blocked",
        data: null,
        code: 401
      });
    }

    const tokens = generateTokens({ user_Id: user._id })

    const { acessToken, refreshToken } = tokens
    console.log("Access Token:", acessToken);
    
    user.save({
      refreshToken
    })

    const loggedInUser = await User.findById(user._id).select("-password ");

    return res.send({
      status: 200,
      message: "User logged in successfully",
      code: 200,
      tokens: { acessToken, refreshToken },
      data: loggedInUser
    })
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
      code: 500
    });
  }
}

const getAllUsers = async (req, res) => {
  try {

    // const filterStatus = req.body.filterStatus
    // console.log(req.body);
    
    // Get page and limit from query, default to page 1, limit 8
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const filterStatus = req.query.filter
    const skip = (page - 1) * limit;

    let query = {};
    // let total 

    switch (filterStatus) {
      case 'active':
        query = { status: true };
        break;
      case 'deactive':
        query = { status: false };
        break;
      case 'Verified':
        query = { isVerified: true };
        break;
      case 'UnVerified':
        query = { isVerified: false };
        break;
      // case 'reset':
      //   query = {};
      //   break;
      default:
        break;
    }
    console.log(filterStatus);
    
    // Fetch users with pagination
    const users = await User.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    // Optionally, get total count for frontend
    const total = await User.countDocuments(query);


    res.status(200).json({
      status: 200,
      message: "Users fetched successfully",
      data: users,
      total,
      page,
      code: 200
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
      code: 500
    });
  }
}

const updateUser = async (req, res) => {
  try {
    const { fullName, userName, email } = req.body.form

    if (!fullName || !userName || !email) {
      return res.status(400).json({
        status: 400,
        message: "All fields are required",
        data: null,
        code: 400
      });
    }
    console.log(req.body.editUserData);

    const editUserId = req.body.editUserData._id
    console.log(editUserId);

    const existedUser = await User.findOne({
      $or: [{ userName }, { email }],
      _id: { $ne: editUserId } // Exclude the current user
    });
    console.log(existedUser);

    if (existedUser) {
      const field = existedUser.userName === userName ? 'username' : 'email';
      return res.status(409).json({
        status: 409,
        message: `User already exists with this ${field}`,
        data: null,
        code: 409
      });
    }

    // Find and update, return the updated user
    const updatedUser = await User.findByIdAndUpdate(
      editUserId,
      {
        $set: {
          fullName: fullName,
          userName: userName,
          email: email
        }
      },
      { new: true, select: '-password -__v' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        data: null,
        code: 404
      });
    }


    console.log('user Updated ', updatedUser);
    res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: { user: updatedUser },
      code: 200
    });

  } catch (error) {
    console.error('Error in updateUser:', error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
      code: 500
    });
  }
}

const updateUserProfileImage = async (req, res) => {
  try {
    const userId = req.query.id;
    const profileImgLocalPath = req.file?.path;
    console.log("Profile image local path:", req.file?.path);

    if (!profileImgLocalPath) {
      return res.status(400).json({
        status: 400,
        message: "Profile image not provided",
        data: null,
        code: 400
      });
    }

    const profileImg = await uploadOnCloudinary(profileImgLocalPath);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImg: profileImg.url },
      { new: true, select: '-password -__v' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        data: null,
        code: 404
      });
    }

    res.status(200).json({
      status: 200,
      message: "Profile image updated successfully",
      data: { user: updatedUser },
      code: 200
    });

  } catch (error) {
    console.error('Error in updateUserProfileImage:', error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
      code: 500
    });
  }
}

const searchItem = async (req, res) => {

  try {
    const { searchitem } = req.body
    console.log(req.body);


    if (!searchItem) {
      return res.status(400).json({
        status: 400,
        message: "All fields are required",
        data: null,
        code: 400
      });
    }

    // Get page and limit from query, default to page 1, limit 8
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;


    const data = await User.find({
      fullName: { $regex: searchitem, $options: 'i' }
    })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    // const data = await User.find({ fullName: searchitem }).select('-password')

    // Optionally, get total count for frontend
    const total = await User.countDocuments();

    console.log('user Founded :', data);
    res.status(200).json({
      status: 200,
      message: "User Founded",
      data: data,
      total,
      code: 200
    });



  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
      code: 500
    });
  }
}

// const FilterForName = async (req, res) => {

//   try {
//     const searchitem = req.query.searchitem
   
//     if(searchitem){
//       //  data = await User.find({ fullName: { $regex: searchitem, $options: 'i' } }).limit(4).select('-password');
//         const data = await User.distinct('fullName',{ fullName :  { $regex: searchitem, $options: 'i' }} )
//       console.log(data);

//       return res.status(200).json({
//         status: 200,
//         message: "User Founded",
//         data: data,
//         code: 200
//       })
     
//     }

//     // const users = await User.aggregate([{ $sample: { size: 4 } }])
//     const users = await User.distinct('fullName')
//     // const data = users.silice(0,4)
    
//     return res.status(200).json({
//       status: 200,
//       message: "User Founded",
//       data: users,
//       code: 200
//     });
    
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       status: 500,
//       message: "Internal server error",
//       data: null,
//       code: 500
//     });
//   }
// }

const FilterForName = async (req, res) => {
  try {
    const searchitem = req.query.searchitem || "";
    const limit = parseInt(req.query.limit) || 4;

    let filter = {};
    if (searchitem) {
      filter.fullName = { $regex: searchitem, $options: 'i' };
    }

    // Get distinct full names, optionally filtered and limited
    let data = await User.distinct('fullName', filter);

    // Limit the results
    if(!searchitem) {

      data = data.slice(0, limit);
    }

    return res.status(200).json({
      status: 200,
      message: "User(s) found",
      data: data,
      code: 200
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
      code: 500
    });
  }
}

const ApplyNameFilter = async (req, res) => {
  try {
    const selectedData = req.body.selectedData;

    if (!selectedData || selectedData.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "No data selected",
        data: null,
        code: 400
      });
    }

    // Assuming selectedData is an array of user IDs or names

    const users = await User.find({ fullName:{ $in: selectedData}}).select('-password');

    if (users.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No users found with the selected names",
        data: null,
        code: 404
      });
    }

    res.status(200).json({
      status: 200,
      message: "Users filtered successfully",
      data: users,
      code: 200
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
      code: 500
    });
    
  }


}

const handleStatus = async (req, res) => {
  try {

    const { id } = req.body;


    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "All fields are required",
        data: null,
        code: 400
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        data: null,
        code: 404
      });
    }

    // Toggle status
    user.status = !user.status;
    await user.save();


    res.status(200).json({
      status: 200,
      message: "Users Status updated successfully",
      data: user,
      code: 200
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
      code: 500
    });
  }
}

export { Register, Verify, getAllUsers, updateUser, searchItem, handleStatus , FilterForName , ApplyNameFilter , updateUserProfileImage };