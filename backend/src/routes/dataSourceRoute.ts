import express from 'express';
import {
  getKoelBay
} from "../controllers/dataSourceController"
const router = express.Router();
module.exports = router;



router.route('/koelbay').get(getKoelBay);

module.exports = router;



//import express from 'express';
// import { createUser, UpdateUser, getAllUsers, deleteUser, loginUser, updateUserPassword } from '../controllers/userController';
// import { protectAdmin } from "../utils/adminAuth"
// import { protect } from "../utils/auth"

// const router = express.Router();
// module.exports = router;

// // all users routes
// router.route('/register').post(createUser);
// router.route('/login').post(loginUser);
// router.route('/updatepassword/:id').post(protect, updateUserPassword);




// // admin routes
// router.route('/delete/:id').delete(protectAdmin, deleteUser);
// router.route('/').get(protectAdmin, getAllUsers)
// router.route('/:id').put(protectAdmin, UpdateUser);

// export default router;
