import { useState } from 'react';
import { AuthService } from '../services/AuthService';
import {useNavigate} from "react-router-dom";

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
            alert("Registered successfully. You can now login.");
            navigate('/auth/Login');
        } catch (error) {
            console.error("Register failed", error);
            alert("Register failed. Please try again.");
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            <div>
                <label>Username:</label>
                <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <div>
                <label>Confirm Password:</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                       required/>
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
