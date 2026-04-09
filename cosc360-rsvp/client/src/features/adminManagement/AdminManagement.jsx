import React, { useEffect, useState } from 'react';
import { Pencil, Search, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import CreateEventForm from '../event/createEvent/CreateEventForm.jsx';

const AdminManagement = () => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [eventSearch, setEventSearch] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const { activeUserId } = useAuth();

    useEffect(() => {
        if (!activeUserId) {
            setUsers([]);
            setEvents([]);
            return;
        }

        async function fetchData() {
            try {
                const [usersRes, eventsRes] = await Promise.all([
                    fetch('/api/users', { headers: { 'x-user-id': activeUserId } }),
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

    async function handleDeleteUser(userId){
        if(!confirm("Are you sure you want to delete this user?")) return;
        try{
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {'x-user-id': activeUserId},
            });
            if(!response.ok){
                const result = await response.json();
                alert(`Error: ${result.error}`);
                return;
            }
            setUsers(prev => prev.filter(u => u._id !== userId));
        }catch (err){
            console.log('Error deleting user:', err);
        }
    }

    async function handlePromoteUser(userId){
        if(!confirm("Promote this user to admin?")) return;
        try{
            const response = await fetch(`/api/users/${userId}/role`,{
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    'x-user-id': activeUserId,  
                },
                body: JSON.stringify({ role: 'admin'}),
            });
            if(!response.ok){
                const result = await response.json();
                alert(`Error: ${result.error}`);
                return;
            }
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: 'admin'} : u ));
        }catch (err){
            console.log('Error promoting user:', err);
        }
    }

    const filteredUsers = users.filter(u =>
        `${u.firstName} ${u.lastName} ${u.username}`.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredEvents = events.filter(e =>
        e.name?.toLowerCase().includes(eventSearch.toLowerCase())
    );

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
                    <input type="text" placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                    <Search size={18} color="gray" className="search-icon" />
                </div>
                <div className="list">
                    {filteredUsers.map((u) => (
                        <div className="list-item" key={u._id}>
                            <span>{u.firstName} {u.lastName} | {u.username} | {u.role}</span>
                            <div className = "event-actions">
                                {u.role !== 'admin' && (
                                    <button className="settings-btn" onClick={() => handlePromoteUser(u._id)} title="Promote to admin">
                                        <ShieldCheck size={18} color="navy"/>
                                    </button>
                                )}
                                <button className="settings-btn" onClick={() => handleDeleteUser(u._id)} title="Delete user">
                                    <Trash2 size={18} color="red"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="divider" />

            <div className="admin-panel">
                <h2 className="admin-panel-title">Events</h2>
                <div className="admin-search-container">
                    <input type="text" placeholder="Search events..." value={eventSearch} onChange={e => setEventSearch(e.target.value)} />
                    <Search size={18} color="gray" className="search-icon" />
                </div>
                <div className="list">
                    {filteredEvents.map((event) => (
                        <div className="list-item" key={event._id}>
                            <span>{event.name} | {formatDate(event.date)}</span>
                            <div className="event-actions">
                                <button className="settings-btn" onClick={() => setEditingEvent(event)}>
                                    <Pencil size={18} color="navy" />
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