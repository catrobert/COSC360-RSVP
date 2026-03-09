import { useState } from 'react';
import '../css/topNav.css'
import { Plus, Search } from 'lucide-react';
import CreateEventForm from './CreateEventForm';

function Searchbar() {
     return (
        <div className='search-container'>
            <input type='text' id='top-searchbar' placeholder='Search for an event ...' />
            <Search size={18} color='gray' className='search-icon'/>
        </div>
    );
}

function AddEventButton ({ onClick }) {
    return (
        <div className='add-event-btn' onClick={onClick}>
            <div className='add-event-icon'>
                <Plus size= {18} />
                <p>Create Event</p>
            </div>
        </div>
    );
}



function TopNav () {
    const [showCreateForm, setShowCreateForm] = useState(false);

    return (
        <>
            <div className='top-nav'>
                <Searchbar />
                <AddEventButton onClick={() => setShowCreateForm(true)} />
            </div>
            {showCreateForm && (
                <CreateEventForm onClose={() => setShowCreateForm(false)} />
            )}
        </>
    );
}

export default TopNav;