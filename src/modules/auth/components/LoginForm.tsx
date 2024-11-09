import {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from "../context/AuthContext.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";
import {Label} from "../../../shared/components/UI/Label.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {FaSpinner} from "react-icons/fa";
import {useTranslation} from "react-i18next";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const authContext = useContext(AuthContext); // Obtén el contexto
    const [isLoading, setIsLoading] = useState(false);
    const [t] = useTranslation("global");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            setIsLoading(true);
            await authContext?.login({ email, password });
            setIsLoading(false);
            navigate('/menu');
            console.log("Login successful:");
        }catch (error){
            setIsLoading(false);
            console.error("Login failed", error);
            alert("Login failed, verify your credentials and try again.")
        }

    }
    return(
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md justify-items-center">
                        <FaSpinner className="animate-spin h-10 w-10 text-blue-900" />
                        <p className="text-lg font-semibold">{t("login.loading")}</p>
                    </div>
                </div>
            )}
            <form className="space-y-6"  onSubmit={handleLogin}>
                <div className="mt-2">
                    <Label>{t("login.email")}:</Label>
                    <Input id="email" placeholder="email@example.com" type="email" value={email}
                           onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="mt-2">
                    <Label>{t("login.password")}:</Label>
                    <Input id="password" placeholder="********" type="password" value={password}
                           onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <Button variant="primary"  type="submit">{t("login.login")}</Button>
                <Button variant="secondary" type={"button"} onClick={() => navigate('/auth/register')}>{t("login.register")}</Button>
            </form>
        </div>
    );
}
export default LoginForm;