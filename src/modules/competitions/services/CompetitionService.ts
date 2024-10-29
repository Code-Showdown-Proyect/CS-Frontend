import axios from "axios";

const API_URL = 'https://cs-competition-context.mangograss-fe7e2f05.brazilsouth.azurecontainerapps.io/competitions'; // Ajusta el URL según tu configuración.

export const CompetitionService = {
    createCompetition: async (competitionData: {
        name: string;
        number_of_exercises: number;
        time_limit: number;
        password: string;
    }) => {
        try {
            const response = await axios.post(`${API_URL}/create-competition`, competitionData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Competition created:', response.data)
            return response.data.access_code;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error creating competition:', error.response?.data || error.message);
                throw new Error(error.response?.data?.detail || 'Error al crear la competencia');
            } else {
                throw new Error('Error desconocido al crear la competencia');
            }
        }
    },
    getCompetitionByAccessCode: async (accessCode: string) => {
        const response = await axios.get(`${API_URL}/get-competitions/${accessCode}`);
        return response.data;
    },
    joinCompetition: async (access_code: string, password:string) => {
        try {
            const CompetitorData = {
                access_code,
                password
            }
            const response = await axios.post(`${API_URL}/join-competition`, CompetitorData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Joined competition:', response.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error joining competition:', error.response?.data || error.message);
                throw new Error(error.response?.data?.detail || 'Error al unirse a la competencia');
            } else {
                throw new Error('Error desconocido al unirse a la competencia');
            }
        }

    },
    leaveCompetition: async (accessCode: string) => {
        try {
            const response = await axios.post(`${API_URL}/leave-competition/${accessCode}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Left competition:', response.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error leaving competition:', error.response?.data || error.message);
                throw new Error(error.response?.data?.detail || 'Error to leave the competition');
            } else {
                throw new Error('Error unknown to leave the competition');
            }
        }
    },getParticipantByUserIdAndCompetitionId: async (competitionId: number, userId: number) => {
        const response = await axios.get(`${API_URL}/get-participant/${userId}/${competitionId}`);
        return response.data;
    }
};
