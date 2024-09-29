import express from 'express';
import { createJournal, getAllJournals, addCommentToJournal, getPersonalJournals, updateJournal, deleteJournal } from '../controllers/journalController';
import multer from 'multer';
import path from 'path';

const router = express.Router();
module.exports = router;

import { protectAdmin } from "../utils/adminAuth"
import { protect } from "../utils/auth"


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


router.post('/create-journal', upload.single('image'), createJournal);



router.route('/journals/user/:user_id').get(protect, getPersonalJournals);

router.route('/journals/:id').put(protect, updateJournal);

router.route('/journals/:id').delete(protect, deleteJournal);

//router.route('/seedingfakeddata').post(seedFakeData)



router.route('/').get(getAllJournals);



router.post('/journals/:journal_id/comments', addCommentToJournal);





export default router;
