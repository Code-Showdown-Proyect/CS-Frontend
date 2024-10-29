import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CompetitionService } from "../services/CompetitionService";
import { useNavigate } from 'react-router-dom';
import {AuthService} from "../../auth/services/AuthService.ts";
import {ChallengeService} from "../../challenges/services/ChallengeService.ts";
import GenerateChallengeForm from "../../challenges/components/GenerateChallengeForm.tsx";
import {Challenge} from "../models/Challenge.ts";
import {Feedback} from "../models/Feedback.ts";
import {ChatMessage} from "../models/ChatMessage.ts";

const CompetitionLobbyPage: React.FC = () => {
    const location = useLocation();
    const { accessCode, password } = location.state || {};
    const [competitionId, setCompetitionId] = useState<number | null>(null);
    const [competitionName, setCompetitionName] = useState<string | null>(null);
    const [numberOfExercises, setNumberOfExercises] = useState<number | null>(null);
    const [timeLimit, setTimeLimit] = useState<number | null>(null);
    const [creatorName, setCreatorName] = useState<number | null>(null);
    const [creatorId, setCreatorId] = useState<number | null>(null);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [websocket, setWebSocket] = useState<WebSocket | null>(null);
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    const [isNavigating, setIsNavigating] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleLeaveCompetition = async () => {
        try {
            await CompetitionService.leaveCompetition(accessCode);
            alert('You have left the competition successfully.');

            // Cierra el WebSocket si está abierto
            if (websocket) {
                websocket.close();
                setWebSocket(null);
            }

            // Redirige al usuario a la página /JoinCompetition
            navigate('/JoinCompetition');
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`Error al dejar la competencia: ${error.message}`);
            } else {
                alert("Error al dejar la competencia y no se pudo identificar el mensaje del error.");
            }
        }
    };
    const handleGenerateChallenges = async (difficulty: string, topic: string) => {
        if (competitionId && numberOfExercises) {
            for (let i = 0; i < numberOfExercises; i++) {
                try {
                    console.log("Diffuculty: ",difficulty)
                    console.log("Topic: ",topic)
                    await ChallengeService.generateChallenge({
                        difficulty,
                        topic,
                        competition_id: competitionId,
                    });
                } catch (error) {
                    console.error('Error generating challenge:', error);
                }
            }
            if (websocket) {
                websocket.send("list_challenges");
            }
            alert('Challenge Created Successfully.');
            setIsFormVisible(false);
        }
    };
    const handleSendMessage = () => {
        if (websocket && newMessage.trim() !== '') {
            websocket.send(`chat_message ${newMessage}`);
            setNewMessage('');
            console.log('Mensaje enviado:', newMessage)
        }
    };
    const isGenerateButtonDisabled = () => {
        return challenges.length >= (numberOfExercises ?? 0);
    };
    const handleStartCompetition = () => {
        if (websocket) {
            websocket.send("start_competition");
        }
    };

    useEffect(() => {
        const fetchCompetitionId = async () => {
            try {
                const competitionData = await CompetitionService.getCompetitionByAccessCode(accessCode);
                const userdata = await AuthService.getUserData(competitionData.creator_id);
                const currentUser = await AuthService.getCurrentUser();
                setCompetitionId(competitionData.competition_id);
                setCompetitionName(competitionData.name);
                setNumberOfExercises(competitionData.number_of_exercises);
                setTimeLimit(competitionData.time_limit);
                setCreatorName(userdata.username);
                setCreatorId(competitionData.creator_id);
                setCurrentUserId(currentUser.user_id);
            } catch (error) {
                console.error('Error fetching competition ID:', error);
            }
        };
        if (accessCode) {
            fetchCompetitionId();
        }
    }, [accessCode]);

    useEffect(() => {
        if(competitionId!=null){
            // Crear la URL del WebSocket con el competition_id
            const wsUrl = `wss://cs-competition-context.mangograss-fe7e2f05.brazilsouth.azurecontainerapps.io/ws/competition/${competitionId}`;

            // Configurar el WebSocket
            const ws = new WebSocket(wsUrl);

            // Agregar el token al header del WebSocket
            ws.onopen = () => {
                ws.send("list_challenges");
                console.log('Conexión WebSocket abierta')
            };

            ws.onmessage = (event) => {
                console.log('Mensaje recibido:', event.data);
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'chat_message') {
                        setMessages(prevMessages => [...prevMessages, data]);
                    } else if (data.type === 'challenge_list') {
                        setChallenges(data.challenges);
                    } else if(data.type === 'start_competition'){
                        if (websocket) {
                            websocket.close();
                            setWebSocket(null);
                        }
                        navigate('/competition/start', { state: {  accessCode, password, competitionId } });
                    }else if (data.type === 'feedback') {
                        setFeedbacks(prevFeedbacks => [...prevFeedbacks, data.feedback]);
                    } else if (data.type === 'all_participants_done') {
                        console.log('Todos los participantes han terminado.');
                    } else if (data.type === 'users_update'){
                        setConnectedUsers(data.users);
                    }
                } catch (e) {
                    console.error('Error parsing message:', e);
                }
            };

            ws.onclose = () => {
                console.log('Conexión WebSocket cerrada');
                setWebSocket(null);
            };

            ws.onerror = (error) => {
                console.error('Error en la conexión WebSocket:', error);
            };

            // Guardar la instancia del WebSocket en el estado
            setWebSocket(ws);


            const handleBeforeUnload = async () => {
                if (!isNavigating) {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.close();
                    }
                    await CompetitionService.leaveCompetition(accessCode);
                    console.log('Conexión WebSocket cerrada y abandonando la competencia antes de cerrar la pestaña');
                }
            };

            const handleNavigation = () => {
                setIsNavigating(true);
            };

            window.addEventListener('beforeunload', handleBeforeUnload);
            window.addEventListener('popstate', handleNavigation);

            return () => {
                ws.close();
                window.removeEventListener('beforeunload', handleBeforeUnload);
                window.removeEventListener('popstate', handleNavigation);
            };
        }
    }, [competitionId, isNavigating]);

    return (
        <div>
            <h1>Lobby de Competencia</h1>
            <h2>{competitionName}</h2>
            <h2>Number of exercises: {numberOfExercises}</h2>
            <h2>Time Limit(minutes): {timeLimit}</h2>
            <h2>Host: {creatorName}</h2>
            {accessCode ? (
                <div>
                    <p><strong>Código de Acceso:</strong> {accessCode}</p>
                    <p><strong>Contraseña:</strong> {password ? password : 'Sin contraseña establecida'}</p>
                    <p>Comparte estos detalles con los participantes para que puedan unirse a la competencia.</p>
                </div>
            ) : (
                <p>Error: No se encontraron detalles de la competencia.</p>
            )}
            <h2>Usuarios Conectados</h2>
            <ul>
                {connectedUsers.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>

            <h2>Desafíos Recibidos</h2>
            {challenges.length === 0 ? (
                <p>No hay desafíos disponibles aún.</p>
            ) : (
                challenges.map((challenge, index) => (
                    <div key={index}>
                        <h3>Desafío {index + 1}</h3>
                        <p><strong>Título:</strong> {challenge.title}</p>
                    </div>
                ))
            )}

            <h2>Feedbacks Recibidos</h2>
            {feedbacks.length === 0 ? (
                <p>Aún no hay feedbacks disponibles.</p>
            ) : (
                feedbacks.map((feedback, index) => (
                    <div key={index}>
                        <h3>Desafío: {feedback.challenge_title}</h3>
                        <p><strong>Feedback:</strong> {feedback.feedback}</p>
                        <p><strong>Puntuación:</strong> {feedback.score}</p>
                    </div>
                ))
            )}

            <h2>Chat entre Participantes</h2>
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <p>No hay mensajes aún.</p>
                    ) : (
                        messages.map((message, index) => (
                            <div key={index}>
                                <strong>{message.user}:</strong> {message.message}
                            </div>
                        ))
                    )}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                        placeholder="Escribe un mensaje..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
                <button onClick={handleLeaveCompetition}>Left the competition</button>
            </div>
            {isFormVisible && (
                <GenerateChallengeForm
                    onSubmit={handleGenerateChallenges}
                    onCancel={() => setIsFormVisible(false)}
                />
            )}
            {creatorId === currentUserId && (
                <button onClick={() => setIsFormVisible(true)} disabled={isGenerateButtonDisabled()}>Generate Challenges</button>
            )}
            {creatorId === currentUserId && (
                <button onClick={handleStartCompetition} disabled={!isGenerateButtonDisabled}>
                    Start Competition
                </button>
            )}
        </div>
    );
};

export default CompetitionLobbyPage;
