import React, { useEffect, useState } from 'react';
import { Pencil, Search, Trash2, ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import CreateEventForm from '../event/createEvent/CreateEventForm.jsx';

const AdminManagement = () => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [eventSearch, setEventSearch] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const { activeUser, activeUserId } = useAuth();

    useEffect(() => {
        if (!activeUserId) {
            setUsers([]);
            setEvents([]);
            return;
        }

        async function fetchData() {
            try {
                const [usersRes, eventsRes] = await Promise.all([
                    fetch('/api/admin', { headers: { 'x-user-id': activeUserId } }),
                    fetch('/api/events'),
                ]);
                const usersData = await usersRes.json();
                const eventsData = await eventsRes.json();
                setUsers(usersData.users || []);
                const allEvents = eventsData.events ?? eventsData;
                setEvents(Array.isArray(allEvents) ? allEvents : []);
            } catch (err) {
                console.log('Error fetching admin data:', err);
            }
        }
        fetchData();
    }, [activeUserId]);

    async function handleDeleteUser(userId) {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await fetch(`/api/admin/${userId}`, {
                method: 'DELETE',
                headers: { 'x-user-id': activeUserId },
            });
            if (!response.ok) {
                const result = await response.json();
                alert(`Error: ${result.error}`);
                return;
            }
            setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            console.log('Error deleting user:', err);
        }
    }

    async function handlePromoteUser(userId, currentRole) {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const message = newRole === 'admin' ? "Promote this user to admin?" : "Demote this user to regular user?";
        if (!confirm(message)) return;
        try {
            const response = await fetch(`/api/admin/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': activeUserId,
                },
                body: JSON.stringify({ role: newRole }),
            });
            if (!response.ok) {
                const result = await response.json();
                alert(`Error: ${result.error}`);
                return;
            }
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));

        } catch (err) {
            console.log('Error promoting user:', err);
        }
    }

    async function handleToggleUserActivation(userId, isCurrentlyActivated) {
        const nextActivationState = !isCurrentlyActivated;
        const confirmationMessage = nextActivationState
            ? "Reactivate this user account?"
            : "Deactivate this user account?";

        if (!confirm(confirmationMessage)) return;

        try {
            const response = await fetch(`/api/admin/${userId}/activation`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': activeUserId,
                },
                body: JSON.stringify({ isActivated: nextActivationState }),
            });

            if (!response.ok) {
                const result = await response.json();
                alert(`Error: ${result.error}`);
                return;
            }

            setUsers(prev => prev.map(u =>
                u._id === userId ? { ...u, isActivated: nextActivationState } : u
            ));
        } catch (err) {
            console.log('Error toggling user activation:', err);
        }
    }

    async function handleDeleteEvent(eventId) {
        if (!activeUserId || activeUser?.role !== 'admin') {
            alert("Only admins can delete events.");
            return;
        }

        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'DELETE',
                headers: { 'x-user-id': activeUserId },
            });

            const result = await response.json();

            if (!response.ok) {
                alert(`Error: ${result.error}`);
                return;
            }

            setEvents(prev => prev.filter(e => e._id !== eventId));
        } catch (err) {
            console.log('Error deleting event:', err);
        }
    }

    const normalizedUserSearch = userSearch.trim().toLowerCase();
    const normalizedEventSearch = eventSearch.trim().toLowerCase();

    const filteredUsers = users.filter((u) => {
        if (!normalizedUserSearch) return true;
        const searchableUserText = `${u.firstName || ""} ${u.lastName || ""} ${u.username || ""} ${u.email || ""}`.toLowerCase();
        return searchableUserText.includes(normalizedUserSearch);
    });

    const filteredEvents = events.filter((e) => {
        if (!normalizedEventSearch) return true;
        const searchableEventText = `${e.name || ""} ${e.location || ""} ${e.description || ""}`.toLowerCase();
        return searchableEventText.includes(normalizedEventSearch);
    });

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function handleEditClose(updatedEvent) {
        setEditingEvent(null);
        if (updatedEvent) {
            setEvents(prev => prev.map(e => e._id === updatedEvent._id ? updatedEvent : e));
        }
    }

    return (
        <div className="admin-management">
            <div className="admin-panel">
                <h2 className="admin-panel-title">Users</h2>
                <div className="admin-search-container">
                    <input type="text" placeholder="Search users by name, username, or email..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                    <Search size={18} color="gray" className="search-icon" />
                </div>
                <div className="list">
                    {filteredUsers.map((u) => {
                        const isActivated = u.isActivated !== false;
                        const isCurrentAdmin = u._id === activeUserId;

                        return (
                            <div className="list-item" key={u._id}>
                                <span>
                                    {u.firstName} {u.lastName} | {u.username} | {u.email || "No email"} | {u.role} | {isActivated ? 'active' : 'deactivated'}
                                </span>
                                <div className="event-actions">

                                    <button className="settings-btn" onClick={() => handlePromoteUser(u._id, u.role)}
                                        title={u.role === 'admin' ? "Demote to user" : "Promote to admin"}>
                                        <ShieldCheck size={18} color={u.role === 'admin' ? "green" : "navy"} />
                                    </button>

                                    <button
                                        className="settings-btn"
                                        onClick={() => handleToggleUserActivation(u._id, isActivated)}
                                        title={
                                            isCurrentAdmin && isActivated
                                                ? "You cannot deactivate your own account"
                                                : (isActivated ? 'Deactivate account' : 'Reactivate account')
                                        }
                                        disabled={isCurrentAdmin && isActivated}
                                    >
                                        {isActivated ? <UserX size={18} color="#cc5500" /> : <UserCheck size={18} color="green" />}
                                    </button>

                                    <button className="settings-btn" onClick={() => handleDeleteUser(u._id)} title="Delete user">
                                        <Trash2 size={18} color="red" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="divider" />

            <div className="admin-panel">
                <h2 className="admin-panel-title">Events</h2>
                <div className="admin-search-container">
                    <input type="text" placeholder="Search events by title, location, or description..." value={eventSearch} onChange={e => setEventSearch(e.target.value)} />
                    <Search size={18} color="gray" className="search-icon" />
                </div>
                <div className="list">
                    {filteredEvents.map((event) => (
                        <div className="list-item" key={event._id}>
                            <span>{event.name} | {event.location || "No location"} | {formatDate(event.date)}</span>
                            <div className="event-actions">
                                <button className="settings-btn" onClick={() => setEditingEvent(event)}>
                                    <Pencil size={18} color="navy" />
                                </button>
                                <button className="settings-btn" onClick={() => handleDeleteEvent(event._id)} title="Delete event">
                                    <Trash2 size={18} color="red" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editingEvent && (
                <CreateEventForm
                    initialData={editingEvent}
                    eventId={editingEvent._id}
                    onClose={handleEditClose}
                />
            )}
        </div>
    );
};

export default AdminManagement;