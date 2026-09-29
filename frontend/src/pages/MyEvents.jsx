import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function MyEvents() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyEvents()
  }, [])

  const fetchMyEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/events')
      const allEvents = response.data.data
      // Filter events where createdBy._id matches current user
      const myEvents = allEvents.filter(
        (event) => event.createdBy && event.createdBy._id === user._id
      )
      setEvents(myEvents)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your events')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading your events...</div>
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div className="container">
      <h1>My Events</h1>
      {events.length === 0 ? (
        <p className="empty-state">You haven't created any events yet.</p>
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

export default MyEvents
