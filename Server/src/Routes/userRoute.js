import { Router } from "express";
import { ApplyNameFilter, FilterForName, getAllUsers, handleStatus, Register, searchItem, updateUser, updateUserProfileImage, Verify } from "../Controllers/userController.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router = Router();

router.route('/register').post(upload.fields([
    {
      name: "profileImg",
      maxCount: 1,
    }
  ]),Register)
router.route('/updateProfileImage').post(upload.single('profileImg'),updateUserProfileImage) 
router.route('/login').post(Verify)
router.route('/getAllUsers').get(getAllUsers)
router.route('/editUser').post(updateUser)
router.route('/searchUser').post(searchItem)
router.route('/SwitchStatus').post(handleStatus)
router.route('/filteringName').post(FilterForName)
router.route('/ApplyNameFilter').post(ApplyNameFilter)



export default router;