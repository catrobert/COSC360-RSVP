import { Calendar, LogOutIcon, Save, FileBadge, AlignEndHorizontal, Users } from 'lucide-react';
import "../css/sidebar.css";

const menuItems = [
    { icon: Calendar, label: "Browse Events" },
    { icon: Save, label: "Saved Events" },
    { icon: FileBadge, label: "My Events" },
];

const adminItems = [
    { icon: AlignEndHorizontal, label: "Analytics"},
    { icon: Users, label: "Users & Events" }
];

const MenuItem = ({ icon: Icon, label }) => {
    return (
        <div className="menu-item">
            <Icon className="menu-icon" />
            <span>{label}</span>
        </div>
    )
};

function AdminSidebar({ user, profilePicture }) {
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
                        label={item.label} />
                ))}
                <div><br></br>
                    <h4> Admin Controls </h4>
                </div>
                {adminItems.map ((item, index) => (
                    <MenuItem
                        key={index}
                        icon={item.icon}
                        label= {item.label} />
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

export default AdminSidebar;