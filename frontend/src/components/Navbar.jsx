import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Event Manager
        </Link>
        <div className="navbar-links">
          <Link to="/events" className="nav-link">Events</Link>
          {isAuthenticated ? (
            <>
              <Link to="/my-events" className="nav-link">My Events</Link>
              <Link to="/my-registrations" className="nav-link">My Registrations</Link>
              <Link to="/events/create" className="nav-link">Create Event</Link>
              <span className="nav-user">{user?.name}</span>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
