import '../css/searchbar.css'

function Searchbar() {
     return (
        <div className='search-container'>
            <input type='text' id='top-searchbar' placeholder='Search for an event ...' />
        </div>
    );
}

function AddEventButton () {
    return (
        <div className='add-event-btn'>

        </div>
    );
}



function TopNav () {
    return (
        <>
            <Searchbar />
            <AddEventButton />
        </>
    );
}

export default TopNav;