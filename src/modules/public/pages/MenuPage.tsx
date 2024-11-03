import {useNavigate} from 'react-router-dom';
import {useAuth} from "../../auth/hooks/useAuth.ts";
const MenuPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/auth/login'); // Redirigir al usuario al login después de cerrar sesión.
        //console.log("Logout successful:", localStorage.getItem('token'));
    };
    return (
        <div>
            <h1>Menu Page</h1>
            <p>Welcome to the menu page.</p>
            <button type={"button"} onClick={() => navigate('/CreateCompetition', { state: {  mode: "sp" } })}>Single Player</button>
            <button type={"button"} onClick={() => navigate('/OnlineCompetitionMenu')}>MultiPlayer</button>
            <button type={"button"} onClick={() => navigate('/Profile')}>Profile</button>
            <button type={"button"} onClick={() => navigate('')}>Tutorial</button>
            <button onClick={handleLogout}>LogOut</button>
        </div>
    );
}
export default MenuPage;