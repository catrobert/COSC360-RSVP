import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import { useAuth } from "../context/AuthContext.jsx";
import { apiClient } from "../lib/api-client.js";
import "../css/Home.css";
import "../css/Profile.css";
import { CirclePlus } from 'lucide-react';

function ProfilePage(){
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username:"",
        description: [{
            birthday:"",
            gender:"",
            location:"",
        }]
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
                    description: [{
                        birthday: data.user.description?.[0]?.birthday 
                        ? new Date(data.user.description[0].birthday).toISOString().split("T")[0] : "",
                        gender: data.user.description?.[0]?.gender || "",
                        location: data.user.description?.[0]?.location || "",
                    }]
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

    function handleDescriptionChange(e) {
        const {name, value} = e.target;
        setForm((prev) => ({
            ...prev,
            description: [{ ...prev.description[0], [name]: value}]
        }));
    }

    async function handleSave(){
        try{
            const data = await apiClient(`/users/profile?userId=${user.id}`, {
                method: "PUT",
                body: form,
            });
            console.log("Save Response: ", data);
            setProfile(data.user);
            setEditing(false);
            setSaveStatus("Changes saved!");
            setTimeout(() => setSaveStatus(""), 3000);
        }catch (err) {
            console.error("Error saving profile: ", err);
            setSaveStatus("Failed to save changes.");
        }
    }

    async function handlePhotoUpload(e){
        const file = e.target.files[0];
        if(!file) return;

        const formData = new FormData();
        formData.append("profilePhoto", file);

        const response = await fetch(`/api/users/profile/photo?userId=${user.id}`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if(response.ok){
            setProfile(data.user);
        }else{
            console.error("Photo upload failed: ", data.error);
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
                      <div className="profile-picture-wrapper">
                        {profile.profilePhoto ? (
                            <img
                                src={profile.profilePhoto}
                                alt="Profile"
                                className="profile-picture-img"
                            />    
                        ): ( 
                            <div className="profile-picture"></div>
                        )}  
                        <label className="profile-photo-upload-btn" htmlFor="photo-upload">
                            <CirclePlus/>
                        </label> 
                        <input 
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: "none"}}
                            onChange={handlePhotoUpload}
                        />  
                     </div>   
                        <div className="profile-name">
                            <h2>{profile.firstName} {profile.lastName}</h2>
                            <p>@{profile.username}</p>
                        </div>
                    </div>
                

                    {/*Personal Info*/}
                    <div className="profile-card">
                            <h3>Personal Info</h3>
                        <div className="profile-fields">
                        <div className="profile-field-group">   
                            <label>First Name</label>
                            <input
                                className="profile-input"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="First Name"
                            />
                         </div>
                         <div className="profile-field-group">    
                            <label>Last Name</label>
                            <input
                                className="profile-input"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="Last Name"
                            />
                        </div>

                        <div className="profile-field-group">     
                            <label>Username</label>
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
                    </div>

                    {/*Description*/}
                    <div className="profile-card">
                        
                            <h3>Description</h3>
                        

                        <div className="profile-fields">
                           <div className="profile-field-group"> 
                            <label>Birthday</label>
                            <input
                                className="profile-input"
                                name="birthday"
                                type="date"
                                value={form.description[0].birthday}
                                onChange={handleDescriptionChange}
                                disabled={!editing}
                            />
                            </div>
                            <div className="profile-field-group"> 
                            <label>Gender</label>
                            <select
                                className="profile-select"
                                name="gender"
                                value={form.description[0].gender}
                                onChange={handleDescriptionChange}
                                disabled={!editing}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer Not To Say">Prefer Not To Say</option>
                            
                            </select>
                            </div>
                            
                            <div className="profile-field-group"> 
                            <label>Location</label>
                            <input
                                className="profile-input"
                                name="location"
                                value={form.description[0].location}
                                onChange={handleDescriptionChange}
                                disabled={!editing}
                                placeholder="Location"
                            />
                            </div>
                        </div>
                    </div>
                    {/*Save/Edit Button*/}
                    <div className ="profile-btn-row">
                        <button
                            className="profile-edit-btn"
                            onClick={() => setEditing(!editing)}>
                                {editing ? "Cancel" : "Edit"}
                            </button>
                            {editing && (
                                <button className="profile-save-btn" onClick={handleSave}>
                                    Save Changes
                                </button>
                            )}
                    </div>

                    {saveStatus && <p className="profile-status-msg">{saveStatus}</p>}
            </div>
          </div>
        </div>
    );

}

export default ProfilePage;