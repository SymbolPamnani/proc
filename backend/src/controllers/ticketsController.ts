import { Request, Response, NextFunction } from 'express';
import { Ticket } from '../models/ticket';
import mongoose from 'mongoose';

const allowedPriorities = ['Low', 'Medium', 'High'];
const allowedStatuses = ['Open', 'In Progress', 'Closed'];

export async function getTickets(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 5, 1);
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const priority = req.query.priority as string | undefined;
    const search = req.query.search as string | undefined;

    const filter: any = {};

    if (status && allowedStatuses.includes(status)) {
      filter.status = status;
    }

    if (priority && allowedPriorities.includes(priority)) {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Ticket.countDocuments(filter);
    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    res.json({ page, limit, total, tickets });
  } catch (error) {
    next(error);
  }
}

export async function createTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const { subject, description, priority, status } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and description are required.' });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Priority must be Low, Medium, or High.' });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status must be Open, In Progress, or Closed.' });
    }

    const ticket = new Ticket({
      subject,
      description,
      priority: priority ?? 'Low',
      status: status ?? 'Open',
    });

    const createdTicket = await ticket.save();
    res.status(201).json(createdTicket);
  } catch (error) {
    next(error);
  }
}

export async function deleteTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid ticket id.' });
    }

    const deleted = await Ticket.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    res.json({ message: 'Ticket deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
