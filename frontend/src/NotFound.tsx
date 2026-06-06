import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="app-shell">
      <section className="notfound-card">
        <h1>404</h1>
        <p>Page not found. The route you entered does not exist.</p>
        <Link className="button button-primary" to="/">
          Go Home
        </Link>
      </section>
    </div>
  );
}
