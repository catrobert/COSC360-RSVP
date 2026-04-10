import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import '../css/topNav.css'
import { Plus, Search } from 'lucide-react';
import CreateEventForm from '../features/event/createEvent/CreateEventForm';
import { useAuth } from "../context/AuthContext.jsx";
import LoginOverlay from "./LoginOverlay.jsx";

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
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { activeUser } = useAuth();
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        setSearchQuery(searchParams.get("q") || "");
    }, [searchParams]);

    function getSearchTargetPath() {
        if (location.pathname === "/savedevents") {
            return "/savedevents";
        }

        if (location.pathname === "/myevents") {
            return "/myevents";
        }

        return "/home";
    }

    function updateSearch(nextValue) {
        const targetPath = getSearchTargetPath();
        const targetParams = targetPath === location.pathname
            ? new URLSearchParams(searchParams)
            : new URLSearchParams();

        if (nextValue.trim()) {
            targetParams.set("q", nextValue.trim());
        } else {
            targetParams.delete("q");
        }

        const queryString = targetParams.toString();
        navigate(queryString ? `${targetPath}?${queryString}` : targetPath, { replace: true });
    }

    async function handleSearch() {
        updateSearch(searchQuery);
    }

    return (
        <>
            {showLogin && <LoginOverlay onClose={() => setShowLogin(false)}/>}
            <div className='top-nav'>
                <Searchbar
                    onClick={handleSearch}
                    value={searchQuery}
                    onChange={(e) => {
                        const nextValue = e.target.value;
                        setSearchQuery(nextValue);
                        updateSearch(nextValue);
                    }}
                />
                <AddEventButton onClick={() => {
                    if(!activeUser){
                        setShowLogin(true);
                    }else{
                    setShowCreateForm(true);
                    }
                    }} />
            </div>
            {showCreateForm && (
                <CreateEventForm onClose={() => setShowCreateForm(false)} />
            )}
        </>
    );
}

export default TopNav;