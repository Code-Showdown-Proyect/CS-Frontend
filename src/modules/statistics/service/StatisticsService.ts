import axios from "axios";
const API_URL = "https://cs-statistics-context.mangograss-fe7e2f05.brazilsouth.azurecontainerapps.io/statistics"

export const StatisticsService = {
    getStatistics: async () => {
        const response = await axios.get(`${API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }});
        return response.data
    }
}