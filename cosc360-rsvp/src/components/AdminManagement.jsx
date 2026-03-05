import React from 'react';
import { Settings, Trash2, Cog } from 'lucide-react';

//mock user/event data to be replaced with API calls
const mockUsers = [
    {id: 1, name: 'Cat Hudson', email: 'cat1234@gmail.com'},
    {id: 2, name: 'Dudley Dog', email: 'bingbong@gmail.com'},
    {id: 3, name: 'Ryder Floof', email: 'imadog@gmail.com'},
];

const mockEvents = [
    {id: 12, title: 'Summer Festival', date:'July 16 2026'},
    {id: 22, title: 'Winter Festival', date: 'December 24 2026'},
    {id: 32, title: 'Ariana Grande Concert', date: 'May 10 2026'},
    {id: 42, title: 'Jazz in the Park', date: 'June 21 2026'},
];

const AdminManagement = ({users=mockUsers, events = mockEvents}) => {
return(
    <div className="admin-management">
        <div className = "admin-panel">
            <div className = "search-bar">
                <input type="text" placeholder="Search Users"/>
                <span className="search-icon"></span>
            </div>
            <div className="list">
                {users.map((user) => (
                    <div className = "list-item" key={user.id}>
                        <span>{user.name} | {user.email}</span>
                        <button className = "btn-block">Block</button>
                    </div>    
                ))}
            </div>
        </div>

        <div className="divider"/>

        <div className="admin-panel">
            <div className="search-bar">
                <input type="text" placeholder="Search Events"/>
                <span className="search-icon"></span>
            </div>

            <div className ="list">
                {events.map((event)=>(
                    <div className="list-item" key={event.id}>
                        <span>{event.title} | {event.date}</span>
                        <div className="event-actions">
                            <button className="settings-btn">
                                <Cog size={20} color="grey"/>
                            </button>
                            <button className="delete-btn">
                                <Trash2 size={20} color="red" />
                            </button>
                        </div>
                    </div>    
                ))}
            </div>
        </div>
    </div>
);
};
export default AdminManagement;