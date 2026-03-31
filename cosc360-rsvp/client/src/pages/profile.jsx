import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import { useAuth } from "../context/AuthContext.jsx";
import { apiClient } from "../lib/api-client.js";
import "../css/Home.css";
import "../css/Profile.css";

function ProfilePage(){
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username:"",
    });
    const [saveStatus, setSaveStatus] = useState("");

    useEffect(() => {
        async function fetchProfile(){
            try{

                const data = await apiClient(`/users/profile?userId=${user.id}`);
                setProfile(data.user);
                setForm({
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    username: data.user.username,
                });

            } catch (err){
                console.error("Error fetching profile:", err);
            }
        }
        if (user?.id) fetchProfile();
    }, [user]);

    function handleChange(e){
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    }

    async function handleSave(){
        try{
            const data = await apiClient(`/users/profile?userId=${user.id}`, {
                method: "PUT",
                body: form,
            });
            setProfile(data.user);
            setEditing(false);
            setSaveStatus("Changes saved!");
            setTimeout(() => setSaveStatus(""), 3000);
        }catch (err) {
            console.error("Error saving profile: ", err);
            setSaveStatus("Failed to save changes.");
        }
    }

    if (!profile) return <div>Loading...</div>;

    return(
        <div className = "homepage-layout">
            {user?.role === "admin" ? <AdminSidebar /> : <Sidebar/>}
            <div className="main-content">
                <TopNav/>
                <div className="profile-container">
                    {/*Profile pic*/}
                    <div className = "profile-picture-section">
                        <div className="profile-picture">XXX</div>
                        <div className="profile-name">
                            <h2>{profile.firstName} {profile.lastName}</h2>
                            <p>@{profile.username}</p>
                        </div>
                    </div>
                </div>

                    {/*Personal Info*/}
                    <div className="profile-section">
                        <div className="profile-section-header">
                            <h3>Personal Info</h3>
                            <button
                                className="profile-edit-btn"
                                onClick={() => setEditing(!editing)}>
                                    Edit
                                    </button>
                        </div>

                        <div className="profile-fields">
                            <input
                                className="profile-input"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="First Name"
                            />
                            <input
                                className="profile-input"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="Last Name"
                            />
                            <input
                                className="profile-input"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="Username"
                            />
                        </div>
                    </div>

                    {/*Save Button*/}
                    {editing && (
                        <button className="profile-save-btn" onClick={handleSave}>
                            Save Changes
                        </button>
                    )}

                    {saveStatus && <p className="profile-status-msg">{saveStatus}</p>}
            </div>
        </div>
    );

}

export default ProfilePage;