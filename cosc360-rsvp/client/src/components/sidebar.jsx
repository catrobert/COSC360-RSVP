import { Calendar, LogOutIcon, Save, FileBadge, LogInIcon } from 'lucide-react';
import "../css/sidebar.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect } from 'react';
import LoginOverlay from "./LoginOverlay.jsx";
import { apiClient } from "../lib/api-client.js";

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
    const { activeUser, activeUserId, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const fullName = activeUser ? `${activeUser.firstName} ${activeUser.lastName}` : '';

    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        async function fetchPhoto() {
            try {
                const data = await apiClient(`/users/profile?userId=${activeUserId}`);
                if (data.user?.profilePhoto) {
                    setPhoto(data.user.profilePhoto);
                }
            } catch (err) {
                console.error("Error fetching photo: ", err);
            }
        }

        if (activeUserId) fetchPhoto();
    }, [activeUserId]);

    function handleLogout() {
        logout();
        navigate('/login');
    }

    function handleSidebarClick(index) {
        if (index === 0) {
            navigate(`/home`);
        } else if (!activeUser) {
            setShowLogin(true);
        } else if (index === 1) {
            navigate(`/savedevents`);
        } else if (index === 2) {
            navigate(`/myevents`);
        }
    }


    return (
        <>
            {showLogin && <LoginOverlay onClose={() => setShowLogin(false)} />}
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
                            {activeUser ? (
                                <>
                                    <h4>{fullName}</h4>
                                    <p className="view-profile" onClick={() => navigate('/profile')}>View Profile</p>
                                </>
                            ) : (
                                <h4>Guest</h4>
                            )}
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
                    {activeUser ? (
                        <MenuItem icon={LogOutIcon} label="Logout" clickItem={handleLogout} />
                    ) : (
                        <MenuItem icon={LogInIcon} label="Login" clickItem={() => setShowLogin(true)} />
                    )}
                </div>
            </div>
        </>
    )
};

export default Sidebar;