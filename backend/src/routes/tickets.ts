import { Router } from 'express';
import { getTickets, createTicket, deleteTicket } from '../controllers/ticketsController';

const router = Router();

router.get('/', getTickets);
router.post('/', createTicket);
router.delete('/:id', deleteTicket);

export default router;
