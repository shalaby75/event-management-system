import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container not-found">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="btn btn-primary">Go to Events</Link>
    </div>
  )
}

export default NotFound
