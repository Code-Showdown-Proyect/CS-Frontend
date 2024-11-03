import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {AuthUser} from "../../auth/models/AuthUser.ts";
import {ProfileService} from "../services/ProfileService.ts";
import {AuthService} from "../../auth/services/AuthService.ts";

const ProfilePage: React.FC=() =>{
    const [currentUser, setCurrentUser] = useState<AuthUser|null>(null);
    const [changePasswordStatus, setChangePasswordStatus] = useState<boolean>(false);
    const [updateProfileStatus, setUpdateProfileStatus] = useState<boolean>(false);
    const [changeUsernameStatus, setChangeUsernameStatus] = useState<boolean>(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [email, setEmail] = useState('');
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [description, setDescription] = useState('');
    const [profile_picture_url, setProfile_picture_url] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newDescription, seNewtDescription] = useState('');
    const [newProfilePictureUrl, setNewProfilePictureUrl] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ProfileService.getProfile();
                setEmail(response.email);
                setFirst_name(response.first_name);
                setLast_name(response.last_name);
                setDescription(response.description);
                setProfile_picture_url(response.profile_picture_url);
                const currentUserResponse = await AuthService.getCurrentUser();
                setCurrentUser(currentUserResponse);
            } catch (error) {
                console.error(error);               
            }
        };
        fetchData();
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            email: email,
            current_password: currentPassword,
            new_password: newPassword
        };
        try {
            await AuthService.updatePassword(data);
            alert('Password updated successfully.');
        } catch (error) {
            console.error('Error updating the password:', error);
            alert('There was an error updating the password.');
        }
    }
    const handleChangeUsername = async (e: React.FormEvent) => {
        e.preventDefault()
        const data = {
            email: email,
            new_username: newUsername
        };
        try {
            await AuthService.updateUsername(data);
            alert('Username updated successfully.');
        }catch (error) {
            console.error('Error updating the username:', error);
            alert('There was an error updating the username.');
        }
    }
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            first_name: newFirstName || first_name,
            last_name: newLastName || last_name,
            description: newDescription || description,
            profile_picture_url: newProfilePictureUrl || profile_picture_url
        };
        try {
            await ProfileService.updateProfile(data);
            alert('Profile updated successfully.');
        } catch (error) {
            console.error('Error updating the profile:', error);
            alert('There was an error updating the profile.');
        }
    }
    return (
        <div>
            <h1>ProfilePage</h1>
            <h2>Session Information</h2>
            <h2>Username: {currentUser?.username}</h2>
            <h2>Email: {currentUser?.email}</h2>
            <h2>Role: {currentUser?.roles}</h2>
            <button style={{visibility: !changePasswordStatus ? 'visible' : 'hidden'}}
                    onClick={() => setChangePasswordStatus(true)}>Change Password
            </button>
            <button style={{visibility: !changeUsernameStatus ? 'visible' : 'hidden'}}
                    onClick={() => setChangeUsernameStatus(true)}>Change Password
            </button>
            {changePasswordStatus &&
                <div>
                    <h2>Change Password</h2>
                    <form onSubmit={handleChangePassword}>
                        <label>Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Change Password</button>
                    </form>
                    <button onClick={() => setChangePasswordStatus(false)}>Cancel</button>
                </div>
            }
            {changeUsernameStatus &&
                <div>
                    <h2>Change Username</h2>
                    <form onSubmit={handleChangeUsername}>
                        <label>New Username</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            required
                        />
                        <button type="submit">Change Username</button>
                    </form>
                    <button onClick={() => setChangeUsernameStatus(false)}>Cancel</button>
                </div>
            }
            <h2>Profile Information</h2>
            <h2>First Name: {first_name}</h2>
            <h2>Last Name: {last_name}</h2>
            <h2>Description: {description}</h2>
            <h2>Profile Picture: {profile_picture_url}</h2>
            <button style={{visibility: !updateProfileStatus ? 'visible' : 'hidden'}}
                    onClick={() => setUpdateProfileStatus(true)}>Update Profile
            </button>
            {updateProfileStatus &&
                <div>
                    <h2>Change Profile</h2>
                    <form onSubmit={handleUpdateProfile}>
                        <label>First Name</label>
                        <input
                            type="text"
                            value={newFirstName}
                            onChange={(e) => setNewFirstName(e.target.value)}
                            required
                        />
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={newLastName}
                            onChange={(e) => setNewLastName(e.target.value)}
                            required
                        />
                        <label>Description</label>
                        <input
                            type="text"
                            value={newDescription}
                            onChange={(e) => seNewtDescription(e.target.value)}
                            required
                        />
                        <label>Profile Picture</label>
                        <input
                            type="text"
                            value={newProfilePictureUrl}
                            onChange={(e) => setNewProfilePictureUrl(e.target.value)}
                            required
                        />
                        <button type="submit">Update Profile</button>
                    </form>
                    <button onClick={() => setUpdateProfileStatus(false)}>Cancel</button>
                </div>
            }
            <button onClick={() => navigate('/Menu')}>Back to Menu</button>
        </div>
    )
};
export default ProfilePage;