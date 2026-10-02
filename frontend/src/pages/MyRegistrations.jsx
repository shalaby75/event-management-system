import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function MyRegistrations() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchMyRegistrations()
  }, [])

  const fetchMyRegistrations = async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch all events first
      const eventsResponse = await api.get('/events')
      const allEvents = eventsResponse.data.data

      // Fetch registrations for all events in parallel
      const registrationsPromises = allEvents.map((event) =>
        api.get(`/events/${event._id}/registrations`).catch(() => null)
      )
      const registrationsResponses = await Promise.all(registrationsPromises)

      // Filter registrations where user._id matches current user
      const myRegistrations = []
      registrationsResponses.forEach((response, index) => {
        if (!response) return
        const eventRegs = response.data.data
        const myEventRegs = eventRegs.filter(
          (reg) => reg.user && reg.user._id === user._id
        )
        if (myEventRegs.length > 0) {
          myRegistrations.push({
            ...myEventRegs[0],
            event: allEvents[index],
          })
        }
      })

      setRegistrations(myRegistrations)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (reg) => {
    if (!window.confirm(`Cancel your registration for "${reg.event.title}"?`)) return
    setCancellingId(reg._id)
    setMessage('')
    setError('')
    try {
      await api.delete(`/events/${reg.event._id}/register`)
      setRegistrations((prev) => prev.filter((r) => r._id !== reg._id))
      setMessage(`Registration for "${reg.event.title}" cancelled successfully.`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel registration')
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) return <div className="loading">Loading your registrations...</div>

  return (
    <div className="container">
      <h1>My Registrations</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {registrations.length === 0 ? (
        <p className="empty-state">You haven't registered for any events yet.</p>
      ) : (
        <div className="events-grid">
          {registrations.map((reg) => (
            <div key={reg._id} className="event-card">
              <h3>{reg.event.title}</h3>
              <p className="event-description">{reg.event.description}</p>
              <div className="event-meta">
                <span>Date: {new Date(reg.event.date).toLocaleDateString()}</span>
                <span>Location: {reg.event.location}</span>
                {reg.event.category && <span>Category: {reg.event.category.name}</span>}
              </div>
              <p className="registration-date">
                Registered: {new Date(reg.registeredAt).toLocaleDateString()}
              </p>
              <Link to={`/events/${reg.event._id}`} className="btn btn-primary">View Event</Link>
              <button
                onClick={() => handleCancel(reg)}
                disabled={cancellingId === reg._id}
                className="btn btn-danger"
              >
                {cancellingId === reg._id ? 'Cancelling...' : 'Cancel Registration'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRegistrations
