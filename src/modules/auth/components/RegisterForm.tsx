import { useState } from 'react';
import { AuthService } from '../services/AuthService';
import {useNavigate} from "react-router-dom";
import {ProfileService} from "../../user/services/ProfileService.ts";
import {Label} from "../../../shared/components/UI/Label.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";
import Button from "../../../shared/components/UI/Button.tsx";

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');

    const navigate = useNavigate();
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }
        try {
            await AuthService.register({ email, password, username, role: 'basic'});
            await ProfileService.createProfile({email, password});
            alert("Registered successfully. You can now login.");
            navigate('/auth/Login');
        } catch (error) {
            console.error("Register failed", error);
            alert("Register failed. Please try again.");
        }
    };

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleRegister}>
                <div className="mt-2">
                    <Label>Email:</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="mt-2">
                    <Label>Username:</Label>
                    <Input type="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className="mt-2">
                    <Label>Password:</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="mt-2">
                    <Label>Confirm Password:</Label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                           required/>
                </div>
                <Button variant="primary" type="submit">Register</Button>
            </form>
        </div>
    );
};

export default RegisterForm;
