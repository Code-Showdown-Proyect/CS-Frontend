import axios from "axios";
const API_URL = "https://cs-profile-context.mangograss-fe7e2f05.brazilsouth.azurecontainerapps.io/profile"
import {AuthService} from "../../auth/services/AuthService.ts";

export const ProfileService = {
    createProfile: async (data: {email: string, password: string})=>{
        const token = await AuthService.profileValidation(data);
        await axios.post(`${API_URL}/create-profile`,{
                first_name:"",
                last_name:"",
                description:"",
                profile_picture_url:""
        },
            {
            headers: {
                Authorization: `Bearer ${token}`
            }})
    }, getProfile: async ()=>{
        const response = await axios.get(`${API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }});
        return response.data
    },updateProfile: async(data: {first_name: string, last_name: string, description: string, profile_picture_url: string})=>{
        await axios.put(`${API_URL}/update-profile`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }});
    }

}