import { Calendar, LogOutIcon, Save, FileBadge } from 'lucide-react';
import "../css/sidebar.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect } from 'react';

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

function Sidebar({ profilePicture }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const fullName = user ? `${user.firstName} ${user.lastName}` : '';

    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        async function fetchPhoto() {
            try {
                const data = await fetch(`/api/users/profile?userId=${user.id}`);
                const json = await data.json();
                if (json.user?.profilePhoto) {
                    setPhoto(json.user.profilePhoto);
                }
            } catch (err) {
                console.error("Error fetching photo: ", err);
            }
        }

        if (user?.id) fetchPhoto();
    }, [user]);

    function handleLogout() {
        logout();
        localStorage.removeItem("userId");
        navigate('/login');
    }

    function handleSidebarClick(index) {
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
                        {photo ? (
                            <img
                                src={photo}
                                alt="Profile"
                                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                            />
                        ) : (
                            profilePicture
                        )}
                    </div>
                    <div className="sidebar-header">
                        <h4>{fullName}</h4>
                        <p className="view-profile" onClick={() => navigate('/profile')}>View Profile</p>
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
                    label="Logout"
                    clickItem={handleLogout} />
            </div>
        </div>

    )
};

export default Sidebar;