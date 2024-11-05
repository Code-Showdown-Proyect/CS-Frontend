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
import Navbar from "../../public/components/Navbar.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {PaperAirplaneIcon, UserCircleIcon} from "@heroicons/react/16/solid";
import {Input} from "../../../shared/components/UI/Input.tsx";
import {FaSpinner} from "react-icons/fa";

const CompetitionLobbyPage: React.FC = () => {
    const location = useLocation();
    const { accessCode, password, mode } = location.state || {};
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
    const [isLoading, setIsLoading] = useState(false);

    const isSinglePlayer = mode === 'sp';
    const navigate = useNavigate();
    document.title = "Lobby";
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
            if (isSinglePlayer){
                navigate('/Menu');
            }else {
                navigate('/JoinCompetition');
            }
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
            setIsLoading(true);
            try{
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
            }finally {
                setIsFormVisible(false);
                setIsLoading(false);
            }
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
                        navigate('/competition/start', { state: {  accessCode, password, competitionId, mode, timeLimit} });
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
            <Navbar/>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md justify-items-center">
                        <FaSpinner className="animate-spin h-10 w-10 text-blue-900"/>
                        <p className="text-lg font-semibold">Generating Challenges...</p>
                        <p>Please wait while we create the challenges. This might take a few seconds.</p>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pt-9 lg:px-8">
                <div>
                <div className="grid ggrid-cols-1 md:grid-cols-2 gap-4">
                        <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Name: {competitionName}</h2>
                        <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Number of
                            exercises: {numberOfExercises}</h2>
                        <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Time
                            Limit(minutes): {timeLimit}</h2>
                        <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Host: {creatorName}</h2>

                    </div>
                    {!isSinglePlayer && accessCode ? (
                        <div>
                            <p className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900"><strong>
                                Access Code:</strong> {accessCode}</p>
                            <p className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">
                                <strong>Password: </strong> {password ? password : 'Sin contraseña establecida'}</p>
                        </div>
                    ) : null}
                    <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Challenges</h2>
                    {challenges.length === 0 ? (
                        <p className="ml-3">No hay desafíos disponibles aún.</p>
                    ) : (
                        challenges.map((challenge, index) => (
                            <div className="ml-3" key={index}>
                                <h3>Challenge {index + 1}</h3>
                                <p><strong>Title:</strong> {challenge.title}</p>
                            </div>
                        ))
                    )}

                    <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Feedbacks</h2>
                    {feedbacks.length === 0 ? (
                        <p className="ml-3">Aún no hay feedbacks disponibles.</p>
                    ) : (
                        feedbacks.map((feedback, index) => (
                            <div className="ml-3" key={index}>
                                <h3>Desafío: {feedback.challenge_title}</h3>
                                <p><strong>Feedback:</strong> {feedback.feedback}</p>
                                <p><strong>Score:</strong> {feedback.score}</p>
                            </div>
                        ))
                    )}

                    {creatorId === currentUserId && (
                        <div className="justify-items-center w-full mt-5">
                            <div className="max-w-40">
                                <Button variant="primary" onClick={() => setIsFormVisible(true)}
                                        disabled={isGenerateButtonDisabled()}>Generate
                                    Challenges
                                </Button>
                            </div>
                        </div>
                    )}
                    {isFormVisible && (
                        <GenerateChallengeForm
                            onSubmit={handleGenerateChallenges}
                            onCancel={() => setIsFormVisible(false)}
                        />
                    )}
                </div>
                <div>
                    {!isSinglePlayer && (
                        <div>
                            <h2 className="mt-1 mb-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Connected
                                Users</h2>
                            <ul className="ml-3">
                                {connectedUsers.map((user, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <UserCircleIcon className="h-5"/>
                                        <span className="font-medium">{user}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {!isSinglePlayer && (
                        <div>
                            <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Chat</h2>
                            <div className="chat-container mt-2 h-96  border rounded-md p-4 bg-gray-50 m-5">
                                <div
                                    className="chat-messages  h-64 overflow-y-scroll p-2 bg-white border-b border-gray-200 rounded-md">
                                    {messages.length === 0 ? (
                                        <p>No hay mensajes aún.</p>
                                    ) : (
                                        messages.map((message, index) => (
                                            <div key={index} className="mb-2">
                                                <strong>{message.user}:</strong> {message.message}
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div
                                    className="chat-input mt-4 flex flex-col md:flex-row items-center md:space-x-2 space-y-2 md:space-y-0">
                                    <Input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder="Write a message"
                                    />
                                    <Button variant="primary" onClick={handleSendMessage}>
                                        <div className="flex items-center space-x-2">
                                            Send <PaperAirplaneIcon className="h-5 ml-3"/>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:pr-52 md:pl-52 gap-4 mb-10">
                <div className="m-5">
                    <Button variant="secondary" onClick={handleLeaveCompetition}>Left the competition</Button>
                </div>
                {creatorId === currentUserId && (
                    <div className="m-5">
                        <Button variant="primary" onClick={handleStartCompetition}
                                disabled={!isGenerateButtonDisabled}>
                            Start Competition
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompetitionLobbyPage;
