import { Router } from "express";
import { getAllUsers, handleStatus, Register, searchItem, updateUser, Verify } from "../Controllers/userController.js";

const router = Router();

router.route('/register').post(Register)
router.route('/login').post(Verify)
router.route('/getAllUsers').get(getAllUsers)
router.route('/editUser').post(updateUser)
router.route('/searchUser').post(searchItem)
router.route('/SwitchStatus').post(handleStatus)

export default router;