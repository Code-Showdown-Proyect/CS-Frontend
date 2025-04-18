import axios from "axios";

const API_URL = 'https://cs-challenge-context.mangograss-fe7e2f05.brazilsouth.azurecontainerapps.io/challenges'; // Ajusta el URL según tu configuración.
const API_CLUES= 'https://cs-challenge-context.mangograss-fe7e2f05.brazilsouth.azurecontainerapps.io/clues'; // Ajusta el URL según tu configuración.
const API_TOPICS= 'https://cs-challenge-context.mangograss-fe7e2f05.brazilsouth.azurecontainerapps.io/topics';

export const ChallengeService = {
    generateChallenge: async (challengeData: {
        difficulty: string,
        topic: string,
        competition_id: number,
        numberOfClues: number
    }) => {
        try {
            const response = await axios.post(`${API_URL}/generate-challenge`, challengeData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Challenge created:', response.data)
            if(challengeData.numberOfClues > 0 ){
                const cluesRequest = {
                    challenge_id: response.data.id,
                    challenge_text: response.data.description,
                    number_of_clues: challengeData.numberOfClues
                };
                const responseClues = await axios.post(`${API_CLUES}/generate-clues`, cluesRequest, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log('Clues created:', responseClues.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error creating Challenge:', error.response?.data || error.message);
                throw new Error(error.response?.data?.detail || 'Error creating Challenge');
            } else {
                throw new Error('Unknown Error creating Challenge');
            }
        }
    },
    getCluesbyChallengeId: async (challengeId: number) => {
        try {
            const response = await axios.get(`${API_CLUES}/${challengeId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching clues:', error.response?.data || error.message);
                throw new Error(error.response?.data?.detail || 'Error fetching clues');
            } else {
                throw new Error('Unknown Error fetching clues');
            }
        }
    },
    getTopicsByDifficulty: async (difficulty: string) => {
        try {
            const response = await axios.get(`${API_TOPICS}/${difficulty}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching topics:', error.response?.data || error.message);
                throw new Error(error.response?.data?.detail || 'Error fetching topics');
            } else {
                throw new Error('Unknown Error fetching topics');
            }
        }
    }
};
