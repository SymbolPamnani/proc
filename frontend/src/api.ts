import { Ticket, TicketsResponse } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function fetchTickets(page = 1, limit = 5, search = ''): Promise<TicketsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.append('search', search.trim());
  }

  const response = await fetch(`${API_BASE}/tickets?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to load tickets');
  }

  return response.json();
}

export async function createTicket(ticket: Omit<Ticket, '_id' | 'createdAt'>): Promise<Ticket> {
  const response = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Could not create ticket' }));
    throw new Error(error.message || 'Failed to create ticket');
  }

  return response.json();
}

export async function deleteTicket(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/tickets/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Could not delete ticket' }));
    throw new Error(error.message || 'Failed to delete ticket');
  }
}
