import { Calendar, LogOutIcon, Save, FileBadge } from 'lucide-react';
import "../css/sidebar.css";
import { useNavigate } from 'react-router-dom';

const menuItems = [
    { icon: Calendar, label: "Browse Events" },
    { icon: Save, label: "Saved Events" },
    { icon: FileBadge, label: "My Events" },
];


const MenuItem = ({ icon: Icon, label, clickItem }) => {
    return (
        <div className="menu-item" onClick={clickItem}>
            <Icon className="menu-icon" />
            <span>{label}</span>
        </div>
    )
};

function Sidebar({ user, profilePicture }) {
    const navigate = useNavigate();

    function handleSidebarClick(index){
        if (index === 0) {
            navigate(`/home`);
        } else if (index === 1) {
            navigate(`/savedevents`);
        } else if (index === 2) {
            navigate(`/myevents`);
        }
    }


    return (
        <div className="sidebar">
            <div className="menu-container">
                <div className='profile-section'>
                    <div className='profile-picture'>
                        {profilePicture}
                    </div>
                    <div className="sidebar-header">
                        <h4>{user}</h4>
                        <p>View Profile</p>
                    </div>
                </div>
            </div>
            <div className="menu-container">
                {menuItems.map((item, index) => (
                    <MenuItem 
                        key={index} 
                        icon={item.icon}
                        label={item.label}
                        clickItem={() => handleSidebarClick(index)} />
                ))}
            </div>
            <div className="logout">
                <MenuItem
                    icon={LogOutIcon}
                    label="Logout" /> {/*TODO: add logout functionality with clickItem call once implemented */}
            </div>
        </div>
    
    )
};

export default Sidebar;