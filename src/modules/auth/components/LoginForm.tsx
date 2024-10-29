import {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from "../context/AuthContext.tsx";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const authContext = useContext(AuthContext); // Obtén el contexto

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            await authContext?.login({ email, password });
            navigate('/menu');
            console.log("Login successful:");
        }catch (error){
            console.error("Login failed", error);
            alert("Login failed, verify your credentials and try again.")
        }
    }
    return(
      <form onSubmit={handleLogin}>
          <div>
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Login</button>
          <button type={"button"} onClick={() => navigate('/auth/register')}>Register</button>
      </form>
    );
}
export default LoginForm;