import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [registering, setRegistering] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [registerMessage, setRegisterMessage] = useState('')

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    setLoading(true)
    setError('')
    try {
      const [eventResponse, registrationsResponse] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/registrations`),
      ])
      setEvent(eventResponse.data.data)
      setRegistrations(registrationsResponse.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setRegistering(true)
    setRegisterMessage('')
    try {
      await api.post(`/events/${id}/register`)
      setRegisterMessage('Successfully registered for this event!')
      fetchEvent()
    } catch (err) {
      setRegisterMessage(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  const handleCancelRegistration = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) return
    setCancelling(true)
    setRegisterMessage('')
    try {
      await api.delete(`/events/${id}/register`)
      setRegisterMessage('Successfully cancelled your registration.')
      fetchEvent()
    } catch (err) {
      setRegisterMessage(err.response?.data?.message || 'Failed to cancel registration')
    } finally {
      setCancelling(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await api.delete(`/events/${id}`)
      navigate('/events')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event')
    }
  }

  if (loading) return <div className="loading">Loading event...</div>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!event) return <div className="empty-state">Event not found.</div>

  const isCreator = user && event.createdBy && user._id === event.createdBy._id
  const myRegistration = user && registrations.find((reg) => reg.user && reg.user._id === user._id)
  const isFull = registrations.length >= event.capacity

  return (
    <div className="container">
      <div className="event-detail-card">
        <h1>{event.title}</h1>
        <p className="event-description">{event.description}</p>
        <div className="event-meta-detail">
          <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Capacity:</strong> {event.capacity}</p>
          {event.category && <p><strong>Category:</strong> {event.category.name}</p>}
          {event.createdBy && <p><strong>Created by:</strong> {event.createdBy.name}</p>}
        </div>

        {registerMessage && (
          <div className={`alert ${registerMessage.includes('Successfully') ? 'alert-success' : 'alert-error'}`}>
            {registerMessage}
          </div>
        )}

        <div className="event-actions">
          {isAuthenticated && !isCreator && (
            myRegistration ? (
              <>
                <span className="alert alert-success">Already Registered</span>
                <button
                  onClick={handleCancelRegistration}
                  disabled={cancelling}
                  className="btn btn-danger"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Registration'}
                </button>
              </>
            ) : isFull ? (
              <button className="btn btn-primary" disabled>
                Event Full
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="btn btn-primary"
              >
                {registering ? 'Registering...' : 'Register for Event'}
              </button>
            )
          )}
          {isCreator && (
            <>
              <Link to={`/events/${id}/edit`} className="btn btn-outline">Edit</Link>
              <button onClick={handleDelete} className="btn btn-danger">Delete</button>
            </>
          )}
          <Link to="/events" className="btn btn-outline">Back to Events</Link>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
