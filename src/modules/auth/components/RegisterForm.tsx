import { useState } from 'react';
import { AuthService } from '../services/AuthService';
import {useNavigate} from "react-router-dom";
import {ProfileService} from "../../user/services/ProfileService.ts";
import {Label} from "../../../shared/components/UI/Label.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {FaSpinner} from "react-icons/fa";
import {useTranslation} from "react-i18next";

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [t] = useTranslation("global");
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert(t("register.confirm-password-alert"));
            return;
        }
        try {
            setIsLoading(true);
            await AuthService.register({ email, password, username, role: 'basic'});
            await ProfileService.createProfile({email, password});
            setIsLoading(false);
            alert(t("register.confirm-register-alert"));
            navigate('/auth/Login');
        } catch (error) {
            setIsLoading(false);
            console.error("Register failed", error);
            alert(t("register.error-register-alert"));
        }
    };

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md justify-items-center">
                        <FaSpinner className="animate-spin h-10 w-10 text-blue-900" />
                        <p className="text-lg font-semibold">{t("register.loading")}</p>
                    </div>
                </div>
            )}
            <form className="space-y-6" onSubmit={handleRegister}>
                <div className="mt-2">
                    <Label>{t("register.email")}:</Label>
                    <Input placeholder={t("register.email-placeholder")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="mt-2">
                    <Label>{t("register.username")}:</Label>
                    <Input placeholder={t("register.username-placeholder")} type="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className="mt-2">
                    <Label>{t("register.password")}:</Label>
                    <Input placeholder="*********" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="mt-2">
                    <Label>{t("register.confirm-password")}:</Label>
                    <Input placeholder="*********" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                           required/>
                </div>
                <Button variant="primary" type="submit">{t("register.register")}</Button>
            </form>
        </div>
    );
};

export default RegisterForm;
