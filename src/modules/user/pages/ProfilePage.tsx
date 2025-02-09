import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {AuthUser} from "../../auth/models/AuthUser.ts";
import {ProfileService} from "../services/ProfileService.ts";
import {AuthService} from "../../auth/services/AuthService.ts";
import Navbar from "../../public/components/Navbar.tsx";
import {Label} from "../../../shared/components/UI/Label.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {FaSpinner} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import {StatisticsService} from "../../statistics/service/StatisticsService.ts";

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
    const [isLoading, setIsLoading] = useState(false);
    //statistics
    const [competitionsCompleted, setCompetitionsCompleted] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [averageScore, setAverageScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [challengeCompletedCount, setChallengeCompletedCount] = useState(0);

    const navigate = useNavigate();
    const [t] = useTranslation("global")
    document.title = t("profile.title");
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await ProfileService.getProfile();
                setEmail(response.email);
                setFirst_name(response.first_name);
                setLast_name(response.last_name);
                setDescription(response.description);
                setProfile_picture_url(response.profile_picture_url);
                const currentUserResponse = await AuthService.getCurrentUser();
                setCurrentUser(currentUserResponse);
                setIsLoading(false);
                const statistics = await StatisticsService.getStatistics();
                setCompetitionsCompleted(statistics.competition_stats.competitions_completed);
                setTotalScore(statistics.competition_stats.total_score);
                setAverageScore(statistics.competition_stats.average_score);
                setBestScore(statistics.performance_stats.best_score);
                setChallengeCompletedCount(statistics.performance_stats.challenge_completed_count);

            } catch (error) {
                setIsLoading(false);
                alert(t("profile.error-getting-info"));
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
            alert(t("profile.password-updated"));
        } catch (error) {
            console.error('Error updating the password:', error);
            alert(t("profile.error-updating-password"));
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
            alert(t("profile.username-updated"));
        }catch (error) {
            console.error(t("profile.error-updating-username"), " ", error);
            alert(t("profile.error-updating-username"));
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
            alert(t("profile.profile-updated"));
        } catch (error) {
            console.error(t("profile.error-updating-profile")," ", error);
            alert(t("profile.error-updating-profile"));
        }
    }
    return (

        <div>
            <Navbar/>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md justify-items-center">
                        <FaSpinner className="animate-spin h-10 w-10 text-blue-900"/>
                        <p className="text-lg font-semibold">{t("profile.getting-info")}</p>
                    </div>
                </div>
            )}
            <div className="w-full justify-items-center mt-5">
                <h1 className="mt-1 text-center text-2xl/9 font-bold tracking-tight text-gray-900">{t("profile.title")}</h1>
            </div>
            {profile_picture_url ? (
                <img
                    src={`${profile_picture_url}`}
                    alt="Profile"
                    className="mt-5 mx-auto w-40 h-40 rounded-full shadow-lg"
                />
            ) : (
                <p className="text-center mt-4 text-gray-500">No hay imagen de perfil</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 mt-3">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {!changePasswordStatus && !changeUsernameStatus &&
                        <div>
                            <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">{t("profile.session-info")}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">{t("profile.username")}: {currentUser?.username}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">{t("profile.email")}: {currentUser?.email}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">{t("profile.role")}: {currentUser?.roles}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 mt-3">
                                <div className="m-1">
                                    <Button variant="secondary"
                                            style={{visibility: !changePasswordStatus ? 'visible' : 'hidden'}}
                                            onClick={() => setChangePasswordStatus(true)}>{t("profile.change-password")}
                                    </Button>
                                </div>
                                <div className="m-1">
                                    <Button variant="secondary"
                                            style={{visibility: !changeUsernameStatus ? 'visible' : 'hidden'}}
                                            onClick={() => setChangeUsernameStatus(true)}>{t("profile.change-username")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                    {changePasswordStatus &&
                        <div>
                            <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">{t("profile.change-password")}</h2>
                            <form className="space-y-3" onSubmit={handleChangePassword}>
                                <Label>{t("profile.current-password")}</Label>
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                                <Label>{t("profile.new-password")}</Label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 mt-3">
                                    <div className="mt-2">
                                        <Button variant="primary" type="submit">{t("profile.change-password")}</Button>
                                    </div>
                                    <div className="mt-2">
                                        <Button variant="secondary"
                                                onClick={() => setChangePasswordStatus(false)}>{t("profile.cancel")}</Button>
                                    </div>
                                </div>

                            </form>

                        </div>
                    }
                    {changeUsernameStatus &&
                        <div>
                            <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">{t("profile.change-username")}</h2>
                            <form className="space-y-3" onSubmit={handleChangeUsername}>
                                <Label>{t("profile.new-username")}</Label>
                                <Input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 mt-3">
                                    <div className="mt-2">
                                        <Button variant="primary" type="submit">{t("profile.change-username")}</Button>
                                    </div>
                                    <div className="mt-2">
                                        <Button variant="secondary"
                                                onClick={() => setChangeUsernameStatus(false)}>{t("profile.cancel")}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    }
                    <div className="m-3">
                        <Button variant="secondary" onClick={() => navigate('/Menu')}>{t("profile.back")}</Button>
                    </div>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {!updateProfileStatus &&
                        <div>
                            <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">{t("profile.profile-info")}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">{t("profile.first-name")}: {first_name}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">{t("profile.last-name")}: {last_name}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">{t("profile.description")}: {description}</h2>
                            <h2 className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">{t("profile.profile-picture")}</h2>
                            <div className="m-3">
                                <Button style={{visibility: !updateProfileStatus ? 'visible' : 'hidden'}}
                                        onClick={() => setUpdateProfileStatus(true)}>{t("profile.update-profile")}
                                </Button>
                            </div>
                        </div>}
                    {updateProfileStatus &&
                        <div>
                            <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">{t("profile.update-profile")}</h2>
                            <form className="space-y-3" onSubmit={handleUpdateProfile}>
                                <Label>{t("profile.first-name")}</Label>
                                <Input
                                    placeholder={first_name}
                                    type="text"
                                    value={newFirstName}
                                    onChange={(e) => setNewFirstName(e.target.value)}
                                    required
                                />
                                <Label>{t("profile.last-name")}</Label>
                                <Input
                                    placeholder={last_name}
                                    type="text"
                                    value={newLastName}
                                    onChange={(e) => setNewLastName(e.target.value)}
                                    required
                                />
                                <Label>{t("profile.description")}</Label>
                                <Input
                                    placeholder={'Description'}
                                    type="text"
                                    value={newDescription}
                                    onChange={(e) => seNewtDescription(e.target.value)}
                                    required
                                />
                                <Label>{t("profile.profile-picture")}</Label>
                                <Input
                                    placeholder={profile_picture_url}
                                    type="text"
                                    value={newProfilePictureUrl}
                                    onChange={(e) => setNewProfilePictureUrl(e.target.value)}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 mt-3">
                                    <div className="mt-2">
                                        <Button variant="primary" type="submit">{t("profile.update-profile")}
                                        </Button>
                                    </div>
                                    <div className="mt-2">
                                        <Button variant="secondary"
                                                onClick={() => setUpdateProfileStatus(false)}>{t("profile.cancel")}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    }
                </div>
            </div>
            <div className="w-full justify-items-center mt-5">
                <h1 className="mt-1 text-center text-2xl/9 font-bold tracking-tight text-gray-900">{t("profile.statistics")}</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-10 mt-3">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm w-full">
                    <div className="space-y-3">
                        <div className="flex justify-between text-2xl font-medium text-gray-900">
                            <span>{t("statistics.competitions_completed")}:</span>
                            <span>{competitionsCompleted}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-light text-gray-900">
                            <span>{t("statistics.total_score")}:</span>
                            <span>{totalScore}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-light text-gray-900">
                            <span>{t("statistics.average_score")}:</span>
                            <span>{averageScore}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-light text-gray-900">
                            <span>{t("statistics.best_score")}:</span>
                            <span>{bestScore}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-light text-gray-900">
                            <span>{t("statistics.challenge_completed")}:</span>
                            <span>{challengeCompletedCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
};
export default ProfilePage;