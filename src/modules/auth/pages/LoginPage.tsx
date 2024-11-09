import LoginForm from "../components/LoginForm.tsx";
import logo from "../../../assets/logo.png";
import Navbar from "../../public/components/Navbar.tsx";
import {useTranslation} from "react-i18next";

const LoginPage=() =>{
    document.title = "Login Page";
    const [t] = useTranslation("global");
    return (
        <div>
            <Navbar/>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-32 w-auto rounded-full" src={logo} alt="Code Showdown"/>
                    <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">{t("login.title")}</h1>
                    <LoginForm/>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;