import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {AuthUser} from "../../auth/models/AuthUser.ts";
import {ProfileService} from "../services/ProfileService.ts";
import {AuthService} from "../../auth/services/AuthService.ts";
import Navbar from "../../public/components/Navbar.tsx";
import {Label} from "../../../shared/components/UI/Label.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";
import Button from "../../../shared/components/UI/Button.tsx";

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
            <Navbar/>
            <div className="w-full justify-items-center mt-5">
                <h1 className="mt-1 text-center text-2xl/9 font-bold tracking-tight text-gray-900">ProfilePage</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 mt-3">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {!changePasswordStatus && !changeUsernameStatus &&
                        <div>
                            <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Session
                                Information</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">Username: {currentUser?.username}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">Email: {currentUser?.email}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">Role: {currentUser?.roles}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 mt-3">
                                <div className="m-1">
                                    <Button variant="secondary"
                                            style={{visibility: !changePasswordStatus ? 'visible' : 'hidden'}}
                                            onClick={() => setChangePasswordStatus(true)}>Change Password
                                    </Button>
                                </div>
                                <div className="m-1">
                                    <Button variant="secondary"
                                            style={{visibility: !changeUsernameStatus ? 'visible' : 'hidden'}}
                                            onClick={() => setChangeUsernameStatus(true)}>Change Username
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                    {changePasswordStatus &&
                        <div>
                            <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Change
                                Password</h2>
                            <form className="space-y-3" onSubmit={handleChangePassword}>
                                <Label>Current Password</Label>
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                                <Label>New Password</Label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 mt-3">
                                    <div className="mt-2">
                                        <Button variant="primary" type="submit">Change Password</Button>
                                    </div>
                                    <div className="mt-2">
                                        <Button variant="secondary"
                                                onClick={() => setChangePasswordStatus(false)}>Cancel</Button>
                                    </div>
                                </div>

                            </form>

                        </div>
                    }
                    {changeUsernameStatus &&
                        <div>
                            <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Change
                                Username</h2>
                            <form className="space-y-3" onSubmit={handleChangeUsername}>
                                <Label>New Username</Label>
                                <Input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 mt-3">
                                    <div className="mt-2">
                                        <Button variant="primary" type="submit">Change Username</Button>
                                    </div>
                                    <div className="mt-2">
                                        <Button variant="secondary"
                                                onClick={() => setChangeUsernameStatus(false)}>Cancel
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    }
                    <div className="m-3">
                        <Button variant="secondary" onClick={() => navigate('/Menu')}>Back to Menu</Button>
                    </div>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {!updateProfileStatus &&
                        <div>
                            <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Profile
                                Information</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">First
                                Name: {first_name}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">Last
                                Name: {last_name}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">Description: {description}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">Profile
                                Picture: {profile_picture_url}</h2>
                            <div className="m-3">
                                <Button style={{visibility: !updateProfileStatus ? 'visible' : 'hidden'}}
                                        onClick={() => setUpdateProfileStatus(true)}>Update Profile
                                </Button>
                            </div>
                        </div>}
                    {updateProfileStatus &&
                        <div>
                            <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Change
                                Profile</h2>
                            <form className="space-y-3" onSubmit={handleUpdateProfile}>
                                <Label>First Name</Label>
                                <Input
                                    placeholder={first_name}
                                    type="text"
                                    value={newFirstName}
                                    onChange={(e) => setNewFirstName(e.target.value)}
                                    required
                                />
                                <Label>Last Name</Label>
                                <Input
                                    placeholder={last_name}
                                    type="text"
                                    value={newLastName}
                                    onChange={(e) => setNewLastName(e.target.value)}
                                    required
                                />
                                <Label>Description</Label>
                                <Input
                                    placeholder={'Description'}
                                    type="text"
                                    value={newDescription}
                                    onChange={(e) => seNewtDescription(e.target.value)}
                                    required
                                />
                                <Label>Profile Picture</Label>
                                <Input
                                    placeholder={profile_picture_url}
                                    type="text"
                                    value={newProfilePictureUrl}
                                    onChange={(e) => setNewProfilePictureUrl(e.target.value)}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 mt-3">
                                    <div className="mt-2">
                                        <Button variant="primary" type="submit">Update Profile
                                        </Button>
                                    </div>
                                    <div className="mt-2">
                                        <Button variant="secondary"
                                                onClick={() => setUpdateProfileStatus(false)}>Cancel
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </div>

    )
};
export default ProfilePage;