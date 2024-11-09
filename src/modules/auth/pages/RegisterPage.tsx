import RegisterForm from "../components/RegisterForm.tsx";
import Navbar from "../../public/components/Navbar.tsx";
import {useTranslation} from "react-i18next";

const RegisterPage = () => {
    document.title = "Register Page";
    const [t] = useTranslation("global");
    return(
        <div>
            <Navbar/>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">{t("register.title")}</h1>
                    <RegisterForm/>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
