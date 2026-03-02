import '../css/topNav.css'
import { Plus, Search } from 'lucide-react';

function Searchbar() {
     return (
        <div className='search-container'>
            <input type='text' id='top-searchbar' placeholder='Search for an event ...' />
            <Search size={18} color='gray' style={{ padding: '6px 16px 0 0' }}/>
        </div>
    );
}

function AddEventButton () {
    return (
        <div className='add-event-btn'>
            <div className='add-event-icon'>
                <Plus size= {18} />
                <p>Create Event</p>
            </div>
        </div>
    );
}



function TopNav () {
    return (
        <div className='top-nav'>
            <Searchbar />
            <AddEventButton />
      </div>
    );
}

export default TopNav;