import { Router } from "express";
import { ApplyNameFilter, FilterForName, getAllUsers, handleStatus, Register, searchItem, updateUser, Verify } from "../Controllers/userController.js";

const router = Router();

router.route('/register').post(Register)
router.route('/login').post(Verify)
router.route('/getAllUsers').get(getAllUsers)
router.route('/editUser').post(updateUser)
router.route('/searchUser').post(searchItem)
router.route('/SwitchStatus').post(handleStatus)
router.route('/filteringName').post(FilterForName)
router.route('/ApplyNameFilter').post(ApplyNameFilter)



export default router;