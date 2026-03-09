import { useState } from 'react';
import '../css/topNav.css'
import { Plus, Search } from 'lucide-react';
import CreateEventForm from './CreateEventForm';

function Searchbar( { value, onClick, onChange }) {
     return (
        <div className='search-container'>
            <input type='text' id='top-searchbar' placeholder='Search for an event ...' value={value} onChange={onChange} />
            <Search size={18} color='gray' className='search-icon' onClick={onClick}/>
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
    const [searchQuery, setSearchQuery] = useState("");

    async function handleSearch() {
        const response = await fetch(`http://localhost:3000/events?q=${searchtext}`);
        const data = await response.json();
        console.log(data)
    }

    return (
        <>
            <div className='top-nav'>
                <Searchbar onClick={handleSearch} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                <AddEventButton onClick={() => setShowCreateForm(true)} />
            </div>
            {showCreateForm && (
                <CreateEventForm onClose={() => setShowCreateForm(false)} />
            )}
        </>
    );
}

export default TopNav;