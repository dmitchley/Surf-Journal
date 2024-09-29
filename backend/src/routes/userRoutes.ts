import express from 'express';
import { createUser, UpdateUser, getAllUsers, deleteUser, loginUser, updateUserPassword, selectPreferences, getAllUserPreferences } from '../controllers/userController';
import { protectAdmin } from "../utils/adminAuth"
import { protect } from "../utils/auth"

const router = express.Router();
module.exports = router;

// all users routes
router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/updatepassword/:id').post(protect, updateUserPassword);

router.route('/:id/preferences').post(selectPreferences)


// admin routes
router.route('/delete/:id').delete(protectAdmin, deleteUser);
router.route('/').get(getAllUsers)
router.route('/:id').put(protectAdmin, UpdateUser);
router.route('/users/preferences').get(getAllUserPreferences)

export default router;
