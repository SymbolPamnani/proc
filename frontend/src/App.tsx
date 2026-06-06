import { FormEvent, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchTickets, createTicket as apiCreateTicket, deleteTicket as apiDeleteTicket } from './api';
import { Ticket } from './types';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Card } from './components/Card';
import { NotFound } from './NotFound';
import './App.css';

const INITIAL_LIMIT = 5;

function AppContent() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(INITIAL_LIMIT);
  const [total, setTotal] = useState(0);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [status, setStatus] = useState<'Open' | 'In Progress' | 'Closed'>('Open');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTickets(page, limit, search);
      setTickets(data.tickets);
      setTotal(data.total);
    } catch (err) {
      setError((err as Error).message || 'Unable to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [page]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!subject.trim() || !description.trim()) {
      setError('Subject and description are required.');
      return;
    }

    setSaving(true);
    try {
      await apiCreateTicket({ subject, description, priority, status });
      setSubject('');
      setDescription('');
      setPriority('Low');
      setStatus('Open');
      setSuccess('Ticket created successfully.');
      setPage(1);
      await loadTickets();
    } catch (err) {
      setError((err as Error).message || 'Could not create ticket');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this ticket?')) {
      return;
    }

    setError(null);
    try {
      await apiDeleteTicket(id);
      setSuccess('Ticket deleted successfully.');
      loadTickets();
    } catch (err) {
      setError((err as Error).message || 'Could not delete ticket');
    }
  };

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <div className="app-shell">
      <header className="hero">
        <h1>MiniHelpDesk</h1>
        <p>Create, view, and delete support tickets with pagination.</p>
      </header>

      <main>
        <section className="grid-two">
          <Card title="Create a New Ticket">
            <form onSubmit={handleSubmit} className="ticket-form">
              <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <label className="input-group">
                <span>Description</span>
                <textarea
                  className="input-field textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </label>
              <label className="input-group">
                <span>Priority</span>
                <select className="input-field" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>
              <label className="input-group">
                <span>Status</span>
                <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </label>
              <div className="form-actions">
                <Button label={saving ? 'Saving...' : 'Create Ticket'} type="submit" disabled={saving} />
              </div>
            </form>
          </Card>

          <Card title="Ticket Summary">
            <div className="summary-row">
              <div className="summary-card">
                <strong>{total}</strong>
                <span>Total Tickets</span>
              </div>
              <div className="summary-card">
                <strong>{tickets.filter((item) => item.priority === 'High').length}</strong>
                <span>High Priority</span>
              </div>
            </div>
            <div className="summary-row">
              <div className="summary-card">
                <strong>{tickets.filter((item) => item.status === 'Open').length}</strong>
                <span>Open</span>
              </div>
              <div className="summary-card">
                <strong>{tickets.filter((item) => item.status === 'Closed').length}</strong>
                <span>Closed</span>
              </div>
            </div>
          </Card>
        </section>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <section>
          <Card title="Ticket List">
            <div className="table-info">
              <span>Showing page {page} of {totalPages}</span>
              <span>{loading ? 'Loading tickets…' : `${tickets.length} tickets loaded`}</span>
            </div>

            <div className="input-group">
              <label htmlFor="search">Search tickets</label>
              <div className="search-row">
                <input
                  id="search"
                  className="input-field"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by subject or description"
                />
                <Button label="Search" type="button" onClick={() => { setPage(1); loadTickets(); }} />
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="empty-state">No tickets found. Create the first ticket above.</div>
            ) : (
              <div className="ticket-list">
                {tickets.map((ticket) => (
                  <div key={ticket._id} className="ticket-item">
                    <div className="ticket-header">
                      <h3>{ticket.subject}</h3>
                      <span className={`tag ${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
                    </div>
                    <p>{ticket.description}</p>
                    <div className="ticket-meta">
                      <span>{ticket.status}</span>
                      <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                    </div>
                    <Button label="Delete" variant="danger" onClick={() => handleDelete(ticket._id)} />
                  </div>
                ))}
              </div>
            )}

            <div className="pagination">
              <Button label="Previous" variant="secondary" disabled={page <= 1 || loading} onClick={() => setPage((prev) => Math.max(prev - 1, 1))} />
              <Button label="Next" variant="secondary" disabled={page >= totalPages || loading} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} />
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
