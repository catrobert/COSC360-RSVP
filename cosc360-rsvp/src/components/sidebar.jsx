import { Calendar, LogOutIcon } from 'lucide-react';
import "../App.css";

const menuItems = [
    { icon: Calendar, label: "Browse Events" },
    { icon: Calendar, label: "Saved Events" },
    { icon: Calendar, label: "My Events" },
];

const MenuItem = ({ icon: Icon, label, onClick }) => {
    return (
        <div className="menu-item" onClick={onClick}>
            <Icon className="menu-icon" />
            <span>{label}</span>
        </div>
    )
};

function Sidebar({ user, profilePicture }) {
    return (
        <div className="sidebar">
            <div className="menu-container">
                <div className='profile-picture'>
                    {profilePicture}
                </div>
                <div className="sidebar-header">
                    <h4>{user}</h4>
                    <p>View Profile</p>
                </div>
            </div>
            <div className="menu-container">
                {menuItems.map((item, index) => (
                    <MenuItem 
                        key={index} 
                        icon={item.icon}
                        label={item.label} />
                ))}
            </div>
            <div className="logout">
                <MenuItem
                    icon={LogOutIcon}
                    label="Logout" />
            </div>
        </div>
    
    )
};

export default Sidebar;
