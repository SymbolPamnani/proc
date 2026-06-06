import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: Date;
}

const ticketSchema: Schema<ITicket> = new Schema({
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
