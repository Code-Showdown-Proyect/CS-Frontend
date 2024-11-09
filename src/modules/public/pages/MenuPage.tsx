import {useNavigate} from 'react-router-dom';
//import {useAuth} from "../../auth/hooks/useAuth.ts";
import Navbar from "../components/Navbar.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {useTranslation} from "react-i18next";

const MenuPage = () => {
    const navigate = useNavigate();
    const [t] = useTranslation("global");
    // const { logout } = useAuth();
    document.title = "Menu Page";
    /*const handleLogout = () => {
        logout();
        navigate('/auth/login'); // Redirigir al usuario al login después de cerrar sesión.
        //console.log("Logout successful:", localStorage.getItem('token'));
    };*/
    return (
        <div>
            <Navbar/>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">{t("menu.title")}</h1>
                    <p className="mt-1 text-center text-2xl/9 font-light tracking-tight text-gray-900">{t("menu.subtitle")}</p>
                    <div className="mt-2">
                        <Button variant="secondary" type={"button"}
                                onClick={() => navigate('/CreateCompetition', {state: {mode: "sp"}})}>{t("menu.single-player")}
                        </Button>
                    </div>
                    <div className="mt-2">
                        <Button variant="secondary" type={"button"}
                                onClick={() => navigate('/OnlineCompetitionMenu')}>{t("menu.multi-player")}</Button>
                    </div>
                    {/*<button type={"button"} onClick={() => navigate('/Profile')}>Profile</button>
                <button onClick={handleLogout}>LogOut</button>*/}
                </div>
            </div>

        </div>
    );
}
export default MenuPage;