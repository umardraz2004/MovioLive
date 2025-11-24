import express from 'express';
import { verifyToken } from '../middlewares/authMiddleWare.js';
import { getUserTickets } from '../controllers/ticketController.js';


const router = express.Router();

// Get user's tickets (protected route)
router.get('/my-tickets', verifyToken, getUserTickets);

export default router;