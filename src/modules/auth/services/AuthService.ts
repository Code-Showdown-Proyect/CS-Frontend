import axios from 'axios';

const API_URL = 'https://cs-auth-context.mangograss-fe7e2f05.brazilsouth.azurecontainerapps.io/auth';

export const AuthService = {
    login: async(credentials: {email: string, password: string}) => {
        const response = await axios.post(`${API_URL}/login`, credentials,{withCredentials:true});
        localStorage.setItem('token', response.data.access_token);
    },
    register: async(data: {email: string, password: string, username: string, role: string}) => {
        await axios.post(`${API_URL}/register`, data);
    },
    logout: async() => {
        await axios.post(`${API_URL}/logout`, {}, {withCredentials:true});
        localStorage.removeItem('token');
    },
    getUserData: async(user_id: number) => {
        const response = await axios.get(`${API_URL}/users/${user_id}`)
        return response.data;
    },
    getCurrentUser: async()=>{
        const response = await axios.get(`${API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }});
        return response.data
    }

}