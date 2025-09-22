import express from 'express';
import {
  signup,
  login,
  getUser,
  updateUser,
  deleteUser,
  googleLogin, // Import the new function
} from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin); // Add the new route
router.post('/register', async (req, res) => {
  // Should return JSON, not HTML
  res.json({ message: 'Registration successful' });
});

router.get('/profile', auth, getUser);
router.put('/update', auth, updateUser);
router.delete('/delete/:id', auth, deleteUser);
router.get('/getbyemail/:email', auth, getUser);


export default router;
