import axios from "axios";

const API_URL = 'https://cs-challenge-context.mangograss-fe7e2f05.brazilsouth.azurecontainerapps.io/challenges'; // Ajusta el URL según tu configuración.

export const ChallengeService = {
    generateChallenge: async (challengeData: {
        difficulty: string,
        topic: string,
        competition_id: number
    }) => {
        try {
            const response = await axios.post(`${API_URL}/generate-challenge`, challengeData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Challenge created:', response.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error creating Challenge:', error.response?.data || error.message);
                throw new Error(error.response?.data?.detail || 'Error creating Challenge');
            } else {
                throw new Error('Unknown Error creating Challenge');
            }
        }
    }
};
