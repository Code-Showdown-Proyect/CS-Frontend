import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Challenge} from "../models/Challenge.ts";
import { FeedbackMessage} from "../models/Feedback.ts";
import {AuthService} from "../../auth/services/AuthService.ts";
import {CompetitionService} from "../services/CompetitionService.ts";
import Navbar from "../../public/components/Navbar.tsx";
import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import Button from "../../../shared/components/UI/Button.tsx";
import {ChatMessage} from "../models/ChatMessage.ts";
import {Input} from "../../../shared/components/UI/Input.tsx";
import {PaperAirplaneIcon} from "@heroicons/react/16/solid";
import {FaSpinner} from "react-icons/fa";

const OnlineCompetitionPage:React.FC=()=>{
    const location = useLocation();
    const navigate = useNavigate();
    const { accessCode, password, competitionId, mode, timeLimit} = location.state;
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [code, setCode] = useState<string>("");
    const [websocket, setWebsocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentParticipantId, setCurrentParticipantId] = useState<number | null>(null);
    const [waitingForOthers, setWaitingForOthers] = useState<boolean>(false);
    const [competitionFinished, setCompetitionFinished] = useState<boolean>(false);
    const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([]);
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');
    const [timeRemaining, setTimeRemaining] = useState<number>((timeLimit/5) * 60);

    const isSinglePlayer = mode === 'sp';
    document.title = "Competition";

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const currentUser = await AuthService.getCurrentUser();
                const participantId = await CompetitionService.getParticipantByUserIdAndCompetitionId(competitionId, currentUser.user_id);
                setCurrentParticipantId(participantId.participant_id);
                console.log("Current user", currentUser.user_id);
            } catch (error) {
                console.error("Error fetching current user ID:", error);
            }
        };
        fetchUserId();
    }, []);


    useEffect(() => {
        if (currentParticipantId === null) {
            return;
        }
        const wsUrl = `wss://cs-competition-context.mangograss-fe7e2f05.brazilsouth.azurecontainerapps.io/ws/competition/${competitionId}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("Connected to websocket");
            ws.send('send_challenges');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chat_message') {
                setMessages(prevMessages => [...prevMessages, data]);
            } else if (data.type === 'new_challenge') {
                setChallenge(data);
                setWaitingForOthers(false); // Permitir enviar la respuesta ya que hay un nuevo desafío.
            }  else if (data.message === 'Waiting_others') {
                setWaitingForOthers(true); // Deshabilitar el envío de respuestas mientras se espera a los demás.
            } else if (data.action === 'all_participants_done') {
                console.log('all_participants_done');
                setCompetitionFinished(true);
                setWaitingForOthers(false);
            }else if (data.type === 'feedbacks') {
                setCompetitionFinished(true);
                console.log('Receiving feedbacks:', data);
                setFeedbacks(data.data); // `data.data` es un array de `FeedbackMessage`
            }
        }

        ws.onclose = () => {
            console.log("Disconnected from websocket");
        }

        ws.onerror = (error) => {
            console.error("Error on websocket connection",error);
        }

        setWebsocket(ws);

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
        window.addEventListener('popstate', handleNavigation);
        // Añadir el evento `beforeunload` para cerrar la conexión al cerrar la pestaña o navegar
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            // Remover el evento `beforeunload` y cerrar el WebSocket al desmontar el componente
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener('popstate', handleNavigation);
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
                console.log("WebSocket closed on component unmount");
            }
        };

    }, [competitionId, currentParticipantId]);

    useEffect(() => {
        if (timeRemaining <= 0) {
            handleSubmitCode(code);
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, code]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    const handleSendMessage = () => {
        if (websocket && newMessage.trim() !== '') {
            websocket.send(`chat_message ${newMessage}`);
            setNewMessage('');
            console.log('Mensaje enviado:', newMessage)
        }
    };

    const handleSubmitCode = (code: string) => {
        if(websocket&&challenge&&!waitingForOthers && !competitionFinished){
            console.log('Code submitted:', code);
            websocket.send(`submit_answer ${code}`);
            setCode("");
            setWaitingForOthers(true);
        }
    }
/*    const handleRequestFeedbacks = () => {
        if (websocket && !competitionFinished) {
            websocket.send('feedback_response');
            console.log('Requesting feedbacks...');
        }
    };*/
    if (competitionFinished) {
        const participantFeedbacks = feedbacks.find(fb => fb.participant_id === currentParticipantId);
        console.log('participantFeedbacks:', participantFeedbacks);
        if (!participantFeedbacks || participantFeedbacks.feedbacks.length === 0) {
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md justify-items-center">
                        <FaSpinner className="animate-spin h-10 w-10 text-blue-900"/>
                        <p className="text-lg font-semibold">Generating Feedbacks...</p>
                        <p>Please wait while we create the feedbacks. This might take a few seconds.</p>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <Navbar/>
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                        <h1 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Feedback
                            Summary</h1>
                        {participantFeedbacks.feedbacks.map((feedback, index) => (
                            <div key={index}>
                                <h3 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">{feedback.challenge_title}</h3>
                                <ReactMarkdown
                                    className="whitespace-pre-wrap break-words">{feedback.feedback}</ReactMarkdown>
                                <p className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">
                                    <strong>Score:</strong> {feedback.score}</p>
                            </div>
                        ))}
                        <Button variant="secondary" onClick={() => navigate('/CompetitionLobby', {
                            state: {
                                accessCode,
                                password,
                                competitionId,
                                mode
                            }
                        })}>Back to Lobby</Button>
                    </div>
                </div>

            </div>
        );
    }
    return (
        <div>
            <Navbar/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-screen">
                <div className="challenge-section">
                    <h1 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Competition in
                        Progress</h1>
                    <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Current
                        Challenge</h2>
                    <p className="mt-1 text-left text-2xl/9 font-light tracking-tight text-gray-900">Time
                        Remaining: {formatTime(timeRemaining)}</p>

                    <div className="overflow-y-scroll overflow-x-hidden max-h-[50vh] p-2 bg-white rounded-md shadow-md">
                    {waitingForOthers ? (
                            <div>
                                <p className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">WAIT
                                    FOR OTHERS TO FINISH THE CHALLENGE</p>
                            </div>
                        ) : challenge ? (
                            <div>
                                <h3>{challenge.title}</h3>
                                <ReactMarkdown
                                    className="whitespace-pre-wrap break-words">{challenge.description}</ReactMarkdown>
                                <pre className="whitespace-pre-wrap break-words">{challenge.output_example}</pre>
                            </div>
                        ) : (
                            <p>No challenge yet</p>
                        )}
                    </div>
                </div>

                <div className="code-section">
                    <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Send your Solution</h2>
                    <CodeMirror
                        value={code}
                        extensions={[python()]}
                        theme="dark"
                        height="300px"
                        onChange={(value) => setCode(value)}
                        placeholder="Write your code here..."
                        readOnly={waitingForOthers}
                    />
                    <div className="m-5">
                        <Button variant="primary"
                                onClick={() => handleSubmitCode(code)}
                                disabled={!challenge || code.trim() === '' || waitingForOthers} // Desactivar botón cuando se está esperando o no hay desafío
                        >
                            Submit Code
                        </Button>
                    </div>

                    {/*<Button onClick={handleRequestFeedbacks}>
                        Request Feedbacks
                    </Button>*/}
                </div>
                {waitingForOthers && (
                    <p className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Waiting for other participants to finish...</p>
                )}
                {!isSinglePlayer && (
                    <div className="chat-section">
                        <h2 className="mt-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Participants
                            Chat</h2>
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
                )}
            </div>
        </div>
    );
};
export default OnlineCompetitionPage;
