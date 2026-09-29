import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')

  const fetchEvents = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/events', { params })
      setEvents(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    if (search) params.search = search
    if (location) params.location = location
    fetchEvents(params)
  }

  const clearFilters = () => {
    setSearch('')
    setLocation('')
    fetchEvents()
  }

  if (loading) return <div className="loading">Loading events...</div>
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div className="container">
      <h1>Events</h1>

      <form onSubmit={handleSearch} className="filter-form">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" onClick={clearFilters} className="btn btn-outline">Clear</button>
        </div>
      </form>

      {events.length === 0 ? (
        <p className="empty-state">No events found.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <div className="event-meta">
                <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                <span>Location: {event.location}</span>
                <span>Capacity: {event.capacity}</span>
                {event.category && <span>Category: {event.category.name}</span>}
              </div>
              <Link to={`/events/${event._id}`} className="btn btn-primary">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Events
