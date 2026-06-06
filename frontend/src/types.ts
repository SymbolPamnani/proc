export interface Ticket {
  _id: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string;
}

export interface TicketsResponse {
  page: number;
  limit: number;
  total: number;
  tickets: Ticket[];
}
